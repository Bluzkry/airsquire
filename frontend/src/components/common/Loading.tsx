import type React from "react";
import { Spin } from "antd";

const Loading: React.FC = () => (
	<div className="text-center">
		<Spin size="large" />
	</div>
);

export default Loading;
