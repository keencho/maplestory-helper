import {ThemeSwitcherProvider} from 'react-css-theme-switcher';
import {useRecoilValue} from 'recoil';
import {ThemeAtom} from '../recoil/theme.atom';
import React from 'react';

interface Props {
	children: React.ReactNode;
}

const themes = {
	dark: `/dark-theme.css`,
	light: `/light-theme.css`,
};

const ThemeProvider: React.FC<Props> = ({ children }) => {
	
	const theme = useRecoilValue(ThemeAtom);
	
	return (
		<ThemeSwitcherProvider themeMap={themes} defaultTheme={theme}>
			{children}
		</ThemeSwitcherProvider>
	)
}

export default ThemeProvider
