import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { panoramaController } from "./panoramaController";
import {
	PANORAMA_UPLOAD_SUCCESS_MESSAGE,
	PanoramaUploadBody,
	PanoramaUploadOpenApiSchema,
	PanoramaUploadResponse,
} from "./panoramaModel";

export const panoramaRegistry = new OpenAPIRegistry();
export const panoramaRouter: Router = express.Router();

panoramaRegistry.register("Panorama", PanoramaUploadOpenApiSchema);
panoramaRegistry.registerPath({
	method: "post",
	path: "/panorama",
	tags: ["Panorama"],
	request: {
		body: {
			content: {
				"multipart/form-data": {
					schema: PanoramaUploadBody.extend({
						file: z.instanceof(File).describe("Panorama image file"),
					}),
				},
			},
		},
	},
	responses: createApiResponse(PanoramaUploadResponse, PANORAMA_UPLOAD_SUCCESS_MESSAGE),
});

panoramaRouter.post("/", panoramaController.postPanorama);
