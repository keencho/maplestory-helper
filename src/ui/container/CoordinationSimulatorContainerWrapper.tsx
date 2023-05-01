import PageTitle from '../component/common/PageTitle';
import React, {useRef, useState} from 'react';
import useMapleFetch from '../../hooks/useMapleFetch';
import {getAllItems} from '../../api/maplestory-io.api';
import {CustomCol, CustomRow} from "../component/common/element/CustomRowCol";
import Items from "../component/coordination-simulator/Items";
import Characters from '../component/coordination-simulator/Characters';
import NotificationUtil from '../../util/notification.util';

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
	const [characters, setCharacters] = useState<{ key: string, value: any }[][]>([...Array(1)].map(_ => []));
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
		
		setCharacters(pv => pv.map((it, idx) => idx === activeCharacterIdx ? character : it));
	}
	
	const addCharacter = () => {
		const MAX_CHARACTER = 10;
		
		if (characters.length >= MAX_CHARACTER) {
			NotificationUtil.fire('error', `최대 ${MAX_CHARACTER}개의 캐릭터만 생성할 수 있습니다.`);
			return;
		}
		
		setCharacters(pv => [ ...pv, [] ])
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
		setCharacters(pv => pv.map((it, idx) => idx === activeCharacterIdx ? [] : it))
	}
	
	const deleteItem = (key: string) => {
		setCharacters(pv => pv.map((it, idx) => {
			if (idx !== activeCharacterIdx) {
				return it;
			}
			
			return it.filter(it2 => it2.key !== key);
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
