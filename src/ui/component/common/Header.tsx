import {PageHeader} from '@ant-design/pro-layout';
import {Button, Drawer, Switch} from 'antd';
import React, {useState} from 'react';
import {useRecoilState} from 'recoil';
import {THEME_MODE_KEY, ThemeAtom} from '../../../recoil/theme.atom';
import useUIRenderer from "../../../hooks/useUIRenderer";
import {CloseOutlined, MenuOutlined} from "@ant-design/icons";
import Menus from "./Menus";

const Header = () => {
	const [theme, setTheme] = useRecoilState(ThemeAtom);
	
	const themeHandler = (isDark? : boolean) => {
		const mode = isDark ? 'dark' : 'light'
		localStorage.setItem(THEME_MODE_KEY, mode)
		setTheme(mode)
	}
    
    const uiRenderer = useUIRenderer();
    
    const [openMenu, setOpenMenu] = useState<boolean>(false);
	
	return (
        <>
            <PageHeader
                title="메이플 도우미"
                subTitle="즐메~"
                extra={[
                    <React.Fragment key={'extra'}>
                        <Switch
                            key={1}
                            checkedChildren={'Dark'}
                            unCheckedChildren={'Light'}
                            checked={theme === 'dark'}
                            onChange={themeHandler}
                        />
                        {
                            uiRenderer({ mobile:
                                <Button onClick={() => setOpenMenu(true)}>
                                    <MenuOutlined />
                                </Button>
                            })
                        }
                    </React.Fragment>
                ]}
                ghost={false}
                style={{
                    position: 'sticky',
                    top: 0
                }}
            />
            <Drawer
                title='메뉴'
                placement={'left'}
                onClose={() => setOpenMenu(false)}
                open={openMenu}
                closable={false}
                extra={
                    <Button onClick={() => setOpenMenu(false)}>
                        <CloseOutlined />
                    </Button>
                }
                bodyStyle={{ padding: 0 }}
            >
                <Menus callback={() => setOpenMenu(false)} />
            </Drawer>
        </>
	)
}

export default Header
