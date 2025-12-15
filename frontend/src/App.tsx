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
	];

	return (
		<Layout className="h-screen">
			<Header className="top-0">
				<Menu mode="horizontal" theme="dark" selectedKeys={[location.pathname]} items={items} />
				<div className="flex justify-center p-8">
					<Typography.Title level={2} className="text-white">
						Airsquire Panoramas
					</Typography.Title>
				</div>
			</Header>
			<Content className="m-8 p-8 mt-16">
				<Outlet />
			</Content>
		</Layout>
	);
};

export default App;
