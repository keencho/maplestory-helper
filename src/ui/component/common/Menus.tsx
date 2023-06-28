import {MenuFoldOutlined, MenuUnfoldOutlined,} from '@ant-design/icons';
import type {MenuProps} from 'antd';
import {Button, Menu} from 'antd';
import React, {useState} from 'react';
import {useLocation, useNavigate} from 'react-router-dom';
import {Menu as AppMenu, MenuType} from '../../../model/menu.model'
import {FlexBox} from './element/FlexBox';
import useUIRenderer from "../../../hooks/useUIRenderer";

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
	.filter((data: MenuType) => data.redirect === undefined && data.dev !== true)
	.map((data: MenuType) => {
		return getItem(data.label, data.path, data.menuIcon)
	});

interface Props {
    callback?: () => any
}

const Menus = (props: Props) => {
	const location = useLocation();
	const navigate = useNavigate();
	const [collapsed, setCollapsed] = useState(false);
    const uiRenderer = useUIRenderer();
	
	const toggleCollapsed = () => {
		setCollapsed(!collapsed);
	};
 
	return (
        <FlexBox flexDirection={'column'} alignItems={collapsed ? 'center' : 'flex-start'} minWidth={collapsed ? 'inherit' : '256px'}>
            {
                uiRenderer({ desktop:
                        <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: '.5rem', width: 'inherit', marginLeft: collapsed ? 'inherit' : '1rem' }}>
                            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                        </Button>
                })
            }
            <Menu
                mode='inline'
                inlineCollapsed={collapsed}
                activeKey={location.pathname}
                onClick={(e) => {
                    navigate(e.key)
                    if (props.callback) {
                        props.callback();
                    }
                }}
                items={items}
                style={{
                    height: '100%'
                }}
            />
        </FlexBox>
	);
}

export default Menus
