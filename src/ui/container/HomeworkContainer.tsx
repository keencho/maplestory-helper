import PageTitle from '../component/common/PageTitle';
import {Button, Tabs} from 'antd';
import React, {useEffect, useState} from 'react';
import useModal from '../../hooks/useModal';
import HomeworkHelp from '../component/homework/HomeworkHelp';
import {CustomCol, CustomRow} from '../component/common/element/CustomRowCol';
import NoMarginHeading from '../component/common/element/NoMarginHeading';
import Textarea from '../component/common/element/Textarea';
import NotificationUtil from '../../util/notification.util';
import HomeworkTable from '../component/homework/HomeworkTable';
import styled from 'styled-components';
import moment from 'moment';
import DateTimeUtils from '../../util/date-time.util';
import {FlexBox} from '../component/common/element/FlexBox';

const HOMEWORK_KEY = "HOMEWORK_V2"
const MY_ROUTINE_KEY = 'MY_ROUTINE';
const IMAGES = import.meta.glob('../../assets/icon/homework/**/*.png', { eager: true });
const IMAGE_KEYS = Object.keys(IMAGES);

const TableWrapper = styled.div `
	height: 100%;
	overflow: auto;
`

export type Data = {
	use: boolean
	src: string
	name: string
	doWork: boolean
}

export interface Table {
	title: string
	weeklyTypeResetProperties?: { resetDay: 'mon' | 'thu', resetDate: string }
	data: Data[]
}

export interface HomeworkTabData {
	key: string
	label: string
	table: Table[]
}

interface LocalStorageSavedForm {
	date: string,
	tabData: HomeworkTabData[]
}

const getResetDateByDay = (day: 'mon' | 'thu') => {
	const dayNeed = day === 'thu' ? 4 : 1;
	const today = moment().isoWeekday();
	
	let momentDay;
	// 오늘의 요일이 초기화 요일 이전이라면
	if (today < dayNeed) {
		momentDay = moment().isoWeekday(dayNeed);
	}
	// 오늘이 초기화 날짜이거나 그 이후 요일이라면
	else {
		momentDay = moment().add(1, 'weeks').isoWeekday(dayNeed);
	}
	
	return momentDay.format('YYYY-MM-DD');
}

const initDefaultHomeworkDataSet = (): Table[] => {
	const getFileName = (path: string) => {
		const split = path.split('/');
		return split[split.length - 1];
	};
	
	return [
		{ title: '일일 숙제', folder: 'daily-homework' },
		{ title: '심볼 일퀘', folder: 'symbol' },
		{ title: '일일 보스', folder: 'daily-boss' },
		{ title: '주간 아케인리버 퀘스트', folder: 'arcane-river', resetDay: 'mon' },
		{ title: '주간 숙제', folder: 'weekly-homework', resetDay: 'mon' },
		{ title: '주간 보스1', folder: 'weekly-boss-1', resetDay: 'thu' },
		{ title: '주간 보스2', folder: 'weekly-boss-2', resetDay: 'thu' },
	].map((dt: any) => {
		return {
			...dt,
			weeklyTypeResetProperties: dt.resetDay ? { resetDay: dt.resetDay, resetDate: getResetDateByDay(dt.resetDay) } : undefined,
			data: IMAGE_KEYS
				.filter(path => path.includes(dt.folder))
				.sort((a, b) => {
					const aIdx = Number(getFileName(a).split('-')[0]);
					const bIdx = Number(getFileName(b).split('-')[0]);
					
					return aIdx > bIdx ? 1 : -1;
				})
				.map(path => {
					const fileName = getFileName(path);
					
					return {
						src: new URL(`../../assets/icon/homework/${dt.folder}/${fileName}`, import.meta.url).href,
						name: fileName.split('.')[0].split('-')[1],
						doWork: false,
						use: true
					}
				})
		}
	})
	
}

export const HomeworkContainer = () => {
	
	/////////////////////////////////////////////////////////////////////
	////////////////////////////// 탭 데이터 세팅
	////////////////////////////// 로컬스토리지에서 먼저 찾는다.
	/////////////////////////////////////////////////////////////////////
	const savedTabData = localStorage.getItem(HOMEWORK_KEY);
	
	let defaultData: LocalStorageSavedForm | null = null;
	if (savedTabData !== null) {
		defaultData = JSON.parse(savedTabData) as LocalStorageSavedForm
		const today = DateTimeUtils.getTodayDate();
		
		// 데이터가 오늘 저장된게 아니라면
		if (defaultData.date !== today) {
			defaultData.tabData.forEach((tabData) => {
				tabData.table.forEach((table: Table) => {
					// 일일 숙제의 경우 수행 여부를 초기화 한다.
					// 주간 숙제의 경우 리셋날짜 당일 or 리셋날짜 이후라면 수행 여부를 초기화 한다
					const daily = table.weeklyTypeResetProperties === undefined
					const weekly = table.weeklyTypeResetProperties !== undefined && moment(today).isSameOrAfter(table.weeklyTypeResetProperties.resetDate);
					if (daily || weekly) {
						table.data.forEach((data: Data) => {
							data.doWork = false;
						})
						
						if (weekly) {
							table.weeklyTypeResetProperties = { resetDay: table.weeklyTypeResetProperties!.resetDay, resetDate: getResetDateByDay(table.weeklyTypeResetProperties!.resetDay) }
						}
					}
				})
			})
		}
		
	}
	
	/////////////////////////////////////////////////////////////////////
	
	const [tabData, setTabData] = useState<HomeworkTabData[]>(defaultData === null ? [{ key: '1', label: '캐릭터1', table: initDefaultHomeworkDataSet() }] : defaultData.tabData);
	
	const savedMyRoutine = localStorage.getItem(MY_ROUTINE_KEY);
	const [activeTabKey, setActiveTabKey] = useState<string>('1');
	const [myRoutine, setMyRoutine] = useState<string>(savedMyRoutine === null ? '' : savedMyRoutine);
	const [showModal] = useModal();
	
	useEffect(() => {
		const savedForm: LocalStorageSavedForm = {
			date: DateTimeUtils.getTodayDate(),
			tabData: tabData
		}
		window.localStorage.setItem(HOMEWORK_KEY, JSON.stringify(savedForm))
	}, [tabData])
	
	const openHelpModal = () => {
		showModal({
			title: '도움말',
			size: 'middle',
			contents: <HomeworkHelp />
		})
	}
	
	const saveMyRoutine = () => {
		localStorage.setItem(MY_ROUTINE_KEY, myRoutine);
		
		NotificationUtil.fire('success', '저장 완료', '나만의 루틴이 저장되었습니다.');
	}
	
	const onEditTab = (e: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
		if (action === 'add') {
			if (tabData.length >= 5) {
				NotificationUtil.fire('error', '추가 실패', '최대 5개의 캐릭터 탭을 만들 수 있습니다.');
				return;
			}
			
			// 키를 단순히 배열길이 + 1 로 하면 난리나기 때문에 max key 뽑아서 + 1 처리함.
			const activeKey = (Math.max(...tabData.map(v => Number(v.key))) + 1).toString();
			setTabData((pv: HomeworkTabData[]) =>
				[
					...pv,
					{
						key: (Math.max(...tabData.map(v => Number(v.key))) + 1).toString(),
						label: `캐릭터${pv.length + 1}`,
						table: initDefaultHomeworkDataSet()
					}
				]
			)
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
		}
	}
	
	const controlTabData = (originalData: HomeworkTabData, key: keyof Data, title: string, indexOfRow: number) => {
		setTabData(pv => {
			return pv.map(dt => {
				// 탭 검색
				if (dt.key !== originalData.key) return dt;
				
				return {
					...dt,
					table: dt.table.map(table => {
						// 테이블 검색
						if (table.title !== title) return table;
						
						return {
							...table,
							data: table.data.map((dt2, idx) => {
								if (idx !== indexOfRow) return dt2;
								
								// 사용
								if (key === 'use') {
									if (dt2.use) {
										return { ...dt2, use: false, doWork: false }
									}
									
									return { ...dt2, use: !dt2.use }
								}
								// 달성
								else {
									return { ...dt2, doWork: !dt2.doWork }
								}
							})
						}
					})
				}
			})
		})
	}
	
	const resetTable = (originalData: HomeworkTabData, title: string) => {
		setTabData(pv => {
			return pv.map(dt => {
				if (dt.key !== originalData.key) return dt;
				
				return {
					...dt,
					table: dt.table.map(table => {
						if (table.title !== title) return table;
						
						return {
							...table,
							// 달성 여부만 초기화 한다.
							data: table.data.map(dt2 => { return { ...dt2, doWork: false } })
						}
					})
				}
			})
		})
	}
	
	const resetCurrentTab = () => {
		setTabData((pv: HomeworkTabData[]) => {
			return pv
				.map((td: HomeworkTabData) => {
					if (td.key === activeTabKey) {
						return {
							...td,
							table: td.table.map((table: Table) => {
								return {
									...table,
									data: table.data.map((data: Data) => {
										return {
											...data,
											doWork: false
										}
									})
								}
							})
						}
					}
					
					return td;
				})
		})
		
		NotificationUtil.fire('success', '초기화 완료', '달성 여부가 모두 초기화 되었습니다.')
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
					<FlexBox alignItems={'center'} justifyContent={'space-between'} margin={'0 0 .25rem 0'}>
						<NoMarginHeading size={2}>나만의 루틴</NoMarginHeading>
						<Button size={'small'} type={'primary'} onClick={saveMyRoutine}>저장</Button>
					</FlexBox>
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
						onEdit={onEditTab}
						tabBarExtraContent={
							<Button type={'primary'} onClick={resetCurrentTab}>현재 탭 달성 여부 전체 초기화</Button>
						}
						items={tabData.map((data: HomeworkTabData) => {
							return {
								...data,
								closable: tabData.length !== 1,
								className: 'full-height',
								children:
									<TableWrapper key={data.key} >
										<HomeworkTable
											{...data}
											onClickRow={(key, title, indexOfRow) => controlTabData(data, key, title, indexOfRow)}
											reset={(title) => resetTable(data, title)}
										/>
									</TableWrapper>
							}
						})}
					/>
				</CustomCol>
			</CustomRow>
		</>
	)
}
