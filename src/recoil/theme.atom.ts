import {atom} from 'recoil';

const THEME_MODE_KEY = 'THEME_MODE'

const getDefault = (): 'light' | 'dark' => {
	const savedMode: any = window.localStorage.getItem(THEME_MODE_KEY);
	
	if (!savedMode) {
		window.localStorage.setItem(THEME_MODE_KEY, 'light');
		return 'light';
	}
	
	return savedMode;
}

const ThemeAtom = atom<'light' | 'dark'>({
	key: 'theme',
	default: getDefault()
});

export { THEME_MODE_KEY, ThemeAtom }
