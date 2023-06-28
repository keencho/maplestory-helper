import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import DesktopMenu from '../ui/component/common/Menus';
import React from 'react';
import Header from '../ui/component/common/Header';
import Modal from '../ui/component/common/Modal';
import {Menu, MenuType} from '../model/menu.model';
import {FlexBox} from '../ui/component/common/element/FlexBox';
import {useRecoilValue} from "recoil";
import {ThemeAtom} from "../recoil/theme.atom";
import useUIRenderer from "../hooks/useUIRenderer";
import {ResponsiveUIAtom} from "../recoil/responsive-ui.atom";
import useNotification from "../hooks/useNotification";

const Router = () => {
    
    const theme = useRecoilValue(ThemeAtom);
    const uiRenderer = useUIRenderer();
    
    const ui = useRecoilValue(ResponsiveUIAtom);
    const notification = useNotification();
    
    if (ui?.isMobile) {
        notification('warning', '본 사이트는 데스크톱 환경에 최적화 되어 있습니다. 모바일 환경에서는 UI가 어색해 보일수 있습니다.', { duration: 10 })
    }
    
	return (
		<FlexBox flexDirection={'column'} height={'100%'} backgroundColor={theme === 'light' ? 'inherit' : '#303030'}>
			<Modal />
			<BrowserRouter>
                <Header />
				<FlexBox flexGrow={'1'} overflowY={'auto'}>
                    { uiRenderer({ desktop: <DesktopMenu/> }) }
					<FlexBox overflowY={'auto'} flexGrow={'1'} flexDirection={'column'} overflowWrap={'break-word'} padding={'24px'}>
						<Routes>
							{
								Menu.map((data: MenuType) => {
									if (data.redirect) {
										return <Route path={data.path} element={<Navigate to={data.redirect} replace />} key={data.path} />
									}
									
									return <Route path={data.path} element={data.element} key={data.path} />
								})
							}
						</Routes>
					</FlexBox>
				</FlexBox>
			</BrowserRouter>
		</FlexBox>
	)
}

export default Router
