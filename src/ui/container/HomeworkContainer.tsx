import {Button} from 'antd';
import React, {useState} from 'react';
import {HomeworkTable} from '../component/homework/HomeworkTable';
import Textarea from '../component/common/element/Textarea';
import {CustomCol, CustomRow} from '../component/common/element/CustomRowCol';
import NotificationUtil from '../../util/NotificationUtil';
import useModal from '../../hooks/useModal';
import HomeworkHelp from '../component/homework/HomeworkHelp';

const MY_ROUTINE_KEY = 'MY_ROUTINE';

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
			const splitSlash = path.split('/');
			const pureFolder = splitSlash[splitSlash.length - 2];
			const pureFileName = fileName.split('.')[0];
			
			// 이게 뭔짓인지 모르겠지만 path를 그대로 넘기면 production build할때 코드가 이상하게 생성된다.
			// 그래서 그냥 절대경로? 불러오듯이 불러오기로 한다.
			return {
				src: new URL(`../../assets/icon/homework/${pureFolder}/${pureFileName}.png`, import.meta.url).href,
				name: pureFileName.split('-')[1]
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

const HomeworkContainer = () => {
	
	const savedMyRoutine = localStorage.getItem(MY_ROUTINE_KEY);
	const [myRoutine, setMyRoutine] = useState<string>(savedMyRoutine === null ? '' : savedMyRoutine);
	const [showModal] = useModal();
	
	const saveMyRoutine = () => {
		localStorage.setItem(MY_ROUTINE_KEY, myRoutine);
		
		NotificationUtil.fire('success', '저장 완료', '나만의 루틴이 저장되었습니다.');
	}
	
	const openHelpModal = () => {
		showModal({
			title: '도움말',
			size: 'middle',
			contents: <HomeworkHelp />
		})
	}
	
	return (
		<>
			<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
				<h1>
					숙제표
				</h1>
				<Button size={'large'} type={'primary'} onClick={openHelpModal}>도움말</Button>
			</div>
			<CustomRow gutter={32}>
				<CustomCol span={9}>
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
				</CustomCol>
				<CustomCol span={15}>
					<HomeworkTable title={'일일 숙제'} data={dailyHomework} type={'daily'} />
					<HomeworkTable title={'심볼 일퀘'} data={symbolData} type={'daily'} />
					<HomeworkTable title={'아케인리버 일퀘'} data={arcaneRiverData} type={'daily'} />
					<HomeworkTable title={'일일 보스'} data={dailyBossData} type={'daily'} />
					<HomeworkTable title={'주간 숙제'} data={weeklyHomework} type={'weekly'} resetDay={'mon'} />
					<HomeworkTable title={'주간 보스1'} data={weeklyBossData1} type={'weekly'} resetDay={'thu'} />
					<HomeworkTable title={'주간 보스2'} data={weeklyBossData2} type={'weekly'} resetDay={'thu'} lastItem={true} />
				</CustomCol>
			</CustomRow>
		</>
	)
}

export default HomeworkContainer
