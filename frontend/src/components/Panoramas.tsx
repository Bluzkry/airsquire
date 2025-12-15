import type React from "react";
import { useEffect, useState } from "react";
import { Table, Typography } from "antd";
import axios from "axios";
import prettyBytes from "pretty-bytes";
import { API_BASE_URL } from "../utils/constants";

type Panoramas = {
	id: string;
	uid: string;
	name: string;
	size: string;
	type: string;
	createdAt: string;
	fileModifiedAt: string;
	updatedAt: string;
};

const panoramaColumns = [
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
];

const parseDate = (date: string) =>
	new Date(date).toLocaleString([], {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

const parsePanoramas = (panoramas: Panoramas[]): Panoramas[] =>
	panoramas.map(({ name, size, createdAt, fileModifiedAt, updatedAt, ...rest }) => {
		return {
			...rest,
			name: name.replace(/\.[^/.]+$/, ""),
			size: prettyBytes(Number(size)),
			createdAt: parseDate(createdAt),
			fileModifiedAt: parseDate(fileModifiedAt),
			updatedAt: parseDate(updatedAt),
		};
	});

const Panoramas: React.FC = () => {
	const [panoramas, setPanoramas] = useState<Panoramas[]>([]);

	useEffect(() => {
		const getPanoramas = async () => {
			const { data } = await axios.get(`${API_BASE_URL}/panoramas`);
			setPanoramas(parsePanoramas(data.responseObject));
		};

		getPanoramas();
	}, []);

	return (
		<>
			<Typography.Title level={3}>Panoramas</Typography.Title>
			<Table dataSource={panoramas} columns={panoramaColumns} />
		</>
	);
};

export default Panoramas;
