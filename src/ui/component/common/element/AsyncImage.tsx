import React, {useEffect, useState} from 'react';
import {Empty, Spin} from 'antd';
import {doCacheFetch, doFetch} from "../../../../util/fetch.util";

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
			const fetch = useCache
				? doCacheFetch(props.src, props.cache!.cacheName)
				: doFetch(props.src, 'IMG')

			fetch.then(setLoadedSrc)
		}
		
	}, [props.src]);
	
	if (loadedSrc) {
		return <img src={loadedSrc} alt={props.alt} style={props.style} draggable={props.draggable} />;
	}
	
	return <Spin size={'small'} tip={props.loadingTip} />;
};

export default AsyncImage
