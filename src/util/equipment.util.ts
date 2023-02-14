import {
	Equipment,
	EquipmentCategory,
	EquipmentSubCategory,
	equipmentSubCategoryInfo,
	metaInfoEquipmentOptionMap,
	MetaInfoStats,
	Stats
} from '../model/equipment.model';
import {StarForceEventType} from '../ui/container/EquipmentEnhancementSimulator';

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

const getStarForceUpgradeCost = (item: Equipment, event: StarForceEventType[]) => {
	if (item.isSuperiorItem) {
		return Math.round(Math.pow(Math.round(item.level / 10) * 10, 3.56) / 100) * 100
	}
	
	let result: number;
	if (item.starForce < 10) {
		result = 1000 + (Math.pow(item.level, 3) * (item.starForce + 1)) / 25
	} else if (item.starForce < 15) {
		result = 1000 + (Math.pow(item.level, 3) * Math.pow(item.starForce + 1, 2.27)) / 400
	} else {
		result = 1000 + (Math.pow(item.level, 3) * Math.pow(item.starForce + 1, 2.27)) / 200
	}
	
	result = Math.round(result / 100) * 100;
	
	if (event.some(ev => ev === StarForceEventType.DISCOUNT_30)) {
		result = result * 0.7;
	}
	
	return result;
}

const getStarForceUpgradeSuccessPercentage = (item: Equipment, event: StarForceEventType[]) => {
	
	if (item.starForceFailCount === 2) {
		return 100;
	}
	
	if (event.some(ev => ev === StarForceEventType.PERCENTAGE_100) && [5, 10, 15].some(num => num === item.starForce) && !item.isSuperiorItem) {
		return 100;
	}
	
	if (item.isSuperiorItem) {
		if (item.starForce < 2) {
			return 50;
		}
		
		if (item.starForce < 3) {
			return 45;
		}
		
		if (item.starForce < 9) {
			return 40;
		}
		
		if (item.starForce < 10) {
			return 37;
		}
		
		if (item.starForce < 12) {
			return 35;
		}
		
		if (item.starForce < 13) {
			return 3;
		}
		
		if (item.starForce < 14) {
			return 2;
		}
		
		return 1;
	}
	
	if (item.starForce < 3) {
		return 95 - item.starForce;
	}
	
	if (item.starForce < 15) {
		return 100 - (5 * item.starForce);
	}
	
	if (item.starForce < 22) {
		return 30;
	}
	
	if (item.starForce < 23) {
		return 3;
	}
	
	if (item.starForce < 24) {
		return 2;
	}
	
	return 1;
}

const getStarForceUpgradeDestroyPercentage = (item: Equipment, event: StarForceEventType[]) => {
	
	if (item.starForceFailCount === 2) {
		return 0;
	}
	
	if (event.some(ev => ev === StarForceEventType.PERCENTAGE_100) && [5, 10, 15].some(num => num === item.starForce) && !item.isSuperiorItem) {
		return 0;
	}
	
	if (item.isSuperiorItem) {
		if (item.starForce < 5) {
			return 0;
		}
		
		if (item.starForce < 6) {
			return 1.8;
		}
		
		if (item.starForce < 7) {
			return 3;
		}
		
		if (item.starForce < 8) {
			return 4.2;
		}
		
		if (item.starForce < 9) {
			return 6;
		}
		
		if (item.starForce < 10) {
			return 9.5;
		}
		
		if (item.starForce < 11) {
			return 13;
		}
		
		if (item.starForce < 12) {
			return 16.3;
		}
		
		if (item.starForce < 13) {
			return 48.5;
		}
		
		if (item.starForce < 14) {
			return 49;
		}
		
		return 49.5;
	}
	
	if (item.starForce < 15) {
		return 0;
	}
	
	if (item.starForce < 18) {
		return 2.1;
	}
	
	if (item.starForce < 20) {
		return 2.8;
	}
	
	if (item.starForce < 20) {
		return 7.0;
	}
	
	if (item.starForce < 20) {
		return 19.4;
	}
	
	if (item.starForce < 20) {
		return 29.4;
	}
	
	return 39.6;
}

export const getStarForceUpgradeInfo = (item: Equipment, event: StarForceEventType[]): { cost: number, successPercentage: number, destroyPercentage: number } => {
	return {
		cost: getStarForceUpgradeCost(item, event),
		successPercentage: getStarForceUpgradeSuccessPercentage(item, event),
		destroyPercentage: getStarForceUpgradeDestroyPercentage(item, event)
	};
}

export const isStarForceDown = (item: Equipment): boolean => {
	if (item.isSuperiorItem) {
		// 슈페리얼은 1성부터 무조건 하락
		return item.starForce > 0;
	}
	
	// 15성 이하는 하락 X
	if (item.starForce < 16) {
		return false;
	}
	
	// 20성은 하락 X
	if (item.starForce === 20) {
		return false;
	}
	
	return true;
}
