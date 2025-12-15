import type React from "react";
import { useEffect } from "react";
import DownloadIcon from "@mui/icons-material/Download";
import StarIcon from "@mui/icons-material/Star";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import { Button, Table, Typography } from "antd";
import type { ColumnsType } from "antd/es/table";
import axios from "axios";
import FileSaver from "file-saver";
import { usePanoramas } from "../hooks/usePanoramas";
import type { Panorama } from "../types/panorama";
import { API_BASE_URL } from "../utils/constants";

const Panoramas: React.FC = () => {
	const { fetchPanoramas, panoramas, setPanoramas } = usePanoramas();

	useEffect(() => {
		fetchPanoramas();
	}, [fetchPanoramas]);

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
		{
			title: "Download",
			key: "download",
			render: ({ id, loading }: { id: string; loading: boolean }) => (
				<div>
					<Button loading={loading} onClick={() => downloadPanorama(id)}>
						<DownloadIcon />
					</Button>
				</div>
			),
		},
	];

	const updatePanoramas = (id: string, updates: Partial<Panorama>) =>
		setPanoramas((prev: Panorama[]) => prev.map((p) => (p.id === id ? { ...p, ...updates } : p)));

	const downloadPanorama = async (id: string) => {
		updatePanoramas(id, { loading: true });

		try {
			const { data, headers } = await axios.get(`${API_BASE_URL}/panoramas/${id}/download`, { responseType: "blob" });

			const blob = new Blob([data]);
			const contentType = headers["content-type"] || "image/jpeg";
			const extension = contentType.split("/")[1].split(";")[0];

			FileSaver.saveAs(blob, `panorama-${id}.${extension}`);
		} catch (error) {
			console.error("Failed to download panorama: ", error);
		} finally {
			updatePanoramas(id, { loading: false });
		}
	};

	const bookmarkPanorama = async (id: string, bookmark: boolean) => {
		updatePanoramas(id, { loading: true });
		const newBookmark = !bookmark;
		try {
			await axios.patch(`${API_BASE_URL}/panoramas/${id}/bookmark`, { bookmark: newBookmark });
			updatePanoramas(id, { bookmark: newBookmark, loading: false });
		} catch (error) {
			console.error("Failed to toggle bookmark: ", error);
			updatePanoramas(id, { loading: false });
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
