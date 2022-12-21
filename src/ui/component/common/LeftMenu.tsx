import {
	DollarCircleOutlined,
	HomeOutlined,
	LinkOutlined,
	MenuFoldOutlined,
	MenuUnfoldOutlined,
} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Button, Menu} from 'antd';
import React, {useState} from 'react';
import Path from '../../../model/path.model';
import {useLocation, useNavigate} from 'react-router-dom';
import { Menu as AppMenu, MenuType } from '../../../model/menu.model'

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
	label: React.ReactNode,
	key: React.Key,
	icon?: React.ReactNode,
	children?: MenuItem[],
	type?: 'group',
): MenuItem {
	return {
		key,
		icon,
		children,
		label,
		type,
	} as MenuItem;
}

const items: MenuItem[] = AppMenu
	.filter((data: MenuType) => data.redirect === undefined)
	.map((data: MenuType) => {
		return getItem(data.label, data.path, data.menuIcon)
	});

const LeftMenu = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(false);
	
	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
	};
	
	return (
		<div style={{ minWidth: collapsed ? 'inherit' : 256, display: 'flex', flexDirection: 'column', alignItems: collapsed ? 'center' : 'flex-start' }}>
			<Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: '.5rem', width: 'inherit', marginLeft: collapsed ? 'inherit' : '1rem' }}>
				{collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
			</Button>
			<Menu
				// defaultSelectedKeys={['1']}
				// defaultOpenKeys={['sub1']}
				mode='inline'
				inlineCollapsed={collapsed}
				activeKey={location.pathname}
				onClick={(e) => navigate(e.key)}
				items={items}
				style={{
					height: '100%'
				}}
			/>
		</div>
	);
}

export default LeftMenu
