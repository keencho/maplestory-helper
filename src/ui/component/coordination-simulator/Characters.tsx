import React, {useEffect, useRef, useState} from 'react';
import {Button} from 'antd';
import styled from 'styled-components';
import Draggable from 'react-draggable';
import {PlusOutlined} from '@ant-design/icons';

const Container = styled.div`
	border: 1px solid white;
	width: 100%;
	height: 100%;
`

// https://codepen.io/jkasun/pen/QrLjXP
const ResizableDiv = () => {
	const [width, setWidth] = useState(200);
	const [height, setHeight] = useState(200);
	const [dragging, setDragging] = useState(false);
	const [initialX, setInitialX] = useState(0);
	const [initialY, setInitialY] = useState(0);
	const ref = useRef(null);
	
	useEffect(() => {
		if (dragging) {
			function handleMouseMove(event) {
				const deltaX = event.clientX - initialX;
				const deltaY = event.clientY - initialY;
				setWidth((prevWidth) => prevWidth + deltaX);
				setHeight((prevHeight) => prevHeight + deltaY);
				setInitialX(event.clientX);
				setInitialY(event.clientY);
			}
			
			function handleMouseUp() {
				setDragging(false);
			}
			
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);
			
			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};
		}
	}, [dragging, initialX, initialY]);
	
	function handleMouseDown(event) {
		setDragging(true);
		setInitialX(event.clientX);
		setInitialY(event.clientY);
	}
	
	return (
		<div
			ref={ref}
			style={{ width: `${width}px`, height: `${height}px`, border: "1px solid black", position: "relative", minHeight:'300px', backgroundColor: 'red', minWidth: '300px', maxHeight: '600px', maxWidth: '600px' }}
		>
			<div
				style={{
					position: "absolute",
					bottom: 0,
					right: 0,
					width: "10px",
					height: "10px",
					border: "1px solid black",
					backgroundColor: "white",
					cursor: "se-resize",
				}}
				onMouseDown={handleMouseDown}
			/>
		</div>
	);
}

const Characters = ({ selectedItems, characterSrc, onClickDeleteItem }: { selectedItems: any[], characterSrc: string, onClickDeleteItem: (key: string) => void }) => {
	return (
		<Container>
			<Draggable bounds={'parent'}>
				<div
					style={{ width: '500px', border: '1px solid red', position: 'absolute', cursor: 'move' }}
				>
					<ResizableDiv />
					{/*<img src={characterSrc}*/}
					{/*     alt={'캐릭터'}*/}
					{/*     style={{ width: '100%', height: '100%' }}*/}
					{/*     draggable={false}*/}
					{/*/>*/}
				</div>
			</Draggable>
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
			{/*</Draggable>*/}
			<Button
				type="primary"
				shape="circle"
				icon={<PlusOutlined />}
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
