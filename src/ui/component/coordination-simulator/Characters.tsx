import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import {Button, List} from 'antd';
import styled from 'styled-components';
import {CloseOutlined, PlusOutlined} from '@ant-design/icons';
import {getCharacter, getItemIcon} from '../../../api/maplestory-io.api';
import {cacheName, region, version} from '../../../model/maplestory-io.model';
import {EquipmentSubCategory, equipmentSubCategoryInfo} from '../../../model/equipment.model';
import {FlexBox} from '../common/element/FlexBox';
import {DraggableData, Rnd, RndDragEvent} from "react-rnd";
import AsyncImage from "../common/element/AsyncImage";
import {BLUE} from "../../../model/color.model";
import SkinDefault from '../../../assets/icon/items/skin_default.png';
import {DraggableEvent} from 'react-draggable';
import {ActionType, CharactersModel} from '../../../model/coordination-simulator.model';
import CustomPopConfirm from '../common/element/CustomPopConfirm';

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

		arr = arr.map(id => ( { itemId: id, region: region, version: version } ));

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
						onResizeStop={(e, dir, ref) => doAction('HANDLE_RESIZE', character.key, { width: ref.offsetWidth, height: ref.offsetHeight })}
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
										style={{ filter: idx === activeCharacterIdx ? 'drop-shadow(3px 3px 10px rgba(62, 151, 224, .7))' : 'none', width: '100%' }}
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
				icon={<PlusOutlined />}
				onClick={() => doAction('ADD')}
				style={{
					width: '64px',
					height: '64px',
					position: 'absolute',
					bottom: 15,
					left: 20
				}}
			/>
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
												style={{ width: '30px' }}
												alt={'피부'}
											/>
										:
											<AsyncImage
												src={getItemIcon(region, version, item.value.id)}
												cache={{ cacheName: cacheName }}
												alt={item.value.name}
												style={{ width: '30px' }}
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
							<CloseOutlined />
						</Button>
					</List.Item>)
				}
				style={{
					position: 'absolute',
					bottom: 15,
					right: 20,
					maxHeight: '300px',
					minWidth: '325px',
					maxWidth: '325px',
					overflowY: 'scroll'
				}}
			/>
		</Container>
	)
}

export default Characters
