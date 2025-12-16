import React, { createContext, type ReactNode, useCallback, useEffect, useState } from "react";
import axios from "axios";
import prettyBytes from "pretty-bytes";
import type { Panorama, PanoramasApiResponse } from "../types/panorama";
import { API_BASE_URL } from "../utils/constants";
import { parseDate } from "../utils/dates";

interface PanoramaContextType {
	fetchPanoramas: (query?: string) => Promise<void>;
	panoramas: Panorama[];
	setPanoramas: React.Dispatch<React.SetStateAction<Panorama[]>>;
	bookmarkCount: number;
	total: number;
	isLoadingPanoramas: boolean;
	errorGettingPanoramas: boolean;
}

export const PanoramaContext = createContext<PanoramaContextType | null>(null);

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
	const [isLoadingPanoramas, setIsLoadingPanoramas] = useState(false);
	const [errorGettingPanoramas, setErrorGettingPanoramas] = useState(false);

	const fetchPanoramas = useCallback(async (term?: string) => {
		setIsLoadingPanoramas(true);
		try {
			const { data } = await axios.get(`${API_BASE_URL}/panoramas`, {
				params: { term },
			});
			setPanoramas(parsePanoramas(data.responseObject));
		} catch (err) {
			console.error("Failed to fetch panoramas: ", err);
			setErrorGettingPanoramas(true);
		} finally {
			setIsLoadingPanoramas(false);
		}
	}, []);

	useEffect(() => {
		setBookmarkCount(getBookmarkCount(panoramas));
		setTotal(panoramas.length);
	}, [panoramas]);

	return (
		<PanoramaContext.Provider
			value={{
				fetchPanoramas,
				panoramas,
				setPanoramas,
				bookmarkCount,
				total,
				isLoadingPanoramas,
				errorGettingPanoramas,
			}}
		>
			{children}
		</PanoramaContext.Provider>
	);
};

export default PanoramaProvider;
