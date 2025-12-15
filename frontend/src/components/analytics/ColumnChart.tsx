import { Column } from "@ant-design/plots";
import type { ChartProps } from "../../types/analytics";

const ColumnChart: React.FC<ChartProps> = ({ data }) => {
	const columnConfig = {
		data,
		xField: "type",
		yField: "value",
		colorField: "type",
		scale: {
			color: {
				range: ["darkturquoise", "lightcoral"],
			},
		},
		axis: {
			y: {
				labelFormatter: (v: number) => (Number.isInteger(v) ? v : ""),
			},
		},
		style: {
			stroke: "grey",
			lineWidth: 1,
			radiusTopLeft: 4,
			radiusTopRight: 4,
		},
		fill: "WhiteSmoke",
	};

	return <Column {...columnConfig} />;
};

export default ColumnChart;
