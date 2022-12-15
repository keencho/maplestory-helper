import {BrowserRouter, Route, Routes} from 'react-router-dom';
import HomeworkContainer from '../ui/container/HomeworkContainer';
import Path from '../model/path.model';
import BossSoulCrystalCalculatorContainer from '../ui/container/BossSoulCrystalCalculatorContainer';
import LeftMenu from '../ui/component/common/LeftMenu';
import React from 'react';
import Header from '../ui/component/common/Header';
import Modal from '../ui/component/common/Modal';

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
							<Route path={Path.INDEX} element={<HomeworkContainer />} />
							<Route path={Path.HOMEWORK} element={<HomeworkContainer />} />
							<Route path={Path.BOSS_SOUL_CRYSTAL_CALCULATOR} element={<BossSoulCrystalCalculatorContainer />} />
						</Routes>
					</div>
				</div>
			</BrowserRouter>
		</div>
	)
}

export default Router
