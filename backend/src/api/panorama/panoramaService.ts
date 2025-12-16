import { GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { StatusCodes } from "http-status-codes";
import path from "path";
import { pino } from "pino";
import { ServiceResponse } from "@/common/models/serviceResponse";
import { PanoramaRepository } from "@/db/panorama/PanoramaRepository";
import type { PanoramaUploadBodyType } from "./panoramaModel";
import {
	PANORAMA_BOOKMARK_SUCCESS_MESSAGE,
	PANORAMA_GET_MANY_SUCCESS_MESSAGE,
	PANORAMA_UPLOAD_SUCCESS_MESSAGE,
} from "./panoramaModel";

const log = pino({ name: "Panorama Service" });

const { AWS_REGION, AWS_ACCESS_KEY, AWS_SECRET_ACCESS_KEY, AWS_S3_BUCKET } = process.env;
if (!AWS_REGION || !AWS_ACCESS_KEY || !AWS_SECRET_ACCESS_KEY || !AWS_S3_BUCKET) {
	throw new Error("Missing required AWS environment variables.");
}

const s3Client = new S3Client({
	region: AWS_REGION,
	credentials: {
		accessKeyId: AWS_ACCESS_KEY,
		secretAccessKey: AWS_SECRET_ACCESS_KEY,
	},
});

export class PanoramaService {
	private panoramaRepository: PanoramaRepository;

	constructor(repository: PanoramaRepository = new PanoramaRepository()) {
		this.panoramaRepository = repository;
	}

	private createFilter = (search: string) => ({
		$or: search
			.split(",")
			.map((n) => n.trim())
			.filter(Boolean)
			.map((term) => ({
				name: { $regex: term, $options: "i" },
			})),
	});

	public async getPanoramas(search: string | undefined) {
		try {
			let filter = {};
			if (search) filter = this.createFilter(search);

			const panoramas = await this.panoramaRepository.findMany(filter);
			return ServiceResponse.success(PANORAMA_GET_MANY_SUCCESS_MESSAGE, panoramas);
		} catch (err) {
			const errorMessage = err instanceof Error ? { message: err.message, stack: err.stack } : err;
			log.error({ message: "Error getting panoramas.", error: errorMessage });
			return ServiceResponse.failure(
				"Failed to get panoramas.",
				{ error: errorMessage },
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	private async downloadFromAws(s3Key: string) {
		log.info({ message: "Downloading panorama from AWS.", Key: s3Key });
		const awsParams = {
			Bucket: AWS_S3_BUCKET,
			Key: s3Key,
		};

		const { Body, ETag, VersionId } = await s3Client.send(new GetObjectCommand(awsParams));
		log.info({
			message: "Panorama downloaded successfully from AWS.",
			awsResponse: { ETag, VersionId },
		});

		return Body;
	}

	public async downloadPanoramaStream(id: string) {
		try {
			const metadata = await this.panoramaRepository.findOne(id);
			if (!metadata || !metadata.s3Key) throw new Error("No S3Key found from MongoDB metadata.");

			const panoramaStream = await this.downloadFromAws(metadata.s3Key);

			if (!panoramaStream) throw new Error("No panorama stream downloaded from AWS.");
			return { panoramaStream, metadata };
		} catch (err) {
			throw err;
		}
	}

	private async uploadToAws(panorama: Express.Multer.File) {
		const s3Key = `${panorama.originalname}-${Date.now()}`;
		log.info({ message: "Uploading panorama into AWS.", Key: s3Key });
		const awsParams = {
			Bucket: AWS_S3_BUCKET,
			Key: s3Key,
			Body: panorama.buffer,
			ContentType: panorama.mimetype,
		};

		const { ETag, VersionId, RequestCharged } = await s3Client.send(new PutObjectCommand(awsParams));
		log.info({
			message: "Panorama uploaded successfully into AWS.",
			awsResponse: { ETag, VersionId, RequestCharged },
		});

		return s3Key;
	}

	public async insertPanorama(body: PanoramaUploadBodyType, files: Array<Express.Multer.File>) {
		try {
			const s3Key = await this.uploadToAws(files[0]);

			const { uid, name, type, lastModifiedDate, size } = body;
			const inserted = await this.panoramaRepository.insertOne({
				uid,
				s3Key,
				name: path.parse(name).name,
				type,
				createdAt: new Date(),
				fileModifiedAt: new Date(lastModifiedDate),
				updatedAt: new Date(),
				size,
				bookmark: false,
			});

			return ServiceResponse.success(PANORAMA_UPLOAD_SUCCESS_MESSAGE, { id: inserted._id });
		} catch (err) {
			const errorMessage = err instanceof Error ? { message: err.message, stack: err.stack } : err;
			log.error({ message: "Error uploading panorama.", error: errorMessage });
			return ServiceResponse.failure(
				"Failed to upload panorama.",
				{ error: errorMessage },
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}

	public async updatePanoramaBookmark({ id, bookmark }: { id: string; bookmark: boolean }) {
		try {
			const updated = await this.panoramaRepository.updateOne(id, { bookmark, updatedAt: new Date() });

			return ServiceResponse.success(PANORAMA_BOOKMARK_SUCCESS_MESSAGE, {
				_id: updated._id,
				bookmark: updated.bookmark,
			});
		} catch (err) {
			const errorMessage = err instanceof Error ? { message: err.message, stack: err.stack } : err;
			log.error({ message: "Error updating panorama bookmark.", error: errorMessage });
			return ServiceResponse.failure(
				"Failed to update panorama bookmark.",
				{ error: errorMessage },
				StatusCodes.INTERNAL_SERVER_ERROR,
			);
		}
	}
}

export const panoramaService = new PanoramaService();
