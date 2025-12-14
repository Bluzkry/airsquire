import type { Request, RequestHandler, Response } from "express";
import { pino } from "pino";
import { panoramaService } from "./panoramaService";

const log = pino({ name: "Panorama Controller" });

class PanoramaController {
	public postPanorama: RequestHandler = async (req: Request, res: Response) => {
		const { body, files } = req;
		log.info({
			message: "POST /panorama - Upload received.",
			body: req.body,
			fileName: Array.isArray(req.files) ? req.files[0]?.originalname : "File missing.",
		});

		if (!files || files.length === 0) {
			res.status(400).send("No files sent.");
			return;
		}
		const panoramaResponse = await panoramaService.insertPanorama(body, files as Express.Multer.File[]);
		res.status(panoramaResponse.statusCode).send(panoramaResponse);
	};
}

export const panoramaController = new PanoramaController();
