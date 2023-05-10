import {EquipmentSubCategory} from './equipment.model';
import {IntRange} from './common.model';

export type ActionType =
	| 'ADD'
	| 'COPY'
	| 'RESET'
	| 'DELETE'
	| 'DELETE_ITEM'
	| 'HANDLE_RESIZE'
	| 'HANDLE_POSITION'
	| 'RESET_ENTIRE_CHARACTERS'
	| 'SHARE_CODI'
    | 'HAIR_CUSTOM_MIX_SET_COLOR'
    | 'HAIR_CUSTOM_MIX_BASE_COLOR_RATIO'

export const BaseColorMin = 0;
export const BaseColorMax = 100;

export type Color =
	| 'YELLOW'
	| 'ORANGE'
	| 'RED'
	| 'GREEN'
	| 'PURPLE'
	| 'BLUE'
	| 'BLACK'
	| 'BROWN'

export type ColorInfoType = {
	ioIdx: number
	hex: string
	kor: string
    displayIdx: number
}

export const ColorInfo: Record<Color, ColorInfoType> = {
	'BLACK'     : { ioIdx: 0, hex: '#000', kor: '검정', displayIdx: 6 },
	'RED'       : { ioIdx: 1, hex: '#E45A60', kor: '빨강', displayIdx: 2 },
	'ORANGE'    : { ioIdx: 2, hex: '#FE9661', kor: '주황', displayIdx: 1 },
	'YELLOW'    : { ioIdx: 3, hex: '#FFCF19', kor: '노랑', displayIdx: 0 },
	'GREEN'     : { ioIdx: 4, hex: '#8DD28D', kor: '초록', displayIdx: 3 },
	'BLUE'      : { ioIdx: 5, hex: '#14A4F2', kor: '파랑', displayIdx: 5 },
	'PURPLE'    : { ioIdx: 6, hex: '#794EB9', kor: '보라', displayIdx: 4 },
	'BROWN'     : { ioIdx: 7, hex: '#A4715D', kor: '갈색', displayIdx: 7 }
}

export const SortedColorInfo = Object.entries(ColorInfo)
    .sort(([, a], [, b]) => a.displayIdx - b.displayIdx)
    .map(([k, v]) => [k, v])
    .reduce((obj, [k, v]) => ({ ...obj, [k as Color]: v }), {});

export type CharactersModel = {
	key: string,
	width: number,
	height: number,
	x: number,
	y: number,
	hairCustomMix?: {
        baseColor?: Color
        mixColor?: Color
        baseColorRatio?: number
    }
	data: {
		key: EquipmentSubCategory,
		value: any
	}[]
}

export const hasAllKey = (obj: any): boolean => {
	const keys = Object.keys(obj);
	const interfaceKeys = ['key', 'width', 'height', 'x', 'y', 'data', 'hairCustomMix'];
	
	// 옵셔널 데이터가 포함되어 있으면 길이가 안맞는다.
	// 그냥 키검사만 하자.
	// if (keys.length !== interfaceKeys.length) return false;
	
	for (const key of keys) {
		if (!interfaceKeys.includes(key)) {
			return false;
		}
	}
	
	return true;
}
