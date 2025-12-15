import React, { useState } from "react";
import { InboxOutlined } from "@ant-design/icons";
import { message, Typography, Upload } from "antd";
import type { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import { API_BASE_URL } from "../utils/constants";

type ImageInfo = {
	uid: string;
	lastModifiedDate: Date;
	name: string;
	size: number;
	type: string;
};

const { Dragger } = Upload;
const UploadImage = () => {
	const [imageInfo, setImageInfo] = useState<ImageInfo | null>(null);

	const handleBeforeUpload = (file: RcFile) => {
		setImageInfo(file);
	};

	const handleChange = (info: UploadChangeParam<UploadFile<RcFile>>) => {
		const { status } = info.file;
		if (status === "done") {
			message.success(`${info.file.name} file uploaded successfully.`);
		} else if (status === "error") {
			message.error(`${info.file.name} file upload failed.`);
		}
	};

	return (
		<div>
			<Typography.Title level={3}>Upload Panorama Image</Typography.Title>
			<Dragger
				action={`${API_BASE_URL}/panoramas`}
				name="file"
				maxCount={1}
				accept="image/*"
				beforeUpload={handleBeforeUpload}
				data={{
					uid: imageInfo?.uid,
					lastModifiedDate: imageInfo?.lastModifiedDate,
					name: imageInfo?.name,
					size: imageInfo?.size,
					type: imageInfo?.type,
				}}
				onChange={handleChange}
			>
				<p className="antd-upload-drag-icon">
					<InboxOutlined />
				</p>
				<p className="antd-upload-text">Click or drag file to this area to upload</p>
			</Dragger>
		</div>
	);
};

export default UploadImage;
