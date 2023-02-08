import {cacheName, region, version} from '../model/maplestory-io.model';
import useCacheFetch from './useCacheFetch';

interface Props {
	apiURL: (...args: any[]) => string
	filter?: (data: any) => any
}

const useMapleFetch = (props: Props) => {
	const [data, error, loading, doProcess] = useCacheFetch({
		apiURL: (...args: any[]) => props.apiURL(region, version, args),
		filter: props.filter,
		cacheName: cacheName
	})
	
	return [ data, error, loading, doProcess ];
}

export default useMapleFetch
