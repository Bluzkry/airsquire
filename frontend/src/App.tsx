import type React from "react";
import { Layout, Menu, Typography } from "antd";
import { NavLink, Outlet, useLocation } from "react-router-dom";

const { Header, Content } = Layout;

const App: React.FC = () => {
	const location = useLocation();

	const items = [
		{ key: "/", label: <NavLink to="/">Home</NavLink> },
		{ key: "/upload", label: <NavLink to="/upload">Upload Panorama</NavLink> },
		{ key: "/panoramas", label: <NavLink to="/panoramas">Panoramas</NavLink> },
		{ key: "/analytics", label: <NavLink to="/analytics">Analytics</NavLink> },
	];

	return (
		<Layout style={{ minHeight: "100vh" }}>
			<Header className="top-0">
				<Menu mode="horizontal" theme="dark" selectedKeys={[location.pathname]} items={items} />
				<div className="flex justify-center p-8">
					<Typography.Title level={2} className="text-white">
						Airsquire Panoramas
					</Typography.Title>
				</div>
			</Header>
			<Content className="m-16 p-8 mt-24 rounded-sm bg-slate-200">
				<Outlet />
			</Content>
		</Layout>
	);
};

export default App;
