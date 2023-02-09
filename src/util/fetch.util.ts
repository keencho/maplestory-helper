export const cachePrefix = 'keencho-maplestory';

const getCacheName = (name: string) => `${cachePrefix}-${name}`;

// 예외처리는 각각의 서비스 / 훅에서 진행하도록
export const doCacheFetch = async(url: string, cacheName: string): Promise<any> => {
	const confirmedCacheName = getCacheName(cacheName);
	
	// TODO: expiration period 리서치
	const cacheStorage = await caches.open(confirmedCacheName);
	let cachedRes = await cacheStorage.match(url);
	
	if (!cachedRes || !cachedRes.ok) {
		await cacheStorage.add(url);
		
		cachedRes = await doCacheFetch(url, cacheName);
		
		await deleteOldCache(cacheName);
		
		return cachedRes;
	}
	
	const contentType = cachedRes.headers.get('content-type');
	
	let data;
	if (contentType?.includes('image')) {
		data = URL.createObjectURL(await cachedRes.blob());
	} else {
		data = await cachedRes.json();
	}
	
	return data;
}

const deleteOldCache = async(cacheName: string) => {
	const confirmedCacheName = getCacheName(cacheName);
	const keys = await caches.keys();
	
	for (const key of keys) {
		const isOurCache = key.startsWith(cachePrefix);
		
		if (confirmedCacheName === key || !isOurCache) {
			continue;
		}
		
		caches.delete(key);
	}
}
