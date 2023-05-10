import DateTimeUtils from './date-time.util';

export const cachePrefix = 'keencho-maplestory';

const getCacheName = (name: string) => `${cachePrefix}-${name}`;

const cachedTimeKey = 'cached-time';

// 예외처리는 각각의 서비스 / 훅에서 진행하도록
export const doCacheFetch = async(url: string, cacheName: string): Promise<any> => {
	const confirmedCacheName = getCacheName(cacheName);
	
	const cacheStorage = await caches.open(confirmedCacheName);
	let cachedRes = await cacheStorage.match(url);
	
	if (cachedRes && cachedRes.ok) {
		const cachedTime = cachedRes.headers.get(cachedTimeKey);

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
	
	// 캐시 스토리지에 값이 없다면 새롭게 fetch 한다.
	if (!cachedRes || !cachedRes.ok) {
		const res = await fetch(url);
		const newHeaders = new Headers(res.headers);
		newHeaders.set(cachedTimeKey, DateTimeUtils.getNow());
		const newResponse = new Response(res.body, { headers: newHeaders });
		
		await cacheStorage.put(url, newResponse.clone());
		
		cachedRes = await doCacheFetch(url, cacheName);
		
		deleteOldCache(cacheName);
		
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
		const isMyCache = key.startsWith(cachePrefix);
		
		if (confirmedCacheName === key || !isMyCache) {
			continue;
		}
		
		caches.delete(key);
	}
}

export const doFetch = async(url: string, type: 'JSON' | 'IMG' = 'JSON') => {
	const res = await fetch(url);

	let data;
	if (type === 'JSON') {
		data = await res.json()
	} else {
		data = await res.blob();
		data = URL.createObjectURL(data);
	}

	return data;
}
