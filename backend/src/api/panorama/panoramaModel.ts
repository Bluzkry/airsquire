import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi";
import { z } from "zod";

extendZodWithOpenApi(z);

export type PanoramaUploadBodyType = z.infer<typeof PanoramaUploadBody>;

export const PanoramaUploadBody = z.object({
	uid: z.string(),
	name: z.string(),
	type: z.string(),
	lastModifiedDate: z.date(),
	size: z.string(),
});

export const PanoramaUploadResponse = z.object({
	id: z.string(),
});

export const PanoramaUploadOpenApiSchema = z.object({
	uid: z.string(),
	name: z.string(),
	type: z.string(),
	createdAt: z.date(),
	fileModifiedAt: z.date(),
	updatedAt: z.date(),
	size: z.string(),
});

export const PANORAMA_UPLOAD_SUCCESS_MESSAGE = "Panorama uploaded successfully.";
