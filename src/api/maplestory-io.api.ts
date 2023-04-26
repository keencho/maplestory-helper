import {baseURL} from '../model/maplestory-io.model';

export const getAllItems = (region:string, version: string) => {
	return `${baseURL}/api/${region}/${version}/item`;
}

export const getAllEquipment = (region: string, version: string) => {
	return `${baseURL}/api/${region}/${version}/item?overallCategoryFilter=Equip&cashFilter=false`;
}

export const getItem = (region: string, version: string, itemId: string) => {
	return `${baseURL}/api/${region}/${version}/item/${itemId}`;
}

export const getItemIcon = (region: string, version: string, itemId: string) => {
	return `${baseURL}/api/${region}/${version}/item/${itemId}/icon`;
}

export const getCharacter = (items: string) => {
	return `${baseURL}/api/character/${items}/stand1/0?showears=false&showLefEars=false&showHighLefEars=false&resize=1&name=&flipX=false&bgColor=0,0,0,0`
}
