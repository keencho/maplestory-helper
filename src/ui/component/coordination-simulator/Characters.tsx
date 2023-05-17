import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import {Alert, Button, Card, Empty, InputNumber, List, Slider, Tooltip, Typography} from 'antd';
import styled from 'styled-components';
import {CheckOutlined, CloseOutlined, PlusOutlined} from '@ant-design/icons';
import {getCharacter, getItemIcon} from '../../../api/maplestory-io.api';
import {cacheName, region, version} from '../../../model/maplestory-io.model';
import {EquipmentSubCategory, equipmentSubCategoryInfo} from '../../../model/equipment.model';
import {FlexBox} from '../common/element/FlexBox';
import {DraggableData, Rnd} from "react-rnd";
import AsyncImage from "../common/element/AsyncImage";
import {BLUE, BORDER} from "../../../model/color.model";
import SkinDefault from '../../../assets/icon/items/skin_default.png';
import {DraggableEvent} from 'react-draggable';
import {
    ActionType,
    BaseColorMax,
    BaseColorMin,
    CharactersModel,
    Color,
    ColorInfo,
    ColorInfoType,
    SortedColorInfo
} from '../../../model/coordination-simulator.model';
import CustomPopConfirm from '../common/element/CustomPopConfirm';
import {ResetButton} from "../common/element/ResetButton";
import {useRecoilValue} from "recoil";
import {ThemeAtom} from "../../../recoil/theme.atom";

const { Title } = Typography;

const Container = styled.div`
	width: 100%;
	height: 100%;
    overflow: hidden;
    display: flex;
`

const CharacterPlayGround = styled.div`
    flex: 1;
`

const ImageWrapper = styled.div`
	position: absolute;
	cursor: move;
	display: flex;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 100%;
`

const CharacterInfoWrapper = styled.div`
    width: 300px;
    max-width: 300px;
    border-radius: 4px;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`

const CharacterItemBox = styled.div<{ theme: 'light' | 'dark' }>`
    border: 1px solid ${props => BORDER(props.theme)};
    border-radius: 4px;
    overflow-y: hidden;
    display: flex;
    flex-direction:column;
    height: 100%;
`

const CharacterItemHeader = styled.div`
    padding: .5rem .75rem;
`

const CharacterItemList = styled.div<{ theme: 'light' | 'dark' }>`
    border-top: 1px solid ${props => BORDER(props.theme)};
    overflow-y: scroll;
`

const CharacterItem = styled.div<{ theme: 'light' | 'dark' }>`
    padding: 0 1rem;

    &:not(:last-child) {
        border-bottom: 1px solid ${props => BORDER(props.theme)};
    }
`

const CustomMixBoxWrapper = styled.div<{ theme: 'light' | 'dark' }>`
    padding: .75rem 1rem;
    border: 1px solid ${props => BORDER(props.theme)};
    border-radius: 4px;
`

const CustomMixBox = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: center;
    gap: .5rem;
`

const CustomMixColorBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    row-gap: .75rem;
`

const CustomMixColorWrapper = styled.div`
    width: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
`

const CustomMixColor = styled(ResetButton)<{ color: string }>`
    width: 25px;
    height: 25px;
    background-color: ${props => props.color};
    
    &:hover {
        transform: translateY(-1.5px);
    }
`

const CustomMixColorInputBox = styled.div`
    margin-top: .5rem;
    display: flex;
    gap: .5rem;
    
    div {
       flex: 1;
    }
`

const Characters = (
	{
		characters,
		setActiveCharacterIdx,
		activeCharacterIdx,
		doAction
	}:
		{
			characters: CharactersModel[],
			activeCharacterIdx: number,
			setActiveCharacterIdx: Dispatch<SetStateAction<number>>,
			doAction: (type: ActionType, ...args: any) => void
		}
) => {
    
    const theme = useRecoilValue(ThemeAtom);
    const activeCharacter = characters[activeCharacterIdx];
	const playGroundRef = useRef<HTMLDivElement>(null);
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [refLoaded, setRefLoaded] = useState<boolean>(false);
    
    const isUseHairCustomMixColor = (character: CharactersModel): boolean => {
        return character.hairCustomMix !== undefined && character.hairCustomMix.baseColor !== undefined && character.hairCustomMix.mixColor !== undefined && character.hairCustomMix.baseColorRatio !== undefined;
    }
	
	const getCharacterSrc = (character: { key: EquipmentSubCategory, value: any }[], hairCustomMixColor?: Color) => {
		let arr = character.map((item: any) => (item.value.id))
        
        // 헤어 커믹 적용
        if (hairCustomMixColor) {
            // 기존 헤어 검색
            const hair = character.find(item => item.key === 'Hair');
            if (hair) {
                const hairId = hair.value.id
                // 기존 헤어 제거
                arr = arr.filter(id => id !== hairId);
                
                const hairWithoutColorId = hairId.toString().slice(0, -1);
                const mapleIoIdx = ColorInfo[hairCustomMixColor].ioIdx;
                
                arr.push(hairWithoutColorId + mapleIoIdx.toString())
            }
        }
		
		// 피부인 경우 '얼굴 피부' 만 대상이기 때문에 몸통에도 똑같이 적용한다.
		const head = character.find(item => item.key === 'Head')
		if (head) {
			arr.push(Number(head.value.id.toString().substring(1)))
		} else {
			// 머리
			arr.push(12000);
			// 몸통
			arr.push(2000);
		}
		
		arr = arr.map(id => ({ itemId: id, region: region, version: version }));
		
		const str = encodeURIComponent(JSON.stringify(arr).slice(1, -1));
		
		return getCharacter(str)
	}
	
	const dragControl = (event: DraggableEvent, data: DraggableData, ...args: any) => {
		if (event.type === 'mousemove') {
			setIsDragging(true)
		}
        
        // console.log(data);
        //
        // if (event.type === 'mousemove') {
        //     setTimeout(() => {
        //         if (args && args.length > 0) {
        //             doAction('HANDLE_POSITION', { x: data.x, y: data.y, key: args[0] })
        //         }
        //
        //     }, 100);
        // }
		
		if (event.type === 'mouseup') {
			setTimeout(() => {
				if (args && args.length > 0) {
					doAction('HANDLE_POSITION', { x: data.x, y: data.y, key: args[0] })
				}
                
                setIsDragging(false);
			}, 100);
		}
	}
	
	const getDescriptionByKey = (key: string) => {
		const matchedItem = equipmentSubCategoryInfo.find(info => info[1] === key);
		
		if (!matchedItem) {
			return '기타'
		}
		return matchedItem[2];
	}
    
    const isHairCustomMixMatch = (type: 'BASE' | 'MIX', color: Color): boolean => {
        
        if (!activeCharacter.hairCustomMix) return false;
        
        const key = type === 'BASE' ? 'baseColor' : 'mixColor';
        
        if (!activeCharacter.hairCustomMix[key]) return false;
        
        if (activeCharacter.hairCustomMix[key] !== color) return false;
        
        return true;
    }
	
	useEffect(() => {
		if (playGroundRef.current) {
			setRefLoaded(true)

            const observer = new ResizeObserver(() => doAction('CONTROL_CHARACTERS_POSITION', { width: playGroundRef.current?.clientWidth, height: playGroundRef.current?.clientHeight }));
            observer.observe(playGroundRef.current);

            return () => {
                observer.disconnect()
            }
		}
	}, [playGroundRef])
	
	return (
		<Container>
            <CharacterPlayGround ref={playGroundRef}>
                {
                    refLoaded && characters.map((character, idx) => (
                        <Rnd
                            key={character.key}
                            position={{
                                x: character.x,
                                y: character.y
                            }}
                            size={{
                                width: character.width,
                                height: character.height
                            }}
                            bounds={'parent'}
                            enableResizing={{
                                bottomRight: true
                            }}
                            resizeHandleStyles={{
                                bottomRight: {
                                    width: '10px',
                                    height: '10px',
                                    borderRadius: '10px',
                                    backgroundColor: BLUE
                                }
                            }}
                            onResizeStop={(e, dir, ref) => doAction('HANDLE_RESIZE', character.key, {
                                width: ref.offsetWidth,
                                height: ref.offsetHeight
                            })}
                            // onDragStart={dragControl}
                            onDragStop={(e, data) => dragControl(e, data, character.key)}
                            // onDrag={(e, data) => dragControl(e, data, character.key)}
                            minWidth={45}
                            minHeight={70}
                            maxWidth={135}
                            maxHeight={210}
                            style={{
                                zIndex: 999
                            }}
                        >
                            <ImageWrapper onClick={() => isDragging ? undefined : setActiveCharacterIdx(idx)}>
                                {
                                    isUseHairCustomMixColor(character)
                                        ?
                                        <>
                                            <AsyncImage src={getCharacterSrc( character.data, character.hairCustomMix!.baseColor! )}
                                                        alt={'캐릭터'}
                                                        style={{
                                                            filter: idx === activeCharacterIdx ? 'drop-shadow(3px 3px 10px rgba(62, 151, 224, .7))' : 'none',
                                                            width: '100%',
                                                            position: 'absolute'
                                                        }}
                                                        draggable={false}
                                                        loadingTip={'Loading...'}
                                            />
                                            <AsyncImage src={getCharacterSrc( character.data, character.hairCustomMix!.mixColor! )}
                                                        alt={'캐릭터'}
                                                        style={{
                                                            width: '100%',
                                                            position: 'absolute',
                                                            opacity: (BaseColorMax - character.hairCustomMix!.baseColorRatio!) / 100
                                                        }}
                                                        draggable={false}
                                                        loadingTip={'Loading...'}
                                                        displayEmptyOnLoading={true}
                                            />
                                        </>
                                        :
                                        <AsyncImage src={getCharacterSrc(character.data)}
                                                    alt={'캐릭터'}
                                                    style={{
                                                        filter: idx === activeCharacterIdx ? 'drop-shadow(3px 3px 10px rgba(62, 151, 224, .7))' : 'none',
                                                        width: '100%'
                                                    }}
                                                    draggable={false}
                                                    loadingTip={'Loading...'}
                                        />
                                }
                            </ImageWrapper>
                        </Rnd>
                    ))
                }
            </CharacterPlayGround>
            
            {/* 캐릭터 정보 & 커믹 */}
            <CharacterInfoWrapper theme={theme}>
                
                {/* 캐릭터 정보 */}
                <CharacterItemBox theme={theme}>
                    <CharacterItemHeader>
                        <FlexBox>
                            캐릭터 정보
                            <FlexBox margin={'0 0 0 auto'} gap={'.5rem'}>
                                <Button
                                    size={'small'}
                                    type={'primary'}
                                    onClick={() => doAction('COPY')}
                                >
                                    복사
                                </Button>
                                <CustomPopConfirm
                                    placement={'top'}
                                    title={'선택된 캐릭터를 초기화 하시겠습니까?'}
                                    onConfirm={() => doAction('RESET')}
                                >
                                    <Button type={'primary'} size={'small'} danger>초기화</Button>
                                </CustomPopConfirm>
                                <CustomPopConfirm
                                    placement={'top'}
                                    title={'선택된 캐릭터를 삭제 하시겠습니까?'}
                                    onConfirm={() => doAction('DELETE')}
                                >
                                    <Button type={'primary'} size={'small'} danger>삭제</Button>
                                </CustomPopConfirm>
                            </FlexBox>
                        </FlexBox>
                    </CharacterItemHeader>
                    
                    <CharacterItemList theme={theme}>
                        {
                            activeCharacter.data && activeCharacter.data.length > 0
                                ?
                                activeCharacter.data.map(item => (
                                    <CharacterItem theme={theme}key={item.key}>
                                        <List.Item>
                                            <List.Item.Meta
                                                avatar={
                                                    <FlexBox alignItems={'center'} justifyContent={'center'} height={'100%'}>
                                                        {
                                                            item.value.typeInfo.subCategory === 'Head'
                                                                ?
                                                                <img
                                                                    src={SkinDefault}
                                                                    style={{width: '30px'}}
                                                                    alt={'피부'}
                                                                />
                                                                :
                                                                <AsyncImage
                                                                    src={getItemIcon(region, version, item.value.id)}
                                                                    cache={{cacheName: cacheName}}
                                                                    alt={item.value.name}
                                                                    style={{width: '30px'}}
                                                                />
                                                        }
                                                    </FlexBox>
                                                }
                                                title={item.value.name}
                                                description={getDescriptionByKey(item.key)}
                                            />
                                            <Button
                                                size={'small'}
                                                shape={'circle'}
                                                type={'primary'}
                                                danger
                                                onClick={() => doAction('DELETE_ITEM', item.key)}
                                            >
                                                <CloseOutlined/>
                                            </Button>
                                        </List.Item>
                                    </CharacterItem>
                                ))
                                :
                                <Empty
                                    style={{ marginTop: '5rem' }}
                                    description={'선택된 아이템이 없습니다.'}
                                />
                        }
                    </CharacterItemList>
                    
                </CharacterItemBox>
                
                {/* 커믹 */}
                {
                    activeCharacter.data.some(item => item.value.typeInfo.subCategory === 'Hair')
                        ?
                        <CustomMixBoxWrapper theme={theme}>
                            <Title
                                level={5}
                                style={{ textAlign: 'center' }}
                            >
                                커스텀 믹스염색
                            </Title>
                            <CustomMixBox>
                                
                                {/* 베이스 컬러 */}
                                <Card
                                    title={'베이스 컬러'}
                                    size={'small'}
                                    headStyle={{ textAlign: 'center' }}
                                    style={{ width: '40%' }}
                                    type={'inner'}
                                >
                                    <CustomMixColorBox>
                                        {
                                            Object.keys(SortedColorInfo).map((key: string, idx: number) => {
                                                const ciType: ColorInfoType = ColorInfo[key as Color];
                                                return (
                                                    <CustomMixColorWrapper key={key}>
                                                        <Tooltip placement={ idx % 2 === 0 ? 'left' : 'right' } title={ ciType.kor }>
                                                            <CustomMixColor
                                                                color={ ciType.hex }
                                                                onClick={() => doAction('HAIR_CUSTOM_MIX_SET_COLOR', 'BASE', key as Color)}
                                                            >
                                                                {
                                                                    isHairCustomMixMatch("BASE", key as Color)
                                                                        ?
                                                                        <CheckOutlined style={{ color: '#ffffff' }} />
                                                                        :
                                                                        <></>
                                                                }
                                                            </CustomMixColor>
                                                        </Tooltip>
                                                    </CustomMixColorWrapper>
                                                
                                                )
                                            })
                                        }
                                    </CustomMixColorBox>
                                </Card>
                                
                                {/* 믹스 컬러 */}
                                <Card
                                    title={'믹스 컬러'}
                                    size={'small'}
                                    headStyle={{ textAlign: 'center' }}
                                    style={{ width: '40%' }}
                                    type={'inner'}
                                >
                                    <CustomMixColorBox>
                                        {
                                            Object.keys(SortedColorInfo).map((key: string, idx: number) => {
                                                const ciType: ColorInfoType = ColorInfo[key as Color];
                                                return (
                                                    <CustomMixColorWrapper key={key}>
                                                        <Tooltip placement={ idx % 2 === 0 ? 'left' : 'right' } title={ ciType.kor }>
                                                            
                                                            <CustomMixColor
                                                                color={ ciType.hex }
                                                                onClick={() => doAction('HAIR_CUSTOM_MIX_SET_COLOR', 'MIX', key as Color)}
                                                            >
                                                                {
                                                                    isHairCustomMixMatch("MIX", key as Color)
                                                                        ?
                                                                        <CheckOutlined style={{ color: '#ffffff' }} />
                                                                        :
                                                                        <></>
                                                                }
                                                            </CustomMixColor>
                                                        </Tooltip>
                                                    </CustomMixColorWrapper>
                                                
                                                )
                                            })
                                        }
                                    </CustomMixColorBox>
                                </Card>
                            
                            </CustomMixBox>
                            
                            {
                                activeCharacter.hairCustomMix && activeCharacter.hairCustomMix.baseColorRatio
                                    ?
                                    <>
                                        <CustomMixColorInputBox>
                                            <InputNumber
                                                size="small"
                                                min={BaseColorMin}
                                                max={BaseColorMax}
                                                value={activeCharacter.hairCustomMix.baseColorRatio}
                                                onChange={(value) => doAction('HAIR_CUSTOM_MIX_BASE_COLOR_RATIO', value)}
                                            />
                                            <InputNumber
                                                size="small"
                                                min={BaseColorMin}
                                                max={BaseColorMax}
                                                value={BaseColorMax - activeCharacter.hairCustomMix.baseColorRatio}
                                                onChange={(value) => doAction('HAIR_CUSTOM_MIX_BASE_COLOR_RATIO', value ? BaseColorMax - value : null)}
                                            />
                                        </CustomMixColorInputBox>
                                        <Slider
                                            min={BaseColorMin}
                                            max={BaseColorMax}
                                            onChange={(value) => doAction('HAIR_CUSTOM_MIX_BASE_COLOR_RATIO', value)}
                                            value={activeCharacter.hairCustomMix.baseColorRatio}
                                        />
                                        <CustomPopConfirm
                                            placement={'top'}
                                            title={'커스텀 믹스염색을 초기화 하시겠습니까?'}
                                            onConfirm={() => doAction('RESET_HAIR_CUSTOM_MIX')}
                                        >
                                            <Button type={'primary'} size={'middle'} style={{ width: '100%' }}>초기화</Button>
                                        </CustomPopConfirm>
                                    </>
                                    :
                                    <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                                        <Alert message="컬러를 선택해주세요." type="info" />
                                    </div>
                            }
                        
                        </CustomMixBoxWrapper>
                        :
                        <></>
                }
            </CharacterInfoWrapper>
            
            {/* 캐릭 추가 버튼 */}
            <Button
                type="primary"
                shape="circle"
                icon={<PlusOutlined/>}
                onClick={() => doAction('ADD')}
                style={{
                    width: '64px',
                    height: '64px',
                    position: 'absolute',
                    bottom: 15,
                    left: 20
                }}
            />
		</Container>
	)
}

export default Characters
