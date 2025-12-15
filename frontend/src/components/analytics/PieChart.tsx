import { Pie } from "@ant-design/plots";
import type { ChartProps } from "../../types/analytics";

const PieChart: React.FC<ChartProps> = ({ data }) => {
	const pieConfig = {
		data,
		angleField: "value",
		colorField: "type",
		innerRadius: 0.6,
		scale: {
			color: {
				range: ["silver", "sandybrown"],
			},
		},
		label: {
			text: "value",
			style: { fontWeight: "bold" },
		},
		legend: {
			color: {
				position: "right",
				rowPadding: 3,
			},
		},
		annotations: [
			{
				type: "text",
				style: {
					text: "Airsquire\nBookmarks",
					x: "50%",
					y: "50%",
					textAlign: "center",
					fontSize: 24,
					fontStyle: "italic bold",
				},
			},
		],
		interactions: [{ type: "elementHighlight" }],
	};

	return <Pie {...pieConfig} />;
};

export default PieChart;
