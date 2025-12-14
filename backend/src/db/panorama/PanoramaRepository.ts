import { model, Schema } from "mongoose";
import pino from "pino";

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

		const response = await PanoramaModel.create(panorama);

		log.info({ message: "Panorama metadata inserted successfully into MongoDB.", id: response._id });
		return response;
	}
}
