import {EquipmentSubCategory} from './equipment.model';

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

export type CharactersModel = {
	key: string,
	width: number,
	height: number,
	x: number,
	y: number,
	data: {
		key: EquipmentSubCategory,
		value: any
	}[]
}

export const hasAllKeys = (obj: any): boolean => {
	const keys = Object.keys(obj);
	const interfaceKeys = ['key', 'width', 'height', 'x', 'y', 'data'];
	
	if (keys.length !== interfaceKeys.length) return false;
	
	for (const key of keys) {
		if (!interfaceKeys.some(k => k === key)) {
			return false;
		}
	}
	
	return true;
}
