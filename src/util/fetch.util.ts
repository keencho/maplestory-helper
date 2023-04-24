export const cachePrefix = 'keencho-maplestory';

const getCacheName = (name: string) => `${cachePrefix}-${name}`;

// 예외처리는 각각의 서비스 / 훅에서 진행하도록
export const doCacheFetch = async(url: string, cacheName: string): Promise<any> => {
	const confirmedCacheName = getCacheName(cacheName);
	
	const cacheStorage = await caches.open(confirmedCacheName);
	let cachedRes = await cacheStorage.match(url);
	
	// 만약 캐시된 데이터가 3일이 지났으면 다시 불러온다.
	if (cachedRes && cachedRes.ok) {
		const cachedTime = cachedRes.headers.get('date') || cachedRes.headers.get('last-modified');
		
		if (cachedTime) {
			const contentType = cachedRes.headers.get('content-type');
			const diff = Number(new Date()) - Number(new Date(cachedTime));
			const diffDay = Math.floor(diff / 86400000);
			
			// 이미지는 7일
			if (contentType?.includes('image')) {
				if (diffDay > 7) {
					cachedRes = undefined;
				}	
			}
			
			// json은 3일
			else {
				if (diffDay > 3) {
					cachedRes = undefined;
				}
			}
		}
	}
	
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
