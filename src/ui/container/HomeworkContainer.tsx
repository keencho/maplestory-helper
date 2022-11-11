import {Col, Row} from 'antd';
import React, {useEffect} from 'react';
import DateTimeUtils from '../../util/DateTimeUtils';
import HomeworkTable from '../component/HomeworkTable';
import styled from 'styled-components';

const Divider = styled.div`
	height: 16px;
`

const HomeworkContainer = () => {
	
	const getFileName = (path: string) => {
		const split = path.split('/');
		return split[split.length - 1];
	}
	
	const symbolData = Object.keys(import.meta.glob('../../assets/icon/symbol/*.png', { eager: true }))
		.sort((a, b) => {
			const aIdx = Number(getFileName(a).split('-')[0]);
			const bIdx = Number(getFileName(b).split('-')[0]);
			
			return aIdx > bIdx ? 1 : -1;
		})
		.map((path: string) => {
			const fileName = getFileName(path);
			
			return {
				src: new URL(path, import.meta.url).href,
				name: fileName.split('.')[0].split('-')[1]
			}
	})

	return (
		<>
			<h1>
				숙제표
			</h1>
			<Row>
				<Col span={9}>
					{DateTimeUtils.getTodayDate()}
				</Col>
				<Col span={15}>
					<HomeworkTable title={'심볼 일퀘'} data={symbolData} />
					<Divider />
					<HomeworkTable title={'심볼 일퀘'} data={symbolData} />
				</Col>
			</Row>
		</>
	)
}

export default HomeworkContainer
