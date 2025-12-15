import React, { createContext, type ReactNode, useCallback, useEffect, useState } from "react";
import axios from "axios";
import prettyBytes from "pretty-bytes";
import type { Panorama, PanoramasApiResponse } from "../types/panorama";
import { API_BASE_URL } from "../utils/constants";

interface PanoramaContextType {
	fetchPanoramas: () => Promise<void>;
	panoramas: Panorama[];
	setPanoramas: React.Dispatch<React.SetStateAction<Panorama[]>>;
	bookmarkCount: number;
	total: number;
}

export const PanoramaContext = createContext<PanoramaContextType | null>(null);

const parseDate = (date: string) =>
	new Date(date).toLocaleString([], {
		year: "numeric",
		month: "numeric",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});

const parsePanoramas = (panoramas: PanoramasApiResponse[]): Panorama[] =>
	panoramas.map(({ _id, name, size, createdAt, fileModifiedAt, updatedAt, ...rest }) => ({
		...rest,
		id: _id,
		name: name.replace(/\.[^/.]+$/, ""),
		size: prettyBytes(Number(size)),
		createdAt: parseDate(createdAt),
		fileModifiedAt: parseDate(fileModifiedAt),
		updatedAt: parseDate(updatedAt),
		loading: false,
	}));

const getBookmarkCount = (panoramas: Panorama[]) => panoramas.reduce((count, p) => count + (p.bookmark ? 1 : 0), 0);

const PanoramaProvider = ({ children }: { children: ReactNode }) => {
	const [panoramas, setPanoramas] = useState<Panorama[]>([]);
	const [bookmarkCount, setBookmarkCount] = useState(0);
	const [total, setTotal] = useState(0);

	const fetchPanoramas = useCallback(async () => {
		const { data } = await axios.get(`${API_BASE_URL}/panoramas`);
		setPanoramas(parsePanoramas(data.responseObject));
	}, []);

	useEffect(() => {
		fetchPanoramas();
	}, [fetchPanoramas]);

	useEffect(() => {
		setBookmarkCount(getBookmarkCount(panoramas));
		setTotal(panoramas.length);
	}, [panoramas]);

	return (
		<PanoramaContext.Provider value={{ fetchPanoramas, panoramas, setPanoramas, bookmarkCount, total }}>
			{children}
		</PanoramaContext.Provider>
	);
};

export default PanoramaProvider;
