import PageTitle from '../component/common/PageTitle';
import React, {useEffect, useState} from 'react';
import useMapleFetch from '../../hooks/useMapleFetch';
import {getAllItems} from '../../api/maplestory-io.api';
import {
	EquipmentCategory,
	equipmentCategoryName,
	EquipmentSubCategory,
	equipmentSubCategoryInfo
} from '../../model/equipment.model';
import {Select} from 'antd';

const equipmentCategorySortMap: Map<EquipmentCategory, number> = new Map([
	['Character', 0],
	['Armor', 1],
	['Accessory', 2],
	['One-Handed Weapon', 3],
	['Two-Handed Weapon', 4],
	['Mount', 5]
]);

const equipmentCategoryOptions: { value: EquipmentCategory, label: string }[] = (Object.keys(equipmentCategoryName) as Array<EquipmentCategory>)
	.filter(key => equipmentCategorySortMap.has(key))
	.sort((a, b) => equipmentCategorySortMap.get(a)! - equipmentCategorySortMap.get(b)!)
	.map(key => ( { value: key, label: equipmentCategoryName[key] } ))

const equipmentSubCategoryOptions: { category: EquipmentCategory, value: EquipmentSubCategory, label: string }[] = equipmentSubCategoryInfo.map(item => ( { category: item[0], value: item[1], label: item[2] }) )

const CoordinationSimulatorContainer = () => {
	const [equipmentCategory, setEquipmentCategory] = useState(equipmentCategoryOptions[0].value)
	const [equipmentSubCategoryList, setEquipmentSubCategoryList] = useState(equipmentSubCategoryOptions.filter(item => item.category === equipmentCategory))
	const [equipmentSubCategory, setEquipmentSubCategory] = useState(equipmentSubCategoryList[0].value)
	
	const [items, errors, isLoading] = useMapleFetch({
		apiURL: getAllItems,
		filter: (data: any) => data
			.filter((item: any) => item.name )
			.filter(function(this: any, item: any) {
				return !this.has(item.name) && this.add(item.name)
			}, new Set)
	});
	
	useEffect(() => {
		console.log(equipmentCategory, equipmentSubCategoryList, equipmentSubCategory)
	}, [equipmentCategory, equipmentSubCategoryList, equipmentSubCategory])
	
	return (
		<>
			<PageTitle
				title={'코디 시뮬레이터'}
				marginBottom={'.5rem'}
			/>
			<Select
				onChange={value => {
					setEquipmentCategory(value)
					const list = equipmentSubCategoryOptions.filter(item => item.category === value);
					setEquipmentSubCategoryList(list)
					setEquipmentSubCategory(list[0].value)
				}}
				value={equipmentCategory}
				options={equipmentCategoryOptions}
			/>
			<Select
				onChange={value => setEquipmentSubCategory(value)}
				value={equipmentSubCategory}
				options={equipmentSubCategoryList}
			/>
		</>
	)
}

export default CoordinationSimulatorContainer
