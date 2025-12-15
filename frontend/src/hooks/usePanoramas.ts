import { useContext } from "react";
import { PanoramaContext } from "../context/PanoramaContext";

export const usePanoramas = () => {
	const context = useContext(PanoramaContext);
	if (!context) throw new Error("usePanoramas must be used within PanoramaProvider");
	return context;
};
