import {blue, green, grey, red} from '@ant-design/colors';

export const BLUE = blue[4];
export const GREEN = green[4];
export const RED = red[4];
export const GREY = grey[4];

export const BACKGROUND = (theme: 'light' | 'dark') => {
	return theme === 'dark' ? '#303030' : '#fff';
}

export const HOVER = (theme: 'light' | 'dark') => {
	return theme === 'dark' ? '#262626' : '#fafafa';
}

export const BORDER = (theme: 'light' | 'dark') => {
    return theme === 'dark' ? '#6f6c6c' : '#d9d9d9'
}
