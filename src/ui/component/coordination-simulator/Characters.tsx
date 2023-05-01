import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import {Button, List} from 'antd';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import {CloseOutlined, PlusOutlined} from '@ant-design/icons';
import {getCharacter} from '../../../api/maplestory-io.api';
import AsyncCacheImage from '../common/element/AsyncCacheImage';
import {cacheName, region, version} from '../../../model/maplestory-io.model';
import AsyncImage from '../common/element/AsyncImage';
import {equipmentSubCategoryInfo} from '../../../model/equipment.model';
import {FlexBox} from '../common/element/FlexBox';

const Container = styled.div`
	border: 1px solid white;
	width: 100%;
	height: 100%;
`

const ImageWrapper = styled.div`
	position: absolute;
	cursor: move;
	display: flex;
	justify-content: center;
	align-content: center;
	z-index: 999;
`

// https://codepen.io/jkasun/pen/QrLjXP
// const ResizableDiv = () => {
// 	const [width, setWidth] = useState(200);
// 	const [height, setHeight] = useState(200);
// 	const [dragging, setDragging] = useState(false);
// 	const [initialX, setInitialX] = useState(0);
// 	const [initialY, setInitialY] = useState(0);
// 	const ref = useRef(null);
//
// 	useEffect(() => {
// 		if (dragging) {
// 			function handleMouseMove(event) {
// 				const deltaX = event.clientX - initialX;
// 				const deltaY = event.clientY - initialY;
// 				setWidth((prevWidth) => prevWidth + deltaX);
// 				setHeight((prevHeight) => prevHeight + deltaY);
// 				setInitialX(event.clientX);
// 				setInitialY(event.clientY);
// 			}
//
// 			function handleMouseUp() {
// 				setDragging(false);
// 			}
//
// 			document.addEventListener("mousemove", handleMouseMove);
// 			document.addEventListener("mouseup", handleMouseUp);
//
// 			return () => {
// 				document.removeEventListener("mousemove", handleMouseMove);
// 				document.removeEventListener("mouseup", handleMouseUp);
// 			};
// 		}
// 	}, [dragging, initialX, initialY]);
//
// 	function handleMouseDown(event) {
// 		setDragging(true);
// 		setInitialX(event.clientX);
// 		setInitialY(event.clientY);
// 	}
//
// 	return (
// 		<div
// 			ref={ref}
// 			style={{ width: `${width}px`, height: `${height}px`, border: "1px solid black", position: "relative", minHeight:'300px', backgroundColor: 'red', minWidth: '300px', maxHeight: '600px', maxWidth: '600px' }}
// 		>
// 			<div
// 				style={{
// 					position: "absolute",
// 					bottom: 0,
// 					right: 0,
// 					width: "10px",
// 					height: "10px",
// 					border: "1px solid black",
// 					backgroundColor: "white",
// 					cursor: "se-resize",
// 				}}
// 				onMouseDown={handleMouseDown}
// 			/>
// 		</div>
// 	);
// }

const Characters = (
	{
		characters,
		setActiveCharacterIdx,
		activeCharacterIdx,
		addCharacter,
		deleteCharacter
	}:
		{
			characters: { key: string, value: any }[][],
			activeCharacterIdx: number,
			setActiveCharacterIdx: Dispatch<SetStateAction<number>>,
			addCharacter: () => void,
			deleteCharacter: () => void
		}
) => {
	
	const [isDragging, setIsDragging] = useState<boolean>(false);
	
	const getSrc = (character: { key: string, value: any }[]) => {
		const arr = character.map((item: any) => ({ itemId: item.value.id, region: region, version: version }))
		
		// 머리
		arr.push({ itemId: 12000, region: region, version: version });
		// 몸통
		arr.push({ itemId: 2000, region: region, version: version });
		
		const str = encodeURIComponent(JSON.stringify(arr).slice(1, -1));
		
		return getCharacter(str)
	}
	
	const eventControl = (event: { type: any }, info: any) => {
		if (event.type === 'mousemove' || event.type === 'touchmove') {
			setIsDragging(true)
		}
		
		if (event.type === 'mouseup' || event.type === 'touchend') {
			setTimeout(() => {
				setIsDragging(false);
			}, 100);
			
		}
	}
	
	return (
		<Container>
				{
					characters.map((character, idx) => (
						<Draggable
							bounds={'parent'}
							key={idx}
							onDrag={eventControl}
							onStop={eventControl}
						>
							<ImageWrapper onClick={() => isDragging ? undefined : setActiveCharacterIdx(idx)}>
								<AsyncImage src={getSrc(character)}
								     alt={'캐릭터'}
								     style={{
											 filter: idx === activeCharacterIdx ? 'drop-shadow(3px 3px 10px rgba(62, 151, 224, .7))' : 'none',
											}}
								     draggable={false}
						     />
							</ImageWrapper>
						</Draggable>
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
						<Button
							size={'small'}
							type={'primary'}
							style={{ marginLeft: 'auto' }}
							danger
							onClick={deleteCharacter}
						>
							삭제
						</Button>
					</FlexBox>
				}
				bordered
				dataSource={characters[activeCharacterIdx]}
				renderItem={item => (
					<List.Item>
						<List.Item.Meta
							title={item.value.name}
							description={equipmentSubCategoryInfo.find(info => info[1] === item.key)![2]}
						/>
						<Button
							size={'small'}
							type={'primary'}
							danger
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
