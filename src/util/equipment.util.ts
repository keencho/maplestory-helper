import {EquipmentCategory, EquipmentSubCategory, equipmentSubCategoryInfo} from '../model/equipment.model';

export const getMaxStar = (level: number, type: 'NORMAL' | 'SUPERIOR' = 'NORMAL'): number => {
	const isNormalItem: boolean = type === 'NORMAL'
	
	if (level < 95) {
		return isNormalItem ? 5 : 3;
	}
	
	if (level < 108) {
		return isNormalItem ? 8 : 5;
	}
	
	if (level < 118) {
		return isNormalItem ? 10 : 8;
	}
	
	if (level < 128) {
		return isNormalItem ? 15 : 20;
	}
	
	return isNormalItem ? 25 : 15;
}

export const isAvailableStarForce = (item: any): boolean => {
	// 듀블 보조 - 가능
	if (item.typeInfo.subCategory === 'Katara') return true
	
	// 포켓 아이템, 보조무기, 훈장, 뱃지, 하트
	if (['Po', 'Si', 'Me', 'Ba', 'Tm'].some(type => type === item.metaInfo.islots[0])) {
		return false;
	}
	
	return true;
}

export const getSubCategoryName = (subCategory: EquipmentSubCategory) => {
	const find = equipmentSubCategoryInfo.find(info => info[1] === subCategory);
	
	if (!find) return '기타';
	
	return find[2];
}

export const isWeapon = (category: EquipmentCategory): boolean => {
	return category === 'One-Handed Weapon' || category === 'Two-Handed Weapon';
}

export const isSubWeapon = (category: EquipmentCategory): boolean => {
	return category === 'Secondary Weapon';
}


