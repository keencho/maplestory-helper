import * as React from 'react';
import {useEffect, useState} from 'react';
import {Button, Descriptions, Switch, Table, Tabs, Tag, Typography} from 'antd';
import {
	Boss,
	BossColumn,
	BossInformation,
	DailyBossMap,
	Difficulty,
	DifficultyKor,
	getBossPriceTable,
	WeeklyBossMap
} from '../../model/boss.model';
import {CustomCol, CustomRow} from '../component/common/element/CustomRowCol';
import NotificationUtil from '../../util/NotificationUtil';
import PageTitle from '../component/common/PageTitle';
import useModal from '../../hooks/useModal';
import BossTable from '../component/boss-soul-crystal-calculator/BossTable';
import BossSoulCrystalCalculatorHelp from '../component/boss-soul-crystal-calculator/BossSoulCrystalCalculatorHelp';

const { Title } = Typography;
const { Column } = Table;

interface TabData {
	label: string,
	key: string,
	dailyBossData: BossColumn[]
	weeklyBossData: BossColumn[]
}

const AUTO_SAVE_KEY = 'BOSS_CALCULATOR_AUTO_SAVE';
const TAB_DATA_KEY = 'BOSS_CALCULATOR_TAB_DATA';

const BossSoulCrystalCalculatorContainer = () => {
	
	const getImageSrcByBoss = (boss: Boss) => {
		return new URL(`../../assets/icon/boss/${Boss[boss]}.png`, import.meta.url).href;
	}
	
	const mappingBoss = (data: BossInformation): BossColumn => {
		return {
			...data,
			key: data.boss,
			colName: Boss[data.boss],
			colDifficulty: Array.isArray(data.difficulty) ? data.difficulty[0] : data.difficulty,
			colSrc: getImageSrcByBoss(data.boss),
			colNumberOfPeople: 0,
			colPrice: 0,
			colDefeatCount: 1
		}
	}
	
	const localStorageAutoSave = window.localStorage.getItem(AUTO_SAVE_KEY);
	const localStorageTabData = window.localStorage.getItem(TAB_DATA_KEY);
	
	const [activeTabKey, setActiveTabKey] = useState<string>('1');
	const [autoSave, setAutoSave] = useState<boolean>(localStorageAutoSave !== null && (localStorageAutoSave === 'true' || localStorageAutoSave === 'false') ? localStorageAutoSave === 'true' : true);
	const [tabData, setTabData] = useState<TabData[]>(
		(autoSave && localStorageTabData !== null)
		? JSON.parse(localStorageTabData)
		: [{ label: '캐릭터1', key: '1', dailyBossData: DailyBossMap.map(mappingBoss), weeklyBossData: WeeklyBossMap.map(mappingBoss) }]
	);
	const [showModal] = useModal();
	
	const onChange = (tabKey: string, type: 'daily' | 'weekly', column: BossColumn, key: 'difficulty' | 'numberOfPeople' | 'defeatCount', value: any) => {
		setTabData((pv: TabData[]) => pv.map((td: TabData) => {
			if (td.key === tabKey) {
				const targetKey = type === 'daily' ? 'dailyBossData' : 'weeklyBossData';
				return {
					...td,
					[targetKey]: td[targetKey].map((col: BossColumn) => {
							if (col.boss === column.boss) {
								let price: number = 0;

								// 인원수
								if (key === 'numberOfPeople' && value !== 0) {
									// N개의 난이도를 가지고 있는 보스
									if (Array.isArray(column.crystalPrice) && Array.isArray(column.difficulty)) {
										price = Math.floor((column.crystalPrice[column.difficulty.findIndex((diff) => diff === col.colDifficulty)] / value) * col.colDefeatCount)
									}
									// 1개의 난이도를 가지고 있는 보스
									else {
										price = Math.floor((column.crystalPrice as number / value) * col.colDefeatCount)
									}
								}
								// 난이도
								else if (key === 'difficulty' && col.colNumberOfPeople !== 0) {
									// 난이도가 변경되었다는건 난이도와 결정석 가격이 N개임을 의미
									if (Array.isArray(column.crystalPrice) && Array.isArray(column.difficulty)) {
										price = Math.floor((column.crystalPrice[column.difficulty.findIndex((diff) => diff === value)] / col.colNumberOfPeople) * col.colDefeatCount)
									}
								}
								// 격파 횟수
								else if (col.colNumberOfPeople !== 0) {
									// 난이도가 N개라면
									if (Array.isArray(column.crystalPrice) && Array.isArray(column.difficulty)) {
										price = Math.floor((column.crystalPrice[column.difficulty.findIndex((diff) => diff === col.colDifficulty)] / col.colNumberOfPeople) * value);
									} else {
										price = Math.floor((column.crystalPrice as number / col.colNumberOfPeople) * value);
									}
								}

								return { ...col, [`col${key.charAt(0).toUpperCase() + key.slice(1)}`]: value, colPrice: price }
							}
							return col;
					})
				};
			}
			
			return td;
		}))
	}
	
	const onEdit = (e: React.MouseEvent | React.KeyboardEvent | string, action: 'add' | 'remove') => {
		if (action === 'add') {
			if (tabData.length >= 5) {
				NotificationUtil.fire('error', '추가 실패', '최대 5개의 캐릭터 탭을 만들 수 있습니다.');
				return;
			}
			
			// 키를 단순히 배열길이 + 1 로 하면 난리나기 때문에 max key 뽑아서 + 1 처리함.
			const activeKey = (Math.max(...tabData.map(v => Number(v.key))) + 1).toString();
			setTabData((pv: TabData[]) => [ ...pv, { key: (Math.max(...tabData.map(v => Number(v.key))) + 1).toString(), label: `캐릭터${pv.length + 1}`, dailyBossData: DailyBossMap.map(mappingBoss), weeklyBossData: WeeklyBossMap.map(mappingBoss) } ] )
			setActiveTabKey(activeKey)
		} else {
			if (tabData.length === 1) {
				NotificationUtil.fire('error', '삭제 실패', '최소 1개의 캐릭터 탭이 존재해야 합니다.');
				return;
			}
			
			// 지우려는 탭이 현재 활성화된 탭이면 키값이 가장높은 탭을 활성탭으로 만든다.
			if (activeTabKey === e) {
				setActiveTabKey((Math.max(...tabData.filter((td: TabData) => td.key !== e).map(v => Number(v.key)))).toString())
			}
			
			setTabData((pv: TabData[]) => {
				return pv
					.filter((td: TabData) => td.key !== e)
					.map((td: TabData, idx: number) => {
						// 키바꾸면 난리난다..
						return {
							...td,
							label: `캐릭터${idx + 1}`
						}
				});
			})
		}
	}
	
	const resetCurrentTab = () => {
		setTabData((pv: TabData[]) => {
			return pv
				.map((td: TabData) => {
					if (td.key === activeTabKey) {
						return {
							...td,
							dailyBossData: DailyBossMap.map(mappingBoss),
							weeklyBossData: WeeklyBossMap.map(mappingBoss)
						}
					}
					
					return td;
				})
		})
		
		NotificationUtil.fire('success', '초기화 완료', '현재 탭이 초기화 되었습니다.')
	}
	
	const calculateData = (): { crystalTotal: number, priceTotal: number } => {
		
		let crystalTotal = 0;
		let priceTotal = 0;
		
		const calc = (bossColumns: BossColumn[]) => {
			bossColumns.forEach((bc: BossColumn) => {
				if (bc.colNumberOfPeople !== 0) {
					crystalTotal += bc.colDefeatCount;
					
					// N개의 난이도라면
					if (Array.isArray(bc.difficulty) && Array.isArray(bc.crystalPrice)) {
						priceTotal += Math.floor(bc.crystalPrice[bc.difficulty.findIndex((diff) => diff === bc.colDifficulty)] / bc.colNumberOfPeople) * bc.colDefeatCount;
					} else {
						priceTotal += Math.floor(bc.crystalPrice as number / bc.colNumberOfPeople) * bc.colDefeatCount;
					}
				}
			})
		}
		
		tabData.forEach((td: TabData) => {
			calc(td.dailyBossData);
			calc(td.weeklyBossData);
		});
		
		return {
			crystalTotal: crystalTotal,
			priceTotal: priceTotal
		}
	}
	
	const saveTabData = () => {
		window.localStorage.setItem(TAB_DATA_KEY, JSON.stringify(tabData));
	}
	
	const clearTabData = () => {
		window.localStorage.removeItem(TAB_DATA_KEY);
	}
	
	const openHelpModal = () => {
		showModal({
			title: '도움말',
			size: 'middle',
			contents: <BossSoulCrystalCalculatorHelp />
		})
	}
	
	useEffect(() => {
	 if (autoSave) {
		 saveTabData();
	 }
	}, [tabData])
	
	useEffect(() => {
		if (autoSave) {
			saveTabData();
		} else {
			clearTabData();
		}
		
		window.localStorage.setItem(AUTO_SAVE_KEY, String(autoSave));
	}, [autoSave])
	
	return (
		<>
			<PageTitle
				title={'결정석 수입 계산기'}
				marginBottom={'.5rem'}
				extraContents={
				<div style={{ display: 'flex', gap: '.5rem' }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '.5rem'}}>
						<span style={{ fontSize: '14px', fontWeight: 600 }}>자동저장</span>
						<Switch checked={autoSave} onChange={setAutoSave} />
					</div>
					<Button type={'primary'} onClick={openHelpModal}>도움말</Button>
				</div>
				}
			/>
			<CustomRow gutter={32}>
				<CustomCol span={12}>
					<Tabs
						activeKey={activeTabKey}
						onChange={setActiveTabKey}
						type={'editable-card'}
						onEdit={onEdit}
						tabBarExtraContent={<Button type={'primary'} onClick={resetCurrentTab}>현재 탭 초기화</Button>}
						items={tabData.map((data: TabData) => {
							return {
								...data,
								closable: tabData.length !== 1,
								children:
									<React.Fragment key={data.key}>
										<BossTable
											data={data.dailyBossData}
											type={'daily'}
											onChange={(column: BossColumn, key: 'difficulty' | 'numberOfPeople' | 'defeatCount', value: any) => onChange(data.key, 'daily', column, key, value)}
										/>
										<BossTable
											data={data.weeklyBossData}
											type={'weekly'}
											onChange={(column: BossColumn, key: 'difficulty' | 'numberOfPeople' | 'defeatCount', value: any) => onChange(data.key, 'weekly', column, key, value)}
										/>
									</React.Fragment>
							}
						})}
					/>
				</CustomCol>
				<CustomCol span={12}>
					<Title level={5}>총합</Title>
					<Descriptions bordered column={2}>
						<Descriptions.Item label="캐릭터 수">{tabData.length}개</Descriptions.Item>
						<Descriptions.Item label="결정석 판매 갯수">{calculateData().crystalTotal}개</Descriptions.Item>
						<Descriptions.Item label="수입 총합" span={2}>{calculateData().priceTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Descriptions.Item>
					</Descriptions>
					
					<Title level={5} style={{ marginTop: '2rem' }}>결정석 가격표</Title>
					<Table dataSource={getBossPriceTable()} pagination={false} sticky={true} size={'small'} style={{ overflow: 'auto' }}>
						<Column
							width={'10%'}
							align={'center'}
							render={(_, record: BossInformation) => <img src={getImageSrcByBoss(record.boss)} alt={Boss[record.boss]} style={{ width: '40px', height: '40px' }} />}
						/>
						<Column
							title={'이름'}
							render={(_, record: BossInformation) => Boss[record.boss]}
						/>
						<Column
							title={'난이도'}
							render={(_, record: BossInformation) => {
								let color;
								switch (record.difficulty as Difficulty) {
									case Difficulty.EASY:
										color = 'success';
										break;
									case Difficulty.NORMAL:
										color = 'processing';
										break;
									case Difficulty.HARD:
										color = 'yellow';
										break;
									case Difficulty.CHAOS:
										color = 'pink';
										break;
									case Difficulty.EXTREME:
										color = 'error';
										break;
								}
								return <Tag color={color}>{DifficultyKor[record.difficulty as Difficulty]}</Tag>
							}}
						/>
						<Column
							title={'가격'}
							render={(_, record: BossInformation) => record.crystalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						/>
					</Table>
				</CustomCol>
			</CustomRow>
		</>
	)
}

export default BossSoulCrystalCalculatorContainer
