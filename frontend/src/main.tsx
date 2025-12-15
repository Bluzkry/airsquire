import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { RouterProvider } from "react-router-dom";
import PanoramaProvider from "./context/PanoramaContext";
import router from "./routing/router";

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<PanoramaProvider>
			<RouterProvider router={router} />
		</PanoramaProvider>
	</StrictMode>,
);
