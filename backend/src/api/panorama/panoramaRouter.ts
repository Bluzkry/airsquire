import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi";
import express, { type Router } from "express";
import { z } from "zod";
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders";
import { panoramaController } from "./panoramaController";
import {
	PANORAMA_GET_MANY_SUCCESS_MESSAGE,
	PANORAMA_UPLOAD_SUCCESS_MESSAGE,
	PanoramaOpenApiSchema,
	PanoramaUploadBody,
	PanoramaUploadResponse,
} from "./panoramaModel";

export const panoramaRegistry = new OpenAPIRegistry();
export const panoramaRouter: Router = express.Router();

panoramaRegistry.register("Panorama", PanoramaOpenApiSchema);
panoramaRegistry.registerPath({
	method: "get",
	path: "/panoramas",
	tags: ["Panoramas"],
	responses: createApiResponse(z.array(PanoramaOpenApiSchema), PANORAMA_GET_MANY_SUCCESS_MESSAGE),
});
panoramaRegistry.registerPath({
	method: "post",
	path: "/panoramas",
	tags: ["Panoramas"],
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

panoramaRouter.get("/", panoramaController.getPanoramas);
panoramaRouter.post("/", panoramaController.postPanorama);
