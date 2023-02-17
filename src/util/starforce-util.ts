import {Equipment, StarForceEventType} from '../model/equipment.model';
import {getStarForceUpgradeInfo, isStarForceDown} from './equipment.util';

export const doStarForce = (item: Equipment, event: StarForceEventType[]): Equipment => {
	const map = new Map<keyof Equipment, any>();
	const info = getStarForceUpgradeInfo(item, event);
	
	// 복구
	if (item.destroyed === true) {
		map.set('starForce', item.isSuperiorItem ? 0 : 12);
		map.set('starForceFailCount', 0);
		map.set('usedMeso', item.usedMeso + item.spairMeso);
		map.set('destroyed', false);
	}
	// 성공
	else if (item!.starForceFailCount === 2 || Math.floor(Math.random() * 100) <= info.successPercentage) {
		map.set('starForce', item.starForce + (event.some(ev => ev === StarForceEventType.ONE_PLUS_ONE) && item.starForce <= 10 && !item.isSuperiorItem ? 2 : 1));
		map.set('starForceFailCount', 0);
		map.set('usedMeso', item.usedMeso + info.cost);
		map.set('destroyed', false);
	}
	// 파괴
	else if (Math.floor(Math.random() * 100) <= info.destroyPercentage) {
		map.set('starForce', 0);
		map.set('starForceFailCount', 0);
		map.set('usedMeso', item.usedMeso + info.cost);
		map.set('destroyedCount', item.destroyedCount + 1);
		map.set('destroyed', true);
	}
	
	// 실패
	else {
		if (isStarForceDown(item)) {
			map.set('starForce', item.starForce - 1);
			map.set('starForceFailCount', (item.starForceFailCount ?? 0) + 1);
		}
		map.set('usedMeso', item.usedMeso + info.cost);
	}
	
	map.forEach((value, key) => item[key] = value as never);
	
	return { ...item };
}

export const doSimpleStarForce = (item: Equipment, event: StarForceEventType[]): Equipment => {
	const info = getStarForceUpgradeInfo(item, event);
	
	// 복구
	if (item.destroyed === true) {
		item.starForce = item.isSuperiorItem ? 0 : 12;
		item.starForceFailCount = 0;
		item.usedMeso = item.usedMeso + item.spairMeso;
		item.destroyed = false;
		
		return item;
	}
	
	// 성공
	if (item!.starForceFailCount === 2 || Math.floor(Math.random() * 100) <= info.successPercentage) {
		item.starForce = item.starForce + (event.some(ev => ev === StarForceEventType.ONE_PLUS_ONE) && item.starForce <= 10 && !item.isSuperiorItem ? 2 : 1);
		item.starForceFailCount = 0;
		item.usedMeso = item.usedMeso + info.cost;
		item.destroyed = false;
		
		return item;
	}
	
	// 파괴
	if (Math.floor(Math.random() * 100) <= info.destroyPercentage) {
		
		item.starForce = 0;
		item.starForceFailCount = 0;
		item.usedMeso = item.usedMeso + info.cost;
		item.destroyedCount = item.destroyedCount + 1;
		item.destroyed = true;
		
		return item;
	}
	
	// 실패
	
	if (isStarForceDown(item)) {
		item.starForce = item.starForce - 1;
		item.starForceFailCount = (item.starForceFailCount ?? 0) + 1;
		item.usedMeso = item.usedMeso + info.cost;
	}
	
	return item;
}
