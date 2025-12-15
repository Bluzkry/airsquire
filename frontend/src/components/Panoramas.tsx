import type React from "react";
import { useEffect, useState } from "react";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { Button, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import prettyBytes from "pretty-bytes";
import { API_BASE_URL } from "../utils/constants";

type PanoramasApiResponse = {
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

type Panorama = Omit<PanoramasApiResponse, "_id"> & {
	id: string;
	loading?: boolean;
};

const parseDate = (date: string) =>
	new Date(date).toLocaleString([], {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

const parsePanoramas = (panoramas: PanoramasApiResponse[]): Panorama[] =>
	panoramas.map(({ _id, name, size, createdAt, fileModifiedAt, updatedAt, ...rest }) => ({
		...rest,
		id: _id,
		name: name.replace(/\.[^/.]+$/, ""),
		size: prettyBytes(Number(size)),
		createdAt: parseDate(createdAt),
		fileModifiedAt: parseDate(fileModifiedAt),
		updatedAt: parseDate(updatedAt),
		loading: false,
	}));

const Panoramas: React.FC = () => {
	const [panoramas, setPanoramas] = useState<Panorama[]>([]);
	const panoramaColumns: ColumnsType<Panorama> = [
		{
			title: "Name",
			dataIndex: "name",
			key: "name",
		},
		{
			title: "Size",
			dataIndex: "size",
			key: "size",
		},
		{
			title: "Type",
			dataIndex: "type",
			key: "type",
		},
		{
			title: "Created At",
			dataIndex: "createdAt",
			key: "createdAt",
		},
		{
			title: "Original File Modified At",
			dataIndex: "fileModifiedAt",
			key: "fileModifiedAt",
		},
		{
			title: "Updated At",
			dataIndex: "updatedAt",
			key: "updatedAt",
		},
		{
			title: "Bookmark",
			key: "bookmark",
			filters: [
				{
					text: "Bookmarked",
					value: true,
				},
				{
					text: "Not Bookmarked",
					value: false,
				},
			],
			onFilter: (value: boolean | React.Key, record: Panorama) => record.bookmark === (value as boolean),
			render: ({ id, bookmark, loading }: { id: string; bookmark: boolean; loading: boolean }) => (
				<div>
					<Button loading={loading} onClick={() => bookmarkPanorama(id, bookmark)}>
						{bookmark ? <StarIcon /> : <StarOutlineIcon />}
					</Button>
				</div>
			),
		},
	];

	useEffect(() => {
		const getPanoramas = async () => {
			const { data } = await axios.get(`${API_BASE_URL}/panoramas`);
			setPanoramas(parsePanoramas(data.responseObject));
		};

		getPanoramas();
	}, []);

	const updatePanoramas = (id: string, updates: Partial<Panorama>) =>
		setPanoramas((prev) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));

	const bookmarkPanorama = async (id: string, bookmark: boolean) => {
		updatePanoramas(id, { loading: true });
		const newBookmark = !bookmark;
		try {
			await axios.patch(`${API_BASE_URL}/panoramas/${id}/bookmark`, { bookmark: newBookmark });
			updatePanoramas(id, { bookmark: newBookmark, loading: false });
		} catch (error) {
			updatePanoramas(id, { loading: false });
			console.error("Failed to toggle bookmark: ", error);
		}
	};

	return (
		<>
			<Typography.Title level={3}>Panoramas</Typography.Title>
			<Table dataSource={panoramas} columns={panoramaColumns} />
		</>
	);
};

export default Panoramas;
