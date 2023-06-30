import React, {useEffect, useState} from 'react';
import {Spin} from 'antd';
import {doCacheFetch, doFetch} from "../../../../util/fetch.util";
import {ExclamationCircleOutlined} from '@ant-design/icons';

interface Props {
	src: string
	alt?: string
	style?: React.CSSProperties
	draggable?: boolean
	loadingTip?: React.ReactNode
	cache?: {
		cacheName: string
	}
    displayEmptyOnLoading?: boolean
}

const AsyncImage = (props: Props) => {
	const useCache = props.cache !== undefined && props.cache.cacheName.length > 0;
	const [loadedSrc, setLoadedSrc] = useState<string>('');
	const [error, setError] = useState<boolean>(false)
	
	useEffect(() => {
		setLoadedSrc('');

		if (props.src) {
			const fetch = useCache
				? doCacheFetch(props.src, props.cache!.cacheName)
				: doFetch(props.src, 'IMG')

			fetch
				.then(setLoadedSrc)
				.catch(() => setError(true))
		}
		
	}, [props.src]);
	
	if (error) {
		return <ExclamationCircleOutlined />
	}
	
	if (!loadedSrc) {
        if (props.displayEmptyOnLoading === true) {
            return <></>
        } else {
            return (
                <Spin size={'small'} tip={props.loadingTip}>
                    <div/>
                </Spin>
            )
        }
	}
	
	return <img src={loadedSrc} alt={props.alt} style={props.style} draggable={props.draggable} />
};

export default AsyncImage
