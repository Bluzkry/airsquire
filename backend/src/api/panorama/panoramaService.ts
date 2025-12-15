import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { StatusCodes } from "http-status-codes";
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

	public async getAllPanoramas() {
		try {
			const panoramas = await this.panoramaRepository.getMany();
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

	public async insertPanorama(
		body: PanoramaUploadBodyType,
		files: Array<Express.Multer.File>,
	): Promise<ServiceResponse<null | unknown>> {
		try {
			const s3Key = await this.uploadToAws(files[0]);

			const { uid, name, type, lastModifiedDate, size } = body;
			const inserted = await this.panoramaRepository.insertOne({
				uid,
				s3Key,
				name,
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

	private async uploadToAws(panorama: Express.Multer.File): Promise<string> {
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

	public async updatePanoramaBookmark({ id, bookmark }: { id: string; bookmark: boolean }) {
		try {
			const updated = await this.panoramaRepository.updateOne(id, { bookmark });

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
