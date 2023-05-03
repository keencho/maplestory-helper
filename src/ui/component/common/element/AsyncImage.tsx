import React, {useEffect, useState} from 'react';
import {Spin} from 'antd';

const AsyncImage = (props: { src: string, alt?: string, style?: React.CSSProperties, draggable?: boolean }) => {
	const [loadedSrc, setLoadedSrc] = useState<string>('');
	
	useEffect(() => {
		setLoadedSrc('');
		
		if (props.src) {
			fetch(props.src).then(res => res.blob()).then(src => setLoadedSrc(URL.createObjectURL(src)))
		}
		
	}, [props.src]);
	
	if (loadedSrc) {
		return <img src={loadedSrc} alt={props.alt} style={props.style} draggable={props.draggable} />;
	}
	
	return <Spin size={'large'} tip={'로딩중...'} />;
};

export default AsyncImage
