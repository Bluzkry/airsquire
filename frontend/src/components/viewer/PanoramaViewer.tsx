import type React from "react";
import { useEffect, useState } from "react";
import { Layout } from "antd";
import axios from "axios";
import { useParams } from "react-router-dom";
import { API_BASE_URL } from "../../utils/constants";
import ErrorMessage from "../common/ErrorMessage";
import Loading from "../common/Loading";
import PanoramaCanvas from "./PanoramaCanvas";

const { Content } = Layout;

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
				<Content className="m-16 p-8 mt-24">
					{loading && <Loading />}
					{error && <ErrorMessage message="Sorry, we had an error getting the image." titleLevel={1} />}
				</Content>
			</Layout>
		);

	return <div className="h-screen w-screen">{panoramaUrl && <PanoramaCanvas imageUrl={panoramaUrl} />}</div>;
};

export default PanoramaViewer;
