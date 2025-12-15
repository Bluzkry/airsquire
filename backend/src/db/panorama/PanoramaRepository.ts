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
});

export const PanoramaModel = model("Panorama", PanoramaSchema);

export class PanoramaRepository {
	async insertOne(panorama: PanoramaDocument) {
		log.info({ message: "Inserting panorama metadata into MongoDB.", metadata: panorama });

		const document = await PanoramaModel.create(panorama);

		log.info({ message: "Panorama metadata inserted successfully into MongoDB.", id: document._id });
		return document;
	}

	async getMany() {
		log.info({ message: "Getting panoramas metadata from MongoDB." });

		const documents = await PanoramaModel.find().sort({ createdAt: -1 }).limit(GET_PANORAMAS_LIMIT);

		log.info({ message: "Panoramas successfully gotten from MongoDB.", count: documents.length });
		return documents;
	}
}
