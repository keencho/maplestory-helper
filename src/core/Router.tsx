import {BrowserRouter, Route, Routes} from 'react-router-dom';
import HomeworkContainer from '../ui/container/HomeworkContainer';
import Path from '../model/path.model';
import BossSoulCrystalCalculatorContainer from '../ui/container/BossSoulCrystalCalculatorContainer';
import LeftMenu from '../ui/component/LeftMenu';
import React from 'react';

const Router = () => {
	return (
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
	)
}

export default Router
