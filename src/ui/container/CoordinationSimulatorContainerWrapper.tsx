import PageTitle from '../component/common/PageTitle';
import React, {useEffect, useState} from 'react';
import useMapleFetch from '../../hooks/useMapleFetch';
import {getAllItems} from '../../api/maplestory-io.api';
import {CustomCol, CustomRow} from "../component/common/element/CustomRowCol";
import Items from "../component/coordination-simulator/Items";
import Characters from '../component/coordination-simulator/Characters';
import NotificationUtil from '../../util/notification.util';
import styled from "styled-components";
import {FlexBox} from "../component/common/element/FlexBox";
import {Button, Spin, Switch} from "antd";
import {CommonStyledSpan} from '../../model/style.model';
import {CharactersModel, hasAllKeys} from '../../model/coordination-simulator.model';
import CustomPopConfirm from '../component/common/element/CustomPopConfirm';

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
	
	const [characters, setCharacters] = useState<undefined | CharactersModel[]>(undefined);
	
	useEffect(() => {
		let autoSavedData: string | null | CharactersModel[] = window.localStorage.getItem(AUTO_SAVE_DATA);
		
		try {
			if (autoSavedData === null) {
				autoSavedData = initDefaultCharacters();
			} else {
				autoSavedData = JSON.parse(autoSavedData);
				if (!Array.isArray(autoSavedData)) {
					throw Error ('saved data is not array');
				}
				
				autoSavedData.forEach(data => {
					if (!hasAllKeys(data)) {
						throw Error ('saved data not contains all key. maybe new keys are added')
					}
				})
			}
		} catch (e) {
			NotificationUtil.fire('warning', '저장된 데이터를 불러올수 없어 새로운 캐릭터 셋을 불러옵니다.', { duration: 5 } );
			autoSavedData = initDefaultCharacters();
		} finally {
			setCharacters(autoSavedData as CharactersModel[])
		}
	}, [])
	
	if ((!items || items.length === 0) || isLoading || !characters) {
		return (
			<LoadingBox>
				<Spin size={'large'} tip={'로딩중 입니다...'} />
			</LoadingBox>
		)
	}

	return <CoordinationSimulatorContainer items={items} charactersModel={characters} />
}

const AUTO_SAVE_KEY = 'CODI_SIMULATOR_AUTO_SAVE';
const AUTO_SAVE_DATA = 'CODI_SIMULATOR_AUTO_SAVE_DATA';
const MAX_CHARACTER = 10;

const DEFAULT_SIZE = { width: 45, height: 70 };

const initDefaultCharacters = (): CharactersModel[] => {
	return [{ ...DEFAULT_SIZE, key: crypto.randomUUID(), x: 0, y: 0, data: [] }]
}

const CoordinationSimulatorContainer = ({ items, charactersModel }: { items: any, charactersModel: CharactersModel[] }) => {
	
	const [characters, setCharacters] = useState<CharactersModel[]>(charactersModel);
	const [activeCharacterIdx, setActiveCharacterIdx] = useState<number>(0);
	
	const autoSaved = window.localStorage.getItem(AUTO_SAVE_KEY);
	const [autoSave, setAutoSave] = useState<boolean>(autoSaved !== null && autoSaved === 'true');

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
	
	const validateCharacters = (): boolean => {
		if (characters.length >= MAX_CHARACTER) {
			NotificationUtil.fire('error', `최대 ${MAX_CHARACTER}개의 캐릭터만 생성할 수 있습니다.`);
			return false;
		}
		
		return true;
	}
	
	const doAction = (type: 'ADD' | 'COPY' | 'RESET' | 'DELETE' | 'DELETE_ITEM' | 'HANDLE_RESIZE' | 'HANDLE_POSITION' | 'RESET_ENTIRE_CHARACTERS', ...args: any) => {
		switch (type) {
			
			// 캐릭터 추가
			case 'ADD':
				if (!validateCharacters()) {
					return;
				}
				
				setCharacters(pv => [ ...pv, initDefaultCharacters()[0] ])
				setActiveCharacterIdx(characters.length)
				break;
				
			// 캐릭터 복사
			case 'COPY':
				if (!validateCharacters()) {
					return;
				}
				
				let newCharacter = characters[activeCharacterIdx];
				newCharacter = {
					...newCharacter,
					key: crypto.randomUUID(),
					x: 0,
					y: 0
				}
				
				const newCharacters = [ ...characters, newCharacter ];
				
				setCharacters(newCharacters)
				setActiveCharacterIdx(newCharacters.length - 1)
				break;
				
			// 캐릭터 초기화
			case 'RESET':
				setCharacters(pv => {
					return pv.map((it, idx) => {
						if (idx === activeCharacterIdx) {
							it = { ...it, ...DEFAULT_SIZE, data: [] }
						}
						
						return it;
					})
				})
				break;
				
			// 캐릭터 삭제
			case 'DELETE':
				if (characters.length === 1) {
					NotificationUtil.fire('error', `최소 1개의 캐릭터가 존재해야 합니다.`);
					return;
				}
				
				setCharacters(pv => pv.filter((it, idx) => idx !== activeCharacterIdx))
				setActiveCharacterIdx(0)
				break;
				
			// 캐릭터 아이템 삭제
			case 'DELETE_ITEM':
				if (!args || !args[0] || args[0].length === 0) {
					NotificationUtil.fire('error', `시스템 에러가 발생하였습니다.`);
					return;
				}
				
				setCharacters(pv => pv.map((it, idx) => {
					if (idx !== activeCharacterIdx) {
						return it;
					}

					it.data = it.data.filter(it2 => it2.key !== args[0]);

					return it;
				}))
				break;
				
			// 전체 캐릭터 초기화
			case 'RESET_ENTIRE_CHARACTERS':
				setCharacters(initDefaultCharacters())
				break;
				
			// 캐릭터 사이즈 핸들링
			case 'HANDLE_RESIZE':
				if (!args || !args[0] || !args[1]) {
					return;
				}
				
				const key = args[0];
				const size = args[1];
				setCharacters(pv => pv.map( it => {
					if (it.key !== key) {
						return it;
					}
					
					return { ...it, ...size }
				}))
				
				break;
				
				// 캐릭터 위치 핸들링
			case 'HANDLE_POSITION':
				if (!args || !args[0]) {
					return;
				}
				
				const data: { key: string, x: number, y: number } = args[0];
				setCharacters(pv => pv.map( it => {
					if (it.key !== data.key) {
						return it;
					}
					
					return { ...it, ...data }
				}))
				
				break;
				
			default:
				NotificationUtil.fire('error', `구현되지 않은 액션입니다.`);
				throw Error('not implemented action')
		}
	}
	
	useEffect(() => {
		if (autoSave) {
			window.localStorage.setItem(AUTO_SAVE_KEY, 'true');
			window.localStorage.setItem(AUTO_SAVE_DATA, JSON.stringify(characters))
		} else {
			window.localStorage.setItem(AUTO_SAVE_KEY, 'false');
			window.localStorage.removeItem(AUTO_SAVE_DATA);
		}
	}, [autoSave, characters])

	return (
		<>
			<PageTitle
				title={'코디 시뮬레이터'}
				marginBottom={'.5rem'}
				extraContents={
					<>
						<FlexBox alignItems={'center'} gap={'.5rem'}>
							<CommonStyledSpan fontSize={'14px'} fontWeight={600}>자동저장</CommonStyledSpan>
							<Switch checked={autoSave} onChange={setAutoSave} />
							<CustomPopConfirm
								placement={'left'}
								title={'전체 캐릭터를 초기화 하시겠습니까?'}
								onConfirm={() => doAction('RESET_ENTIRE_CHARACTERS')}
							>
								<Button type={'primary'} size={'small'} danger>전체 캐릭터 초기화</Button>
							</CustomPopConfirm>
						</FlexBox>
					</>
				}
			/>
			<CustomRow gutter={16}>
				
				{/* 왼쪽 캔버스 */}
				<CustomCol span={18}>
					<Characters
						characters={characters}
						activeCharacterIdx={activeCharacterIdx}
						setActiveCharacterIdx={setActiveCharacterIdx}
						doAction={doAction}
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
