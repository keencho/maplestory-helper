import PageTitle from '../component/common/PageTitle';
import React, {useEffect} from 'react';
import useMapleFetch from '../../hooks/useMapleFetch';
import {getAllItems} from '../../api/maplestory-io.api';

const CoordinationSimulatorContainer = () => {
	const [items, errors, isLoading] = useMapleFetch({
		apiURL: getAllItems,
		filter: (data: any) => data
			.filter((item: any) => item.name && item.requiredLevel)
			.filter(function(this: any, item: any) {
				return !this.has(item.name) && this.add(item.name)
			}, new Set)
	});
	
	useEffect(() => {
		// console.log(items);
	}, [items])
	
	return (
		<>
			<PageTitle
				title={'코디 시뮬레이터'}
				marginBottom={'.5rem'}
			/>
			어떻게 해볼까..
		</>
	)
}

export default CoordinationSimulatorContainer
