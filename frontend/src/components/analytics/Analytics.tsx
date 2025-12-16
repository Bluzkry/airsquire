import { useEffect } from "react";
import { Typography } from "antd";
import { usePanoramas } from "../../hooks/usePanoramas";
import type { ChartData } from "../../types/analytics";
import ErrorMessage from "../common/ErrorMessage";
import Loading from "../common/Loading";
import ColumnChart from "./ColumnChart";
import PieChart from "./PieChart";
import VennChart from "./VennChart";

const { Title } = Typography;

const Analytics: React.FC = () => {
	const { fetchPanoramas, bookmarkCount, total, isLoadingPanoramas, errorGettingPanoramas } = usePanoramas();

	useEffect(() => {
		fetchPanoramas();
	}, [fetchPanoramas]);

	const data: ChartData = [
		{ type: "Bookmarked", value: bookmarkCount },
		{ type: "Not Bookmarked", value: total - bookmarkCount },
	];

	return (
		<>
			<Title level={3}>Analytics</Title>
			{isLoadingPanoramas && <Loading />}
			{errorGettingPanoramas && <ErrorMessage message="Sorry, we had an error getting analytics." />}

			{!isLoadingPanoramas && !errorGettingPanoramas && (
				<>
					<div className="md:flex">
						<ColumnChart data={data} />
						<PieChart data={data} />
					</div>
					<div className="py-16">
						<VennChart />
					</div>
				</>
			)}
		</>
	);
};

export default Analytics;
