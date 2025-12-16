import React from "react";
import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Analytics from "../components/analytics/Analytics";
import HomePage from "../components/HomePage";
import Panoramas from "../components/Panoramas";
import UploadImage from "../components/UploadImage";
import PanoramaViewer from "../components/viewer/PanoramaViewer";

const router = createBrowserRouter([
	{
		path: "/",
		element: <App />,
		children: [
			{ index: true, element: <HomePage /> },
			{ path: "/upload", element: <UploadImage /> },
			{ path: "/panoramas", element: <Panoramas /> },
			{ path: "/analytics", element: <Analytics /> },
		],
	},
	{
		path: "/panoramaViewer/:id",
		element: <PanoramaViewer />,
	},
]);

export default router;
