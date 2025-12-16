import type React from "react";
import { Typography } from "antd";
import PanoramaCanvas from "./viewer/PanoramaCanvas";

const { Title } = Typography;

const samplePanoramaUrl = "./building.jpg";
const HomePage: React.FC = () => {
	return (
		<>
			<div className="mb-6">
				<Title level={4}>Welcome! Here's a sample panorama viewer.</Title>
			</div>
			<div className="flex items-center justify-center h-[72vh] w-[95%] mx-auto">
				<PanoramaCanvas imageUrl={samplePanoramaUrl} rotate={true} />
			</div>
		</>
	);
};

export default HomePage;
