import PageTitle from '../component/common/PageTitle';
import React, {useRef, useState} from 'react';
import useMapleFetch from '../../hooks/useMapleFetch';
import {getAllItems} from '../../api/maplestory-io.api';
import {CustomCol, CustomRow} from "../component/common/element/CustomRowCol";
import Items from "../component/coordination-simulator/Items";
import Characters from '../component/coordination-simulator/Characters';
import NotificationUtil from '../../util/notification.util';
import styled from "styled-components";
import {FlexBox} from "../component/common/element/FlexBox";
import {Spin} from "antd";
import {EquipmentSubCategory} from "../../model/equipment.model";

const LoadingBox = styled(FlexBox)`
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
`

const CoordinationSimulatorContainerWrapper = () => {

	const [items, errors, isLoading] = useMapleFetch({
		apiURL: getAllItems,
		filter: (data: any) => data
			.filter((item: any) => item.name !== undefined && item.name.length > 0)
			.filter(function(this: any, item: any) {
				return !this.has(item.name) && this.add(item.name)
			}, new Set)
	});
	
	console.log(items)

	if ((!items || items.length === 0) || isLoading) {
		return (
			<LoadingBox>
				<Spin size={'large'} tip={'로딩중 입니다...'} />
			</LoadingBox>
		)
	}

	return <CoordinationSimulatorContainer items={items} />
}

const CoordinationSimulatorContainer = ({ items }: { items: any }) => {
	const [characters, setCharacters] = useState<{ key: string, data: { key: EquipmentSubCategory, value: any }[] }[]>([{
		key: crypto.randomUUID(),
		data: []
	}]);

	const [activeCharacterIdx, setActiveCharacterIdx] = useState<number>(0);

	const onClickItem = (item: any) => {
		let character = characters[activeCharacterIdx];
		const subCategory = item.typeInfo.subCategory;
		const newItem = { key: subCategory, value: item };

		if (character.data.some(item => item.key === subCategory)) {
			character.data = character.data.filter(item => item.key !== subCategory)
		}

		character.data.push(newItem);
		
		setCharacters(pv => pv.map((it, idx) => idx === activeCharacterIdx ? character : it));
	}
	
	const addCharacter = () => {
		const MAX_CHARACTER = 10;
		
		if (characters.length >= MAX_CHARACTER) {
			NotificationUtil.fire('error', `최대 ${MAX_CHARACTER}개의 캐릭터만 생성할 수 있습니다.`);
			return;
		}

		setCharacters(pv => [ ...pv, { key: crypto.randomUUID(), data: [] } ])
	}
	
	const deleteCharacter = () => {
		if (characters.length === 1) {
			NotificationUtil.fire('error', `최소 1개의 캐릭터가 존재해야 합니다.`);
			return;
		}
		
		setCharacters(pv => pv.filter((it, idx) => idx !== activeCharacterIdx))
		setActiveCharacterIdx(0)
	}
	
	const resetCharacter = () => {
		setCharacters(pv => {
			return pv.map((it, idx) => {
				if (idx === activeCharacterIdx) {
					it.data = [];
				}

				return it;
			})
		})
	}
	
	const deleteItem = (key: string) => {
		setCharacters(pv => pv.map((it, idx) => {
			if (idx !== activeCharacterIdx) {
				return it;
			}

			it.data = it.data.filter(it2 => it2.key !== key);
			
			return it;
		}))
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
						activeCharacterIdx={activeCharacterIdx}
						setActiveCharacterIdx={setActiveCharacterIdx}
						addCharacter={addCharacter}
						deleteCharacter={deleteCharacter}
						resetCharacter={resetCharacter}
						deleteItem={deleteItem}
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
