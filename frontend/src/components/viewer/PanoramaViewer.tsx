import type React from "react";
import { useEffect, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Layout, Spin, Typography } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../utils/constants";
import PanoramaMesh from "./PanoramaMesh";

const { Content } = Layout;
const { Title, Text } = Typography;

const PanoramaViewer: React.FC = () => {
	const { id } = useParams();
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(false);
	const [panoramaUrl, setPanoramaUrl] = useState<string | null>(null);

	useEffect(() => {
		const getPanorama = async () => {
			try {
				const { data } = await axios.get(`${API_BASE_URL}/panoramas/${id}/download`, { responseType: "blob" });

				const panoramaBlob = new Blob([data]);
				const panoramaUrl = URL.createObjectURL(panoramaBlob);
				setPanoramaUrl(panoramaUrl);
			} catch (error) {
				console.error("Failed to download panorama: ", error);
				setError(true);
			} finally {
				// Enables Three.js Canvas set-up.
				setTimeout(() => {
					setLoading(false);
				}, 1000);
			}
		};

		getPanorama();
	}, [id]);

	if (error || loading)
		return (
			<Layout style={{ minHeight: "100vh" }} className="bg-slate-200">
				<Content className="m-16 p-8 mt-24 text-center">
					{loading && <Spin size="large" />}
					{error && (
						<>
							<Title level={1}>Sorry, we had an error getting the image. </Title>
							<Text>Please try again later.</Text>
						</>
					)}
				</Content>
			</Layout>
		);

	return (
		<div className="h-screen w-screen">
			{panoramaUrl && (
				<Canvas camera={{ position: [0, 0, 5], fov: 75 }}>
					<PanoramaMesh imageUrl={panoramaUrl} />
					<OrbitControls
						enableDamping={true}
						enablePan={false}
						rotateSpeed={-0.3}
						minDistance={0.1}
						maxDistance={0.1}
					/>
				</Canvas>
			)}
		</div>
	);
};

export default PanoramaViewer;
