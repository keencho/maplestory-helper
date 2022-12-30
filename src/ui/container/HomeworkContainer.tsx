import {Button, Tabs} from 'antd';
import React, {useState} from 'react';
import Textarea from '../component/common/element/Textarea';
import {CustomCol, CustomRow} from '../component/common/element/CustomRowCol';
import NotificationUtil from '../../util/NotificationUtil';
import useModal from '../../hooks/useModal';
import HomeworkHelp from '../component/homework/HomeworkHelp';
import NoMarginHeading from '../component/common/element/NoMarginHeading';
import PageTitle from '../component/common/PageTitle';
import {HOMEWORK_KEY, HomeworkTable} from '../component/homework/HomeworkTable';

const MY_ROUTINE_KEY = 'MY_ROUTINE';
const IMAGES = import.meta.glob('../../assets/icon/homework/**/*.png', { eager: true });

interface HomeworkTabData {
	key: string
	label: string
}

const HomeworkContainer = () => {
	
	const savedMyRoutine = localStorage.getItem(MY_ROUTINE_KEY);
	const localStorageSavedTabItem = window.localStorage.getItem(HOMEWORK_KEY);
	const [myRoutine, setMyRoutine] = useState<string>(savedMyRoutine === null ? '' : savedMyRoutine);
	
	const [activeTabKey, setActiveTabKey] = useState<string>('1');
	const [tabData, setTabData] = useState<HomeworkTabData[]>([{ key: '1', label: '캐릭터1' }]);
	
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
	
	const onEdit = (e: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
		if (action === 'add') {
			if (tabData.length >= 5) {
				NotificationUtil.fire('error', '추가 실패', '최대 5개의 캐릭터 탭을 만들 수 있습니다.');
				return;
			}
			// 키를 단순히 배열길이 + 1 로 하면 난리나기 때문에 max key 뽑아서 + 1 처리함.
			const activeKey = (Math.max(...tabData.map(v => Number(v.key))) + 1).toString();
			setTabData((pv: HomeworkTabData[]) => [ ...pv, { key: (Math.max(...tabData.map(v => Number(v.key))) + 1).toString(), label: `캐릭터${pv.length + 1}` }])
			setActiveTabKey(activeKey);
		} else {
			if (tabData.length === 1) {
				NotificationUtil.fire('error', '삭제 실패', '최소 1개의 캐릭터 탭이 존재해야 합니다.');
				return;
			}
			
			// 지우려는 탭이 현재 활성화된 탭이면 키값이 가장높은 탭을 활성탭으로 만든다.
			if (activeTabKey === e) {
				setActiveTabKey((Math.max(...tabData.filter((td: HomeworkTabData) => td.key !== e).map(v => Number(v.key)))).toString())
			}
			
			setTabData((pv: HomeworkTabData[]) => {
				return pv
					.filter((td: HomeworkTabData) => td.key !== e)
					.map((td: HomeworkTabData, idx: number) => {
						// 키바꾸면 난리난다..
						return {
							...td,
							label: `캐릭터${idx + 1}`
						}
					})
			})
			
			// 로컬스토리지에서 제거
			const localStorageSavedItem = window.localStorage.getItem(HOMEWORK_KEY);
			if (localStorageSavedItem) {
				window.localStorage.setItem(HOMEWORK_KEY, JSON.stringify(JSON.parse(localStorageSavedItem).filter((dt: any) => dt.key !== e)))
			}
		}
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
					<Tabs
						activeKey={activeTabKey}
						onChange={setActiveTabKey}
						type={'editable-card'}
						className={'full-height'}
						onEdit={onEdit}
						items={tabData.map((data: HomeworkTabData) => {
							return {
								...data,
								closable: tabData.length !== 1,
								className: 'full-height',
								children:
									<div key={data.key} className={'full-height overflow-auto'}>
										<HomeworkTableSet tableKey={data.key} currentTabName={data.label} />
									</div>
							}
						})}
					/>
					
				</CustomCol>
			</CustomRow>
		</>
	)
}


// 한가지. tableKey는 계산하여 int -> string으로 변환하는 값이다.
// 혹시 int가 MAX_VALUE에 닿는다면? 하는 생각을 잠깐 해봤지만 그럴린 없겠지
const HomeworkTableSet = ({ tableKey, currentTabName }: { tableKey: string, currentTabName: string }) => {
	
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
			<HomeworkTable currentTabName={currentTabName} localStorageKey={tableKey} title={'일일 숙제'} data={imageMapper('daily-homework')} type={'daily'} />
			<HomeworkTable currentTabName={currentTabName} localStorageKey={tableKey} title={'심볼 일퀘'} data={imageMapper('symbol')} type={'daily'} />
			<HomeworkTable currentTabName={currentTabName} localStorageKey={tableKey} title={'일일 보스'} data={imageMapper('daily-boss')} type={'daily'} />
			<HomeworkTable currentTabName={currentTabName} localStorageKey={tableKey} title={'주간 아케인리버 퀘스트'} data={imageMapper('arcane-river')} type={'weekly'} resetDay={'mon'} />
			<HomeworkTable currentTabName={currentTabName} localStorageKey={tableKey} title={'주간 숙제'} data={imageMapper('weekly-homework')} type={'weekly'} resetDay={'mon'} />
			<HomeworkTable currentTabName={currentTabName} localStorageKey={tableKey} title={'주간 보스1'} data={imageMapper('weekly-boss-1')} type={'weekly'} resetDay={'thu'} />
			<HomeworkTable currentTabName={currentTabName} localStorageKey={tableKey} title={'주간 보스2'} data={imageMapper('weekly-boss-2')} type={'weekly'} resetDay={'thu'} lastItem={true} />
		</>
	)
}

export default HomeworkContainer
