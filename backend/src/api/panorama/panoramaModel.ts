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

export const PanoramaBookmarkResponse = z.object({
	id: z.string(),
	bookmark: z.boolean(),
});

export const PanoramaOpenApiSchema = z.object({
	uid: z.string(),
	name: z.string(),
	type: z.string(),
	createdAt: z.date(),
	fileModifiedAt: z.date(),
	updatedAt: z.date(),
	size: z.string(),
	bookmark: z.boolean(),
});

export const GET_PANORAMAS_LIMIT = 50;

export const PANORAMA_GET_MANY_SUCCESS_MESSAGE = "Panoramas found.";
export const PANORAMA_UPLOAD_SUCCESS_MESSAGE = "Panorama uploaded successfully.";
export const PANORAMA_BOOKMARK_SUCCESS_MESSAGE = "Panorama bookmark updated.";
