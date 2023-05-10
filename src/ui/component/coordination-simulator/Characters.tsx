import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import {Button, Card, List, Tooltip} from 'antd';
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
    CharactersModel,
    Color,
    ColorInfo,
    ColorInfoType, SortedColorInfo
} from '../../../model/coordination-simulator.model';
import CustomPopConfirm from '../common/element/CustomPopConfirm';
import {ResetButton} from "../common/element/ResetButton";
import NotificationUtil from "../../../util/notification.util";
import {useRecoilValue} from "recoil";
import {ThemeAtom} from "../../../recoil/theme.atom";

const Container = styled.div`
	width: 100%;
	height: 100%;
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

const CharacterInfoBox = styled.div`
	position: absolute;
    bottom: 15px;
    right: 20px;
    display: flex;
    flex-direction: row;
    gap: 1rem;
`

const CustomMixBoxWrapper = styled.div<{ theme: 'light' | 'dark' }>`
    border: 1px solid ${props => BORDER(props.theme)};
    padding: .5rem 1rem;
`

const CustomMixBox = styled.div`
    display: flex;
    flex-direction: row;
    gap: 1rem;
`

const CustomMixColorBox = styled.div`
    display: flex;
    flex-wrap: wrap;
    row-gap: .5rem;
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
	const containerRef = useRef(null)
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [refLoaded, setRefLoaded] = useState<boolean>(false);
	
	const getCharacterSrc = (character: { key: EquipmentSubCategory, value: any }[]) => {
		let arr = character.map((item: any) => (item.value.id))
		
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
		
		arr = arr.map(id => ({itemId: id, region: region, version: version}));
		
		const str = encodeURIComponent(JSON.stringify(arr).slice(1, -1));
		
		return getCharacter(str)
	}
	
	const dragControl = (event: DraggableEvent, data: DraggableData, ...args: any) => {
		if (event.type === 'mousemove') {
			setIsDragging(true)
		}
		
		if (event.type === 'mouseup') {
			setTimeout(() => {
				if (args && args.length > 0) {
					doAction('HANDLE_POSITION', {x: data.x, y: data.y, key: args[0]})
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
        
        const character = characters[activeCharacterIdx];
        
        if (!character.hairCustomMix) return false;
        
        const key = type === 'BASE' ? 'baseColor' : 'mixColor';
        
        if (!character.hairCustomMix[key]) return false;
        
        if (character.hairCustomMix[key] !== color) return false;
        
        return true;
    }
	
	useEffect(() => {
		if (containerRef.current) {
			setRefLoaded(true)
		}
	}, [containerRef])
	
	return (
		<Container ref={containerRef}>
			{
				refLoaded && characters.map((character, idx) => (
					<Rnd
						key={character.key}
						default={{
							x: character.x,
							y: character.y,
							width: character.width,
							height: character.height,
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
						onDragStart={dragControl}
						onDragStop={(e, data) => dragControl(e, data, character.key)}
						onDrag={dragControl}
						minWidth={45}
						minHeight={70}
						maxWidth={135}
						maxHeight={210}
						style={{
							zIndex: 999
						}}
					>
						<ImageWrapper onClick={() => isDragging ? undefined : setActiveCharacterIdx(idx)}>
							<AsyncImage src={getCharacterSrc(character.data)}
							            alt={'캐릭터'}
							            style={{
								            filter: idx === activeCharacterIdx ? 'drop-shadow(3px 3px 10px rgba(62, 151, 224, .7))' : 'none',
								            width: '100%'
							            }}
							            draggable={false}
							            loadingTip={'Loading...'}
							/>
						</ImageWrapper>
					</Rnd>
				))
			}
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
            <CharacterInfoBox>
                {
                    characters[activeCharacterIdx].data.some(item => item.value.typeInfo.subCategory === 'Hair')
                    ?
                        <CustomMixBoxWrapper theme={theme}>
                            <CustomMixBox>
                                
                                {/* 베이스 컬러 */}
                                <Card
                                    title={'베이스 컬러'}
                                    size={'small'}
                                    headStyle={{ textAlign: 'center' }}
                                    style={{ width: '100px' }}
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
                                    style={{ width: '100px' }}
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
                        </CustomMixBoxWrapper>
                    :
                        <></>
                }
                <List
                    size="small"
                    header={
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
                    }
                    bordered
                    dataSource={characters[activeCharacterIdx].data}
                    renderItem={item => (
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
                        </List.Item>)
                    }
                    style={{
                        maxHeight: '300px',
                        minWidth: '325px',
                        maxWidth: '325px',
                        overflowY: 'scroll'
                    }}
                />
            </CharacterInfoBox>
		</Container>
	)
}

export default Characters
