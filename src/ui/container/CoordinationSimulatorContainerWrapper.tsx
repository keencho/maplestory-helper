import PageTitle from '../component/common/PageTitle';
import React, {useEffect, useState} from 'react';
import useMapleFetch from '../../hooks/useMapleFetch';
import {getAllItems, getCharacter} from '../../api/maplestory-io.api';
import {CustomCol, CustomRow} from "../component/common/element/CustomRowCol";
import Items from "../component/coordination-simulator/Items";
import {region, version} from "../../model/maplestory-io.model";

const CoordinationSimulatorContainerWrapper = () => {

	const [items, errors, isLoading] = useMapleFetch({
		apiURL: getAllItems,
		filter: (data: any) => data
			.filter((item: any) => item.name !== undefined && item.name.length > 0)
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

	const [selectedItems, setSelectedItems] = useState<{ key: string, value: any }[]>([]);

	const onClickItem = (item: any) => {
		const subCategory = item.typeInfo.subCategory;

		if (selectedItems.some(item => item.key === subCategory)) {
			setSelectedItems(pv => [ ...selectedItems.filter(item => item.key !== subCategory), { key: subCategory, value: item } ]);
		} else {
			setSelectedItems(pv => [ ...pv, { key: subCategory, value: item } ]);
		}
	}

	useEffect(() => {
		if (selectedItems.length === 0) return;

		const arr: any = selectedItems.map(item => ( { itemId: item.value.id, region: region, version: version  } ));
		// arr.push({ itemId: 1012050, animationName: 'default', region: region, version: version });
		const str = encodeURIComponent(JSON.stringify(arr).slice(1, -1));

		console.log(JSON.stringify(str))
		console.log(str)

		fetch(getCharacter(str))
			.then((res) => console.log(res));
	}, [selectedItems])

	return (
		<>
			<PageTitle
				title={'코디 시뮬레이터'}
				marginBottom={'.5rem'}
			/>
			<CustomRow gutter={16}>
				
				{/* 왼쪽 캔버스 */}
				<CustomCol span={18}>
					<pre>
						{JSON.stringify(selectedItems, undefined, 4)}
					</pre>
				</CustomCol>

				{/* 오른쪽 코디 검색 */}
				<CustomCol span={6}>

					<Items items={items} onClickItem={onClickItem} />


				</CustomCol>
				
			</CustomRow>
		</>
	)
}

export default CoordinationSimulatorContainerWrapper