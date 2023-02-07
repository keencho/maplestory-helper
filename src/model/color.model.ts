import {blue, green, red} from '@ant-design/colors';
import {getRecoil} from '../recoil/recoil.nexus';
import {ThemeAtom} from '../recoil/theme.atom';

export const BLUE = blue[4];
export const GREEN = green[4];
export const RED = red[4];

export const BACKGROUND = () => {
	return getRecoil(ThemeAtom) === 'dark' ? '#303030' : '#fff';
}

export const HOVER = () => {
	return getRecoil(ThemeAtom) === 'dark' ? '#262626' : '#fafafa';
}


// export default class Color {
// 	static BLUE = blue[4]
// 	static GREEN = green[4]
// 	static RED = red[4]
//
// 	static BACKGROUND = () => {
// 		return getRecoil(ThemeAtom) === 'dark' ? '#303030' : '#fff';
// 	}
//
// 	static HOVER = () => {
// 		return getRecoil(ThemeAtom) === 'dark' ? '#262626' : '#fafafa';
// 	}
// }
