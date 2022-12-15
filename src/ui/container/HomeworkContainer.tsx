import {Button} from 'antd';
import React, {CSSProperties, useState} from 'react';
import {HomeworkTable} from '../component/homework/HomeworkTable';
import Textarea from '../component/common/element/Textarea';
import {CustomCol, CustomRow} from '../component/common/element/CustomRowCol';
import NotificationUtil from '../../util/NotificationUtil';
import useModal from '../../hooks/useModal';
import HomeworkHelp from '../component/homework/HomeworkHelp';
import NoMarginHeading from '../component/common/element/NoMarginHeading';
import PageTitle from '../component/common/PageTitle';

const MY_ROUTINE_KEY = 'MY_ROUTINE';
const IMAGES = import.meta.glob('../../assets/icon/homework/**/*.png', { eager: true });

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
	
	const imageMapper = (folder: string) => {
		
		const getFileName = (path: string) => {
			const split = path.split('/');
			return split[split.length - 1];
		}
		
		return Object.keys(IMAGES)
			.filter((path: string) => path.includes(folder))
			.sort((a, b) => {
				const aIdx = Number(getFileName(a).split('-')[0]);
				const bIdx = Number(getFileName(b).split('-')[0]);
				
				return aIdx > bIdx ? 1 : -1;
			})
			.map((path: string) => {
				const fileName = getFileName(path);
				
				return {
					src: new URL(`../../assets/icon/homework/${folder}/${fileName}`, import.meta.url).href,
					name: fileName.split('.')[0].split('-')[1]
				}
			});
	}
	
	return (
		<>
			<PageTitle
				title={'숙제표'}
				extraContents={<Button type={'primary'} onClick={openHelpModal}>도움말</Button>}
				marginBottom={'.5rem'}
			/>
			<CustomRow gutter={32}>
				<CustomCol span={9}>
					<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '.25rem'}}>
						<NoMarginHeading size={2}>나만의 루틴</NoMarginHeading>
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
					<HomeworkTable title={'일일 숙제'} data={imageMapper('daily-homework')} type={'daily'} />
					<HomeworkTable title={'심볼 일퀘'} data={imageMapper('symbol')} type={'daily'} />
					<HomeworkTable title={'아케인리버 일퀘'} data={imageMapper('arcane-river')} type={'daily'} />
					<HomeworkTable title={'일일 보스'} data={imageMapper('daily-boss')} type={'daily'} />
					<HomeworkTable title={'주간 숙제'} data={imageMapper('weekly-homework')} type={'weekly'} resetDay={'mon'} />
					<HomeworkTable title={'주간 보스1'} data={imageMapper('weekly-boss-1')} type={'weekly'} resetDay={'thu'} />
					<HomeworkTable title={'주간 보스2'} data={imageMapper('weekly-boss-2')} type={'weekly'} resetDay={'thu'} lastItem={true} />
				</CustomCol>
			</CustomRow>
		</>
	)
}

export default HomeworkContainer
