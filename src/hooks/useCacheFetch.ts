import {useEffect, useState} from 'react';
import {doCacheFetch} from '../util/fetch.util';

interface Props {
	apiURL: (...args: any[]) => string
	cacheName: string
	filter?: (data: any) => any
	notFetchOnInit?: boolean
	singleValue?: boolean
}

const useCacheFetch = (props: Props) => {
	const [data, setData] = useState(props.singleValue === true ? undefined : []);
	const [error, setError] = useState<any>(undefined);
	const [loading, setLoading] = useState(false);
	
	const doProcess = async(...args: any[]) => {
		try {
			setLoading(true);
			
			let data = await doCacheFetch(props.apiURL(args), props.cacheName);
			
			if (props.filter) {
				data = props.filter(data);
			}
			
			setData(data);
		} catch (err) {
			setError(err);
		} finally {
			setLoading(false);
		}
	}
	
	useEffect(() => {
		if (props.notFetchOnInit !== true) {
			doProcess();
		}
	}, [])
	
	return [data, error, loading, doProcess]
}

export default useCacheFetch
