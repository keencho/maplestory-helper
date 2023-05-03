import React, {useEffect, useState} from 'react';
import {doCacheFetch} from '../../../../util/fetch.util';

const AsyncCacheImage = (props: { src: string, cacheName: string, alt?: string, style?: React.CSSProperties, draggable?: boolean }) => {
	const [loadedSrc, setLoadedSrc] = useState<string>('');
	
	useEffect(() => {
		setLoadedSrc('');
		
		if (props.src) {
			doCacheFetch(props.src, props.cacheName).then(res => setLoadedSrc(res))
		}
		
	}, [props.src]);
	
	if (loadedSrc) {
		return (
			<img src={loadedSrc} alt={props.alt} style={props.style} draggable={props.draggable} />
		);
	}
	
	return <></>;
};

export default AsyncCacheImage
