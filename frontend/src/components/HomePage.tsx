import type React from "react";
import { Typography } from "antd";

const { Title } = Typography;

const HomePage: React.FC = () => {
	return (
		<>
			<Title level={3}>Welcome!</Title>
		</>
	);
};

export default HomePage;
