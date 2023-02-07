import {useEffect, useState} from 'react';
import {baseURL as mapleIOBaseURL} from '../api/maplestory-io.api';

interface Props {
	apiURL: (...args: any[]) => string
	filter?: (data: any) => any
	responseType?: 'SINGLE' | 'MULTIPLE'
	notFireOnInit?: boolean
}

const useMapleFetch = (props: Props) => {
	
	const region = 'KMST';
	const version = '1150';
	
	const cachePrefix = 'keencho-maplestory';
	const cacheName = `${cachePrefix}-${region}-${version}`;
	
	const [data, setData] = useState(!props.responseType || props.responseType === 'MULTIPLE' ? [] : undefined);
	const [error, setError] = useState<any>(undefined);
	const [loading, setLoading] = useState(false);
	
	const doProcess = async(...args: any[]) => {
		try {
			setLoading(true);
			
			const url = props.apiURL(region, version, args);
			let cachedData = await getCachedData(url);
			
			if (cachedData) {
				setData(cachedData);
				
				return;
			}
			
			const cacheStorage = await caches.open(cacheName);
			await cacheStorage.add(props.apiURL(region, version, args));
			
			cachedData = await getCachedData(url);
			
			await deleteOldCache()
			
			setData(cachedData);
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	}
	
	const deleteOldCache = async() => {
		const keys = await caches.keys();
		
		for (const key of keys) {
			const isOurCache = key.startsWith(cachePrefix);
			
			if (cacheName === key || !isOurCache) {
				continue;
			}
			
			caches.delete(key);
		}
	}
	
	const getCachedData = async (url: string) => {
		// TODO: expiration period 리서치
		const cacheStorage = await caches.open(cacheName);
		const cachedRes = await cacheStorage.match(url);
		
		if (!cachedRes || !cachedRes.ok) {
			return undefined;
		}
		
		let data = await cachedRes.json();
		
		if (props.filter) {
			data = props.filter(data);
		}
		
		return data;
	}
	
	useEffect(() => {
		if (props.notFireOnInit !== true) {
			doProcess();
		}
	}, [])
	
	return [ data, error, loading, doProcess ];
}

export default useMapleFetch
