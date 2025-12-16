import type React from "react";
import { Typography } from "antd";

const { Title, Text } = Typography;

type TitleLevel = 1 | 2 | 3 | 4 | 5;

const ErrorMessage: React.FC<{ message: string; titleLevel?: TitleLevel }> = ({ message, titleLevel }) => (
	<div className="text-center">
		<Title level={titleLevel || 3}>{message}</Title>
		<Text>Please try again later.</Text>
	</div>
);

export default ErrorMessage;
