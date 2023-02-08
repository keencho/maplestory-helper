import {baseURL} from '../model/maplestory-io.model';

export const getAllItems = (region: string, version: string) => {
	return `${baseURL}/api/${region}/${version}/item?overallCategoryFilter=Equip&cashFilter=false`;
}

export const getItemIcon = (region: string, version: string, itemId: string) => {
	return `${baseURL}/api/${region}/${version}/item/${itemId}/icon`;
}
