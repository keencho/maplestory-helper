import {BrowserRouter, Route, Routes} from 'react-router-dom';
import HomeworkContainer from '../ui/container/HomeworkContainer';
import Path from '../model/path.model';

const Router = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={Path.INDEX} element={<HomeworkContainer />} />
				<Route path={Path.HOMEWORK} element={<HomeworkContainer />} />
			</Routes>
		</BrowserRouter>
	)
}

export default Router
