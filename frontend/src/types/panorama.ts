export type PanoramasApiResponse = {
	_id: string;
	uid: string;
	name: string;
	size: string;
	type: string;
	createdAt: string;
	fileModifiedAt: string;
	updatedAt: string;
	bookmark: boolean;
	loading?: boolean;
};

export type Panorama = Omit<PanoramasApiResponse, "_id"> & {
	id: string;
	loading?: boolean;
};
