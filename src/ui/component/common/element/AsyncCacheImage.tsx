import React, {useEffect, useState} from 'react';
import {doCacheFetch} from '../../../../util/fetch.util';

const AsyncCacheImage = (props: { src: string, cacheName: string, alt?: string, style?: React.CSSProperties }) => {
	const [loadedSrc, setLoadedSrc] = useState<string>('');
	
	useEffect(() => {
		setLoadedSrc('');
		
		if (props.src) {
			doCacheFetch(props.src, props.cacheName).then(res => setLoadedSrc(res))
		}
		
	}, [props.src]);
	
	if (loadedSrc) {
		return (
			<img {...props} />
		);
	}
	
	return <></>;
};

export default AsyncCacheImage
