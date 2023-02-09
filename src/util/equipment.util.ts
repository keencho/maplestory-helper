import {
	EquipmentCategory,
	EquipmentSubCategory,
	equipmentSubCategoryInfo,
	metaInfoEquipmentOptionMap, MetaInfoStats,
	Stats
} from '../model/equipment.model';

export const getMaxStarForce = (level: number, isSuperiorItem = false): number => {
	if (level < 95) {
		return isSuperiorItem ? 3 : 5;
	}
	
	if (level < 108) {
		return isSuperiorItem ? 5 : 8;
	}
	
	if (level < 118) {
		return isSuperiorItem ? 8 : 10;
	}
	
	if (level < 128) {
		return isSuperiorItem ? 10 : 15;
	}
	
	if (level < 138) {
		return isSuperiorItem ? 12 : 20;
	}
	
	return isSuperiorItem ? 15 : 25;
}

export const isAvailableStarForce = (item: any): boolean => {
	// 듀블 보조 - 가능
	if (item.typeInfo.subCategory === 'Katara') return true
	
	// '봉인된' 해방무기 - 불가
	if (item.description.name.startsWith('봉인된')) {
		return false;
	}
	
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

export const buildStats = (metaInfo: any): Stats[] => {
	const stats: Stats[] = [];
	Object.keys(metaInfo).forEach(key => {
		if (Object.keys(metaInfoEquipmentOptionMap).some(metaInfo => metaInfo === key)) {
			if (metaInfo[key] !== 0) {
				stats.push({
					key: metaInfoEquipmentOptionMap[key as MetaInfoStats],
					value: metaInfo[key],
				})
			}
		}
	});
	
	return stats;
}


