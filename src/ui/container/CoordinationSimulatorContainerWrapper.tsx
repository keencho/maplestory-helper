import PageTitle from '../component/common/PageTitle';
import React, {useEffect, useState} from 'react';
import useMapleFetch from '../../hooks/useMapleFetch';
import {getAllItems, getCharacter} from '../../api/maplestory-io.api';
import {CustomCol, CustomRow} from "../component/common/element/CustomRowCol";
import Items from "../component/coordination-simulator/Items";
import {region, version} from "../../model/maplestory-io.model";
import Characters from '../component/coordination-simulator/Characters';

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

const initDefaultCharacter = () => {
	const arr: any[] = [];
	
	// 머리
	arr.push({ itemId: 12000, region: region, version: version });
	// 몸통
	arr.push({ itemId: 2000, region: region, version: version });
	
	return arr;
}

const CoordinationSimulatorContainer = ({ items }: { items: any }) => {
	const [characters, setCharacters] = useState<{ key: string, value: any }[][]>([...Array(1)].map(_ => initDefaultCharacter()));
	const [activeCharacterIdx, setActiveCharacterIdx] = useState<number>(0);

	const onClickItem = (item: any) => {
		let character = characters[activeCharacterIdx];
		const subCategory = item.typeInfo.subCategory;
		const newItem = { key: subCategory, value: item };
		
		if (character.some(item => item.key === subCategory)) {
			character = character.filter(item => item.key !== subCategory);
			character.push(newItem)
		} else {
			character.push(newItem);
		}
		
		setCharacters(pv => pv.filter((it, idx) => idx === activeCharacterIdx ? character : it));
	}
	
	const addCharacter = () => {
		setCharacters(pv => [ ...pv, initDefaultCharacter() ])
	}

	return (
		<>
			<PageTitle
				title={'코디 시뮬레이터'}
				marginBottom={'.5rem'}
			/>
			<CustomRow gutter={16}>
				
				{/* 왼쪽 캔버스 */}
				<CustomCol span={18}>
					<Characters
						characters={characters}
						setActiveCharacterIdx={setActiveCharacterIdx}
						addCharacter={addCharacter}
					/>
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
