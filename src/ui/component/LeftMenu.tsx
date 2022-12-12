import {AppstoreOutlined, DollarCircleOutlined, HomeOutlined, UsergroupAddOutlined,} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Menu} from 'antd';
import React, {useEffect, useState} from 'react';
import Path from '../../model/path.model';
import {useLocation, useNavigate} from 'react-router-dom';

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

const items: MenuItem[] = [
	getItem('숙제표', Path.HOMEWORK, <HomeOutlined />),
	getItem('결정석 수입 계산기', Path.BOSS_SOUL_CRYSTAL_CALCULATOR, <DollarCircleOutlined /> ),
	// getItem('길드', '3',  <UsergroupAddOutlined />, [
	// 	getItem('기여도 보스표', '3-1'),
	// ])
];

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
