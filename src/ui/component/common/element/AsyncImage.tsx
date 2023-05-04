import React, {useEffect, useState} from 'react';
import {Spin} from 'antd';
import {doCacheFetch} from "../../../../util/fetch.util";

interface Props {
	src: string
	alt?: string
	style?: React.CSSProperties
	draggable?: boolean
	loadingTip?: React.ReactNode
	cache?: {
		cacheName: string
	}
}

const AsyncImage = (props: Props) => {
	const useCache = props.cache !== undefined && props.cache.cacheName.length > 0;
	const [loadedSrc, setLoadedSrc] = useState<string>('');
	
	useEffect(() => {
		setLoadedSrc('');
		
		if (props.src) {
			if (useCache === true) {
				doCacheFetch(props.src, props.cache!.cacheName).then(setLoadedSrc)
			} else {
				fetch(props.src).then(res => res.blob()).then(src => setLoadedSrc(URL.createObjectURL(src)))
			}
		}
		
	}, [props.src]);
	
	if (loadedSrc) {
		return <img src={loadedSrc} alt={props.alt} style={props.style} draggable={props.draggable} />;
	}
	
	return <Spin size={'small'} tip={props.loadingTip} />;
};

export default AsyncImage
