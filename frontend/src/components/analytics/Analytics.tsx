import { useEffect } from "react";
import { Typography } from "antd";
import { usePanoramas } from "../../hooks/usePanoramas";
import type { ChartData } from "../../types/analytics";
import ColumnChart from "./ColumnChart";
import PieChart from "./PieChart";
import VennChart from "./VennChart";

const Analytics: React.FC = () => {
	const { fetchPanoramas, bookmarkCount, total } = usePanoramas();

	useEffect(() => {
		fetchPanoramas();
	}, [fetchPanoramas]);

	const data: ChartData = [
		{ type: "Bookmarked", value: bookmarkCount },
		{ type: "Not Bookmarked", value: total - bookmarkCount },
	];

	return (
		<>
			<Typography.Title level={3}>Analytics</Typography.Title>
			<div className="md:flex">
				<ColumnChart data={data} />
				<PieChart data={data} />
			</div>
			<div className="py-16">
				<VennChart />
			</div>
		</>
	);
};

export default Analytics;
