import {DollarCircleOutlined, HomeOutlined, LinkOutlined,} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
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
		<div style={{ overflowY: 'auto', minWidth: 256, maxWidth: 256 }}>
			<Menu
				defaultSelectedKeys={['1']}
				defaultOpenKeys={['sub1']}
				mode="inline"
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
