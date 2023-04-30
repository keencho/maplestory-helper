import React, {Dispatch, SetStateAction, useEffect, useRef, useState} from 'react';
import {Button} from 'antd';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import {PlusOutlined} from '@ant-design/icons';
import {getCharacter} from '../../../api/maplestory-io.api';
import AsyncCacheImage from '../common/element/AsyncCacheImage';
import {cacheName, region, version} from '../../../model/maplestory-io.model';

const Container = styled.div`
	border: 1px solid white;
	width: 100%;
	height: 100%;
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
		addCharacter
	}:
		{
			characters: { key: string, value: any }[][],
			setActiveCharacterIdx: Dispatch<SetStateAction<number>>,
			addCharacter: () => void
		}
) => {
	
	const getSrc = (character: { key: string, value: any }[]) => {
		const arr = character.map((item: any) => {
			if (!item.hasOwnProperty('key')) {
				return item;
			}
			
			return { itemId: item.value.id, region: region, version: version }
		})
		
		// console.log(arr)
		
		const str = encodeURIComponent(JSON.stringify(arr).slice(1, -1));
		
		return getCharacter(str)
	}
	
	return (
		<Container>
				{
					characters.map((character, idx) => (
						<Draggable bounds={'parent'} key={idx}>
							<div
								style={{ border: '1px solid red', position: 'absolute', cursor: 'move' }}
								onClick={() => setActiveCharacterIdx(idx)}
							>
								<img src={getSrc(character)}
								     alt={'캐릭터'}
								     style={{ minWidth: '100px', minHeight: '158px' }}
								     draggable={false}
						     />
							</div>
						</Draggable>
					))
				}
				{/*<div*/}
				{/*	style={{ border: '1px solid red', position: 'absolute', cursor: 'move' }}*/}
				{/*>*/}
					{/*<img src={characterSrc}*/}
					{/*     alt={'캐릭터'}*/}
					{/*     style={{ minWidth: '100px', minHeight: '158px' }}*/}
					{/*     draggable={false}*/}
					{/*/>*/}
					{/*<div>*/}
					{/*	{*/}
					{/*		selectedItems.map((item) => (*/}
					{/*			<div key={item.key}>*/}
					{/*				{item.value.name}*/}
					{/*				<Button*/}
					{/*					size={'small'}*/}
					{/*					type={'primary'}*/}
					{/*					onClick={() => onClickDeleteItem(item.key)}*/}
					{/*					danger*/}
					{/*				>*/}
					{/*					삭제*/}
					{/*				</Button>*/}
					{/*			</div>*/}
					{/*		))*/}
					{/*	}*/}
					{/*</div>*/}
				{/*</div>*/}
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
					right: 20
			}} />
		</Container>
	)
}

export default Characters
