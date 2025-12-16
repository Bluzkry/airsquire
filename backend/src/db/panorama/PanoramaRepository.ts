import { model, Schema } from "mongoose";
import pino from "pino";
import { GET_PANORAMAS_LIMIT } from "@/api/panorama/panoramaModel";

const log = pino({ name: "Panorama Repository" });

interface PanoramaDocument {
	uid: string;
	s3Key: string;
	name: string;
	type: string;
	createdAt: Date;
	fileModifiedAt: Date;
	updatedAt: Date;
	size: string;
	bookmark: boolean;
}

export const PanoramaSchema = new Schema({
	uid: String,
	s3Key: String,
	name: String,
	type: String,
	createdAt: Date,
	fileModifiedAt: Date,
	updatedAt: Date,
	size: String,
	bookmark: Boolean,
});

export const PanoramaModel = model("Panorama", PanoramaSchema);

export class PanoramaRepository {
	async findOne(_id: string) {
		try {
			log.info({ message: "Finding panorama metadata from MongoDB.", _id });

			const document = await PanoramaModel.findById(_id).lean().exec();
			if (!document) throw new Error("Panorama metadata not found.");

			log.info({ message: "Found panorama metadata", _id, document });
			return document;
		} catch (err) {
			const errorMessage = err instanceof Error ? { message: err.message, stack: err.stack } : err;
			log.error({ message: "Failed to get panorama", error: errorMessage });
			throw err;
		}
	}

	async findMany(filter = {}) {
		try {
			log.info({ message: "Finding panoramas metadata from MongoDB: ", filter });

			const documents = await PanoramaModel.find(filter)
				.sort({ createdAt: -1 })
				.limit(GET_PANORAMAS_LIMIT)
				.lean()
				.exec();

			log.info({ message: "Found panoramas metadata.", count: documents.length });
			return documents;
		} catch (err) {
			const errorMessage = err instanceof Error ? { message: err.message, stack: err.stack } : err;
			log.error({ message: "Failed to find panoramas", error: errorMessage });
			throw err;
		}
	}

	async insertOne(panorama: PanoramaDocument) {
		try {
			log.info({ message: "Inserting panorama metadata into MongoDB.", metadata: panorama });

			const document = await PanoramaModel.create(panorama);

			log.info({ message: "Panorama metadata inserted successfully into MongoDB.", id: document._id });
			return document;
		} catch (err) {
			const errorMessage = err instanceof Error ? { message: err.message, stack: err.stack } : err;
			log.error({ message: "Failed to insert panorama", error: errorMessage, panorama });
			throw err;
		}
	}

	async updateOne(_id: string, updatedData: Record<string, any>) {
		try {
			log.info({ message: "Updating panoramas metadata for MongoDB.", updatedData });

			const result = await PanoramaModel.findOneAndUpdate({ _id }, { $set: updatedData }).lean().exec();
			if (!result) throw new Error("Panorama ID to update not found.");

			log.info({ message: "Updated panorama metadata." });
			return result;
		} catch (err) {
			const errorMessage = err instanceof Error ? { message: err.message, stack: err.stack } : err;
			log.error({ message: "Failed to update panorama.", error: errorMessage, _id });
			throw err;
		}
	}
}
