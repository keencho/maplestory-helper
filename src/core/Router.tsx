import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import HomeworkContainer from '../ui/container/HomeworkContainer';
import Path from '../model/path.model';
import BossSoulCrystalCalculatorContainer from '../ui/container/BossSoulCrystalCalculatorContainer';
import LeftMenu from '../ui/component/common/LeftMenu';
import React from 'react';
import Header from '../ui/component/common/Header';
import Modal from '../ui/component/common/Modal';
import LinkSkillContainer from '../ui/container/LinkSkillContainer';
import {Menu, MenuType} from '../model/menu.model';

const Router = () => {
	return (
		<div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
			<Header />
			<Modal />
			<BrowserRouter>
				<div style={{ display: 'flex', flexGrow: 1, overflowY: 'auto' }}>
					<LeftMenu />
					<div style={{ padding: '24px', flexGrow: '1', overflowY: 'auto', display: 'flex', flexDirection: 'column', overflowWrap: 'break-word' }}>
						<Routes>
							{
								Menu.map((data: MenuType) => {
									if (data.redirect) {
										return <Route path={data.path} element={<Navigate to={data.redirect} replace />} />
									}
									
									return <Route path={data.path} element={data.element} />
								})
							}
						</Routes>
					</div>
				</div>
			</BrowserRouter>
		</div>
	)
}

export default Router
