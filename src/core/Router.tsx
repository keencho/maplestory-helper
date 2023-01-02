import {BrowserRouter, Navigate, Route, Routes} from 'react-router-dom';
import LeftMenu from '../ui/component/common/LeftMenu';
import React from 'react';
import Header from '../ui/component/common/Header';
import Modal from '../ui/component/common/Modal';
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
										return <Route path={data.path} element={<Navigate to={data.redirect} replace />} key={data.path} />
									}
									
									return <Route path={data.path} element={data.element} key={data.path} />
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
