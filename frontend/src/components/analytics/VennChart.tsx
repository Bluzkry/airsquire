import { Venn } from "@ant-design/plots";
import { Typography } from "antd";
import { usePanoramas } from "../../hooks/usePanoramas";

const VennChart: React.FC = () => {
	const { panoramas } = usePanoramas();
	const data = panoramas.filter(({ bookmark }) => bookmark).map(({ name }) => ({ sets: [name], size: 1, label: name }));

	const vennConfig = {
		data,
		sizeField: "size",
		scale: {
			color: {
				range: ["#FFBE7A", "#82B0D2", "#8ECFC9", "#FA7F6F"],
			},
		},
		style: { fillOpacity: 0.85, stroke: "lightslategray", lineWidth: 5 },
		label: {
			position: "inside",
			text: (d: { label: string }) => d.label,
			style: {
				fontSize: 24,
				fontWeight: "bold",
				fill: "seashell",
			},
		},
		legend: false,
	};

	return (
		<>
			<Typography.Title level={4} className="flex justify-center">
				Bookmarked Panoramas
			</Typography.Title>
			<Venn {...vennConfig} />
		</>
	);
};

export default VennChart;
