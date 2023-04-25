import PageTitle from '../component/common/PageTitle';
import React, {useEffect, useState} from 'react';
import useMapleFetch from '../../hooks/useMapleFetch';
import {getAllItems, getItemIcon} from '../../api/maplestory-io.api';
import {
	EquipmentCategory,
	equipmentCategoryName,
	EquipmentSubCategory,
	equipmentSubCategoryInfo
} from '../../model/equipment.model';
import {Select} from 'antd';
import {FlexBox} from "../component/common/element/FlexBox";
import {cacheName, region, version} from "../../model/maplestory-io.model";
import AsyncCacheImage from "../component/common/element/AsyncCacheImage";
import {CustomCol, CustomRow} from "../component/common/element/CustomRowCol";
import Items from "../component/coordination-simulator/Items";

const CoordinationSimulatorContainerWrapper = () => {

	const [items, errors, isLoading] = useMapleFetch({
		apiURL: getAllItems,
		filter: (data: any) => data
			// .filter((item: any) => item.name)
			.filter(function(this: any, item: any) {
				return !this.has(item.name) && this.add(item.name)
			}, new Set)
	});

	if ((!items || items.length === 0) || isLoading) {
		return <>로딩중...</>
	}

	return <CoordinationSimulatorContainer items={items} />
}

const CoordinationSimulatorContainer = ({ items }: { items: any }) => {

	return (
		<>
			<PageTitle
				title={'코디 시뮬레이터'}
				marginBottom={'.5rem'}
			/>
			<CustomRow gutter={16}>
				
				{/* 왼쪽 캔버스 */}
				<CustomCol span={18}></CustomCol>

				{/* 오른쪽 코디 검색 */}
				<CustomCol span={6}>

					<Items items={items} />


				</CustomCol>
				
			</CustomRow>
		</>
	)
}

export default CoordinationSimulatorContainerWrapper
