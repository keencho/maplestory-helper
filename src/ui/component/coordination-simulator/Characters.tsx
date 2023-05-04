import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import {Button, List} from 'antd';
import styled from 'styled-components';
import {CloseOutlined, PlusOutlined} from '@ant-design/icons';
import {getCharacter, getItemIcon} from '../../../api/maplestory-io.api';
import {cacheName, region, version} from '../../../model/maplestory-io.model';
import {equipmentSubCategoryInfo} from '../../../model/equipment.model';
import {FlexBox} from '../common/element/FlexBox';
import {Rnd} from "react-rnd";
import AsyncImage from "../common/element/AsyncImage";
import {BLUE} from "../../../model/color.model";

const Container = styled.div`
	width: 100%;
	height: 100%;
`

const ImageWrapper = styled.div`
	position: absolute;
	cursor: move;
	display: flex;
	justify-content: center;
	align-content: center;
`

const Characters = (
	{
		characters,
		setActiveCharacterIdx,
		activeCharacterIdx,
		addCharacter,
		deleteCharacter,
		resetCharacter,
		deleteItem
	}:
		{
			characters: { key: string, data: { key: string, value: any }[] }[],
			activeCharacterIdx: number,
			setActiveCharacterIdx: Dispatch<SetStateAction<number>>,
			addCharacter: () => void,
			deleteCharacter: () => void,
			resetCharacter: () => void,
			deleteItem: (key: string) => void
		}
) => {
	
	const containerRef = useRef(null)
	const [isDragging, setIsDragging] = useState<boolean>(false);
	const [refLoaded, setRefLoaded] = useState<boolean>(false);
	
	const getCharacterSrc = (character: { key: string, value: any }[]) => {
		const arr = character.map((item: any) => ({ itemId: item.value.id, region: region, version: version }))
		
		// 머리
		arr.push({ itemId: 12000, region: region, version: version });
		// 몸통
		arr.push({ itemId: 2000, region: region, version: version });
		
		const str = encodeURIComponent(JSON.stringify(arr).slice(1, -1));
		
		return getCharacter(str)
	}
	
	const eventControl = (event: { type: any }) => {
		if (event.type === 'mousemove') {
			setIsDragging(true)
		}

		if (event.type === 'mouseup') {
			setTimeout(() => {
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
	
	const getPosition = (idx: number): { x: number, y: number } => {
		const current: any = containerRef.current;
		
		if (current) {
			// const width = current.offsetWidth;
			const height = current.offsetHeight;
			
			return { x: 30 + (idx * 50), y: height / 2.5 }
		}
		return { x: 0, y: 0 }
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
						default={{
							x: 0,
							y: 0,
							width: 45,
							height: 70,
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
						onDragStart={eventControl}
						onDragStop={eventControl}
						onDrag={eventControl}
						minWidth={45}
						minHeight={70}
						maxWidth={135}
						maxHeight={210}
						style={{ zIndex: 999 }}
					>
						<ImageWrapper onClick={() => isDragging ? undefined : setActiveCharacterIdx(idx)} style={{ width: '100%', height: '100%' }}>
							<AsyncImage src={getCharacterSrc(character.data)}
										alt={'캐릭터'}
										style={{ filter: idx === activeCharacterIdx ? 'drop-shadow(3px 3px 10px rgba(62, 151, 224, .7))' : 'none' }}
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
				onClick={addCharacter}
				style={{
					width: '64px',
					height: '64px',
					position: 'absolute',
					bottom: 15,
					left: 20
			}} />
			<List
				size="small"
				header={
					<FlexBox>
						캐릭터 정보
						<div style={{ marginLeft: 'auto' }}>
							<Button
								size={'small'}
								type={'primary'}
								danger
								onClick={resetCharacter}
							>
								초기화
							</Button>
							<Button
								size={'small'}
								type={'primary'}
								style={{ marginLeft: '.5rem' }}
								danger
								onClick={deleteCharacter}
							>
								삭제
							</Button>
						</div>
					</FlexBox>
				}
				bordered
				dataSource={characters[activeCharacterIdx].data}
				renderItem={item => (
					<List.Item>
						<List.Item.Meta
							avatar={
								<FlexBox alignItems={'center'} justifyContent={'center'} height={'100%'}>
									<AsyncImage
										src={getItemIcon(region, version, item.value.id)}
										cache={{ cacheName: cacheName }}
										alt={item.value.name}
										style={{ width: '30px' }}
									/>
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
							onClick={() => deleteItem(item.key)}
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
					minWidth: '250px',
					maxWidth: '250px',
					overflowY: 'scroll'
				}}
			/>
		</Container>
	)
}

export default Characters
