import {Button, Col, Row} from 'antd';
import React, {useState} from 'react';
import {HomeworkTable} from '../component/HomeworkTable';
import styled from 'styled-components';
import Textarea from '../component/element/Textarea';

const Spacer = styled.div`
  height: 16px;
`

const MY_ROUTINE_KEY = 'MY_ROUTINE';

const HomeworkContainer = () => {
	
	const savedMyRoutine = localStorage.getItem(MY_ROUTINE_KEY);
	const [myRoutine, setMyRoutine] = useState<string>(savedMyRoutine === null ? '' : savedMyRoutine);
	
	const saveMyRoutine = () => {
		localStorage.setItem(MY_ROUTINE_KEY, myRoutine);
		alert('저장되었습니다.')
	}
	
	const resourcesMapper = (paths: string[]) => {
		
		const getFileName = (path: string) => {
			const split = path.split('/');
			return split[split.length - 1];
		}
		
		return paths
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
	}
	
	// import.meta.glob... 표현식은 glob 자리에 변수를 사용할 수 없음. 즉, 아래처럼 경로를 다이렉트로 지정해줘야함
	// resourceMapper 함수에 경로만 넘기는것 안된다는 의미임.
	const dailyHomework = resourcesMapper(Object.keys(import.meta.glob('../../assets/icon/homework/daily-homework/*.png', { eager: true })))
	const symbolData = resourcesMapper(Object.keys(import.meta.glob('../../assets/icon/homework/symbol/*.png', { eager: true })))
	const arcaneRiverData = resourcesMapper(Object.keys(import.meta.glob('../../assets/icon/homework/arcane-river/*.png', { eager: true })))
	const dailyBossData = resourcesMapper(Object.keys(import.meta.glob('../../assets/icon/homework/daily-boss/*.png', { eager: true })))
	const weeklyHomework = resourcesMapper(Object.keys(import.meta.glob('../../assets/icon/homework/weekly-homework/*.png', { eager: true })))
	const weeklyBossData1 = resourcesMapper(Object.keys(import.meta.glob('../../assets/icon/homework/weekly-boss-1/*.png', { eager: true })))
	const weeklyBossData2 = resourcesMapper(Object.keys(import.meta.glob('../../assets/icon/homework/weekly-boss-2/*.png', { eager: true })))
	
	return (
		<>
			<h1>
				숙제표
			</h1>
			<Row gutter={32}>
				<Col span={9}>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
						<h2>나만의 루틴</h2>
						<Button size={'small'} type={'primary'} onClick={saveMyRoutine}>저장</Button>
					</div>
					<Textarea
						value={myRoutine}
						setValue={setMyRoutine}
						fullWidth={true}
						resize={'none'}
						height={300}
					/>
				</Col>
				<Col span={15}>
					<HomeworkTable title={'일일 숙제'} data={dailyHomework} type={'daily'} />
					<Spacer />
					<HomeworkTable title={'심볼 일퀘'} data={symbolData} type={'daily'} />
					<Spacer />
					<HomeworkTable title={'아케인리버 일퀘'} data={arcaneRiverData} type={'daily'} />
					<Spacer />
					<HomeworkTable title={'일일 보스'} data={dailyBossData} type={'daily'} />
					<Spacer />
					<HomeworkTable title={'주간 숙제'} data={weeklyHomework} type={'weekly'} resetDay={'mon'} />
					<Spacer />
					<HomeworkTable title={'주간 보스1'} data={weeklyBossData1} type={'weekly'} resetDay={'thu'} />
					<Spacer />
					<HomeworkTable title={'주간 보스2'} data={weeklyBossData2} type={'weekly'} resetDay={'thu'} />
				</Col>
			</Row>
		</>
	)
}

export default HomeworkContainer
