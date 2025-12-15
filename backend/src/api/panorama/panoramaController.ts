import type { RequestHandler } from "express";
import { pino } from "pino";
import { panoramaService } from "./panoramaService";

const log = pino({ name: "Panorama Controller" });

class PanoramaController {
	public getPanoramas: RequestHandler = async (_, res) => {
		log.info({ message: "GET panoramas" });

		const panoramasResponse = await panoramaService.getAllPanoramas();
		res.status(panoramasResponse.statusCode).send(panoramasResponse);
	};

	public postPanorama: RequestHandler = async (req, res) => {
		const { body, files } = req;
		log.info({
			message: "POST panoramas - Upload received.",
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

	public patchPanoramaBookmark: RequestHandler = async (req, res) => {
		const { bookmark } = req.body;
		const { id } = req.params;
		log.info({ message: "PATCH panorama bookmark", id, bookmark });

		if (bookmark === null || bookmark === undefined) {
			res.status(400).send("No ID or bookmark sent.");
			return;
		}
		const bookmarkResponse = await panoramaService.updatePanoramaBookmark({ id, bookmark });
		res.status(bookmarkResponse.statusCode).send(bookmarkResponse);
	};
}

export const panoramaController = new PanoramaController();
