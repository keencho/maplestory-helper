import PageTitle from '../component/common/PageTitle';
import React, {useEffect, useState} from 'react';
import useMapleFetch from '../../hooks/useMapleFetch';
import {getAllItems} from '../../api/maplestory-io.api';
import {CustomCol, CustomRow} from "../component/common/element/CustomRowCol";
import Items from "../component/coordination-simulator/Items";
import Characters from '../component/coordination-simulator/Characters';
import styled from "styled-components";
import {FlexBox} from "../component/common/element/FlexBox";
import {Button, Spin, Switch, Typography} from "antd";
import {CommonStyledSpan} from '../../model/style.model';
import {
    ActionType,
    BaseColorMax,
    BaseColorMin,
    CharactersModel,
    ColorInfo,
    hasAllKey
} from '../../model/coordination-simulator.model';
import CustomPopConfirm from '../component/common/element/CustomPopConfirm';
import {compress, deCompress} from '../../util/compress.util';
import useModal from '../../hooks/useModal';
import {GREY} from '../../model/color.model';
import {deleteOldCache} from "../../util/fetch.util";
import {cacheName} from "../../model/maplestory-io.model";
import useNotification from "../../hooks/useNotification";

const { Text } = Typography;

const LoadingBox = styled(FlexBox)`
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
    display: flex;
    flex-direction: column;
    gap: .5rem;
`

const QUERY_STRING_COMPRESSED_DATA_KEY = "compressed_data";

const CoordinationSimulatorContainerWrapper = () => {
    
    const notification = useNotification();
	const [items, errors, isLoading] = useMapleFetch({
		apiURL: getAllItems,
		filter: (data: any) => data
			.filter((item: any) => item.name !== undefined && item.name.length > 0)
			.filter(function(this: any, item: any) {
				return !this.has(item.name) && this.add(item.name)
			}, new Set)
	});
    
    const [showResetButton, setShowResetButton] = useState<boolean>(false);
	
	const [characters, setCharacters] = useState<undefined | CharactersModel[]>(undefined);
	
	const validateData = (data: any): boolean => {
		if (!Array.isArray(data)) return false;
		
		for (const item of data) {
			if (!hasAllKey(item)) {
				return false;
			}
		}
		
		return true;
	}
    
    // 캐시스토리지에 문제가 있다고 가정하고 싹 비우고 페이지 새로고침한다.
    const reset = () => {
        deleteOldCache(cacheName, true).then(() => window.location.reload())
    }
    
    useEffect(() => {
        let timer: any = undefined;
        
        if (isLoading) {
            timer = setTimeout(() => {
                setShowResetButton(true);
            }, 10000);
        }
        
        return () => {
            if (timer) clearTimeout(timer)
        }
    }, [isLoading])
	
	useEffect(() => {
		let autoSavedData: string | null | CharactersModel[] = null;
		
		// 1. '코디 공유하기' 로 생성된 URL로 접근했는지 확인
		const params = new URLSearchParams(new URL(window.location.href).search);
		const compressedData = params.get(QUERY_STRING_COMPRESSED_DATA_KEY);
		let isAccessByCodiSharedData = false;
		if (compressedData) {
			try {
				const deCompressedData = JSON.parse(deCompress(decodeURIComponent(compressedData)));
				if (!validateData(deCompressedData)) {
					throw Error ('validate failed');
				}
				isAccessByCodiSharedData = true;
				autoSavedData = deCompressedData;
				notification('success', '코디 불러오기에 성공하였습니다.', { duration: 3 } );
			} catch (e) {
				notification('warning', '코디 불러오기에 실패하였습니다. URL을 다시 공유받아 보세요.', { duration: 5 } );
				isAccessByCodiSharedData = false;
			}
		}
		
		// 2. 로컬 스토리지 확인 - 생성된 URL로 접근했고 유효한 데이터면 아예 확인하지 않는다.
		if (!isAccessByCodiSharedData) {
			try {
				autoSavedData = window.localStorage.getItem(AUTO_SAVE_DATA);
				
				if (autoSavedData === null) {
					autoSavedData = initDefaultCharacters();
				} else {
					autoSavedData = JSON.parse(autoSavedData);
					if (!validateData(autoSavedData)) {
						throw Error ('validate failed');
					}
				}
			} catch (e) {
				notification('warning', '저장된 데이터를 불러올수 없어 새로운 캐릭터 셋을 불러옵니다.', { duration: 5 } );
				autoSavedData = initDefaultCharacters();
			}
		}
		
		// 3. 데이터 세팅
		setCharacters(autoSavedData as CharactersModel[])
		
		// 4. url 초기화
		const uri = window.location.toString();
		if (uri.indexOf("?") > 0) {
			const clean_uri = `${uri.substring(0, uri.indexOf("?"))}`;
			window.history.replaceState({}, document.title, clean_uri);
		}
	}, [])
	
	if ((!items || items.length === 0) || isLoading || !characters) {
		return (
			<LoadingBox>
				<Spin size={'large'} tip={'로딩중 입니다...'}><div/></Spin>
                { showResetButton 
                    ? 
                        <>
                            <Text type={'warning'} style={{ textAlign: 'center' }}>
                                로딩시간이 길어지고 있습니다.
                                <br />
                                아래 버튼을 눌러 페이지를 초기화 해보세요.
                            </Text>
                            <Button type={'primary'} onClick={reset}>초기화</Button>
                        </>
                    : <></> }
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
    
    const notification = useNotification();
 
	const [characters, setCharacters] = useState<CharactersModel[]>(charactersModel);
	const [activeCharacterIdx, setActiveCharacterIdx] = useState<number>(0);
	
	const autoSaved = window.localStorage.getItem(AUTO_SAVE_KEY);
	const [autoSave, setAutoSave] = useState<boolean>(autoSaved !== null && autoSaved === 'true');
	const [showModal] = useModal();

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
            notification('error', `최대 ${MAX_CHARACTER}개의 캐릭터만 생성할 수 있습니다.`)
			return false;
		}
		
		return true;
	}
	
	const doAction = async (type: ActionType, ...args: any) => {
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
							it = { ...it, ...DEFAULT_SIZE, hairCustomMix: undefined, data: [] }
						}
						
						return it;
					})
				})
				break;
				
			// 캐릭터 삭제
			case 'DELETE':
				if (characters.length === 1) {
                    notification('error', '최소 1개의 캐릭터가 존재해야 합니다.')
					return;
				}
				
				setCharacters(pv => pv.filter((it, idx) => idx !== activeCharacterIdx))
				setActiveCharacterIdx(0)
				break;
				
			// 캐릭터 아이템 삭제
			case 'DELETE_ITEM':
				if (!args || !args[0] || args[0].length === 0) {
                    notification('error', '시스템 에러가 발생하였습니다.')
					return;
				}
				
				setCharacters(pv => pv.map((it, idx) => {
					if (idx !== activeCharacterIdx) {
						return it;
					}

					it.data = it.data.filter(it2 => it2.key !== args[0]);
                    
                    if (args[0] === 'Hair') {
                        it.hairCustomMix = undefined;
                    }

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
				
			// 코디 공유 (URL 압축)
			case 'SHARE_CODI':
				const inputString = JSON.stringify(characters);
				const compressed = compress(inputString);
				
				const url = window.location.origin + window.location.pathname + '?' + QUERY_STRING_COMPRESSED_DATA_KEY + '=' + encodeURIComponent(compressed)
				
				if (url.length > 2000) {
					notification('error', '캐릭터가 많아 URL을 생성할 수 없습니다. 캐릭터 수를 줄이고 다시 시도해 주세요.', { duration: 5 })
					return;
				}
				
				const copy = () => {
					navigator.clipboard.writeText(url)
						.then(() => notification('success', 'URL이 복사되었습니다.'))
						.catch(() => notification('error', 'URL 복사에 실패하였습니다. 직접 텍스트를 드래그하여 복사해 주세요.', { duration: 5 }))
				}
				
				showModal({
					title: '코디 공유하기',
					size: 'middle',
					contents: (
						<>
							아래 URL을 복사후 지인에게 전송하여 코디를 공유해 보세요.
							<div
								style={{
									marginTop: '1rem',
									position: 'relative',
									border: `1px solid ${GREY}`,
									borderRadius: '.25rem',
								}}
							>
								<FlexBox
									justifyContent={'space-between'}
									borderBottom={`1px solid ${GREY}`}
									padding={'.5rem 1rem'}
								>
									<span>URL</span>
									<Button
										type={'primary'}
										size={'small'}
										onClick={copy}
									>
										복사
									</Button>
								</FlexBox>
								<pre
									style={{
										marginTop: '.5rem',
										padding: '.25rem 1rem',
                                        overflow: 'auto'
									}}
								>
									{url}
								</pre>
							</div>
							
						</>
					)
				})
                
                break;
                
            // 헤어 커믹 변경
            case 'HAIR_CUSTOM_MIX_SET_COLOR':
                if (!args || !args[0] || !args[1]) {
                    return;
                }
                
                const type = args[0]
                const color = args[1];
                
                const colorArr = Object.keys(ColorInfo);
                
                if (!colorArr.includes(color) || ( type !== 'BASE' && type !== 'MIX' )) {
                    return;
                }
                
                const character = characters[activeCharacterIdx];
                const intfKey = type === 'BASE' ? 'baseColor' : 'mixColor';
                const oIntfKey = type === 'BASE' ? 'mixColor' : 'baseColor';
                
                // 반대쪽 색상이 현재 변경하려는 색상과 일치하는지 검증
                if (character.hairCustomMix) {
                    const oColor = character.hairCustomMix[oIntfKey];
                    
                    if (oColor) {
                        if (color === oColor) {
                            notification('error', '베이스 컬러와 믹스 컬러는 서로 달라야 합니다.');
                            return;
                        }
                    }
                }
                
                
                setCharacters(pv => pv.map( (it, idx) => {
                    if (idx !== activeCharacterIdx) {
                        return it;
                    }
                    
                    if (it.hairCustomMix && it.hairCustomMix[oIntfKey] && !it.hairCustomMix.baseColorRatio) {
                        it.hairCustomMix = { ...it.hairCustomMix, baseColorRatio: (BaseColorMin + BaseColorMax) / 2 }
                    }
                    
                    return { ...it, hairCustomMix: { ...it.hairCustomMix, [intfKey]: color } }
                }))
                
            break;
            
            // 헤어 커믹 비율 변경
            case 'HAIR_CUSTOM_MIX_BASE_COLOR_RATIO':
                if (!args || !args[0]) {
                    return;
                }
                
                setCharacters(pv => pv.map( (it, idx) => {
                    if (idx !== activeCharacterIdx) {
                        return it;
                    }

                    return { ...it, hairCustomMix: { ...it.hairCustomMix, baseColorRatio: args[0] } }
                }))
                
                break;
                
            // 헤어 커믹 리셋
            case 'RESET_HAIR_CUSTOM_MIX':
                setCharacters(pv => pv.map( (it, idx) => {
                    if (idx !== activeCharacterIdx) {
                        return it;
                    }
                    
                    return { ...it, hairCustomMix: undefined }
                }))
                
                break;
                
            // element size 변경등으로 인한 캐릭터 포지션 컨트롤
            case 'CONTROL_CHARACTERS_POSITION':
                if (!args || !args[0]) {
                    return;
                }
                const width = args[0].width;
                const height = args[0].height;

                if (!width || !height) {
                    return;
                }
                
                setCharacters(pv => pv.map((it) => {
                    if (it.x + it.width > width) {
                        it.x = width - it.width;
                    }
                    
                    if (it.y + it.height > height) {
                        it.y = height - it.height;
                    }

                    return it;
                }));
                break;
				
			default:
                notification('error', '구현되지 않은 액션입니다.')
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
                    <FlexBox alignItems={'center'} gap={'.5rem'}>
                        <CommonStyledSpan fontSize={'14px'} fontWeight={600}>
                            자동저장
                        </CommonStyledSpan>
                        <Switch checked={autoSave} onChange={setAutoSave} />
                        <Button type={'primary'} size={'small'} onClick={() => doAction('SHARE_CODI')}>코디 공유하기</Button>
                        <CustomPopConfirm
                            placement={'left'}
                            title={'전체 캐릭터를 초기화 하시겠습니까?'}
                            onConfirm={() => doAction('RESET_ENTIRE_CHARACTERS')}
                        >
                            <Button type={'primary'} size={'small'} danger>전체 캐릭터 초기화</Button>
                        </CustomPopConfirm>
                    </FlexBox>
				}
			/>
			<CustomRow gutter={16}>
				
				{/* 왼쪽 캔버스 */}
				<CustomCol span={18} hideOverflow={true}>
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
