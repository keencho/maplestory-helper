import {PageHeader, Switch} from 'antd';
import React from 'react';
import {useRecoilState} from 'recoil';
import {THEME_MODE_KEY, ThemeAtom} from '../../../recoil/theme.atom';

const Header = () => {
	const [theme, setTheme] = useRecoilState(ThemeAtom);
	
	const themeHandler = (isDark? : boolean) => {
		const mode = isDark ? 'dark' : 'light'
		localStorage.setItem(THEME_MODE_KEY, mode)
		setTheme(mode)
	}
	
	return (
		<PageHeader
			title="메이플 도우미"
			subTitle="즐메~"
			extra={[
				<Switch
					key={1}
					checkedChildren={'Dark'}
					unCheckedChildren={'Light'}
					checked={theme === 'dark'}
					onChange={themeHandler}
				/>
			]}
			ghost={false}
			style={{
				position: 'sticky',
				top: 0
			}}
		/>
	)
}

export default Header
