import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import LeftMenu from '../ui/component/common/LeftMenu';
import React from 'react';
import Header from '../ui/component/common/Header';
import Modal from '../ui/component/common/Modal';
import {Menu, MenuType} from '../model/menu.model';
import {FlexBox} from '../ui/component/common/element/FlexBox';
import {useRecoilValue} from "recoil";
import {ThemeAtom} from "../recoil/theme.atom";

const Router = () => {
    
    const theme = useRecoilValue(ThemeAtom);
    
	return (
		<FlexBox flexDirection={'column'} height={'100%'} backgroundColor={theme === 'light' ? 'inherit' : '#303030'}>
			<Header />
			<Modal />
			<BrowserRouter>
				<FlexBox flexGrow={'1'} overflowY={'auto'}>
					<LeftMenu />
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
