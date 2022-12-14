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
import NotificationUtil from '../../util/notification.util';
import PageTitle from '../component/common/PageTitle';
import useModal from '../../hooks/useModal';
import BossTable from '../component/boss-soul-crystal-calculator/BossTable';
import BossSoulCrystalCalculatorHelp from '../component/boss-soul-crystal-calculator/BossSoulCrystalCalculatorHelp';
import {FlexBox} from '../component/common/element/FlexBox';
import { CommonStyledSpan } from '../../model/style.model';

const { Title } = Typography;
const { Column } = Table;

export interface BossSoulCrystalCalculatorTabData {
	key: string
	label: string
	dailyBossData: BossColumn[]
	weeklyBossData: BossColumn[]
}

const AUTO_SAVE_KEY = 'BOSS_CALCULATOR_AUTO_SAVE';
const TAB_DATA_KEY = 'BOSS_CALCULATOR_TAB_DATA';

export const BossSoulCrystalCalculatorContainer = () => {
	
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
	const [tabData, setTabData] = useState<BossSoulCrystalCalculatorTabData[]>(
		(autoSave && localStorageTabData !== null)
		? JSON.parse(localStorageTabData)
		: [{ label: '?????????1', key: '1', dailyBossData: DailyBossMap.map(mappingBoss), weeklyBossData: WeeklyBossMap.map(mappingBoss) }]
	);
	const [showModal] = useModal();
	
	const onChange = (tabKey: string, type: 'daily' | 'weekly', column: BossColumn, key: 'difficulty' | 'numberOfPeople' | 'defeatCount', value: any) => {
		setTabData((pv: BossSoulCrystalCalculatorTabData[]) => pv.map((td: BossSoulCrystalCalculatorTabData) => {
			if (td.key === tabKey) {
				const targetKey = type === 'daily' ? 'dailyBossData' : 'weeklyBossData';
				return {
					...td,
					[targetKey]: td[targetKey].map((col: BossColumn) => {
							if (col.boss === column.boss) {
								let price: number = 0;

								// ?????????
								if (key === 'numberOfPeople' && value !== 0) {
									// N?????? ???????????? ????????? ?????? ??????
									if (Array.isArray(column.crystalPrice) && Array.isArray(column.difficulty)) {
										price = Math.floor((column.crystalPrice[column.difficulty.findIndex((diff) => diff === col.colDifficulty)] / value) * col.colDefeatCount)
									}
									// 1?????? ???????????? ????????? ?????? ??????
									else {
										price = Math.floor((column.crystalPrice as number / value) * col.colDefeatCount)
									}
								}
								// ?????????
								else if (key === 'difficulty' && col.colNumberOfPeople !== 0) {
									// ???????????? ????????????????????? ???????????? ????????? ????????? N????????? ??????
									if (Array.isArray(column.crystalPrice) && Array.isArray(column.difficulty)) {
										price = Math.floor((column.crystalPrice[column.difficulty.findIndex((diff) => diff === value)] / col.colNumberOfPeople) * col.colDefeatCount)
									}
								}
								// ?????? ??????
								else if (col.colNumberOfPeople !== 0) {
									// ???????????? N?????????
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
				NotificationUtil.fire('error', '?????? ??????', '?????? 5?????? ????????? ?????? ?????? ??? ????????????.');
				return;
			}
			
			// ?????? ????????? ???????????? + 1 ??? ?????? ???????????? ????????? max key ????????? + 1 ?????????.
			const activeKey = (Math.max(...tabData.map(v => Number(v.key))) + 1).toString();
			setTabData((pv: BossSoulCrystalCalculatorTabData[]) => [ ...pv, { key: (Math.max(...tabData.map(v => Number(v.key))) + 1).toString(), label: `?????????${pv.length + 1}`, dailyBossData: DailyBossMap.map(mappingBoss), weeklyBossData: WeeklyBossMap.map(mappingBoss) } ] )
			setActiveTabKey(activeKey)
		} else {
			if (tabData.length === 1) {
				NotificationUtil.fire('error', '?????? ??????', '?????? 1?????? ????????? ?????? ???????????? ?????????.');
				return;
			}
			
			// ???????????? ?????? ?????? ???????????? ????????? ????????? ???????????? ?????? ??????????????? ?????????.
			if (activeTabKey === e) {
				setActiveTabKey((Math.max(...tabData.filter((td: BossSoulCrystalCalculatorTabData) => td.key !== e).map(v => Number(v.key)))).toString())
			}
			
			setTabData((pv: BossSoulCrystalCalculatorTabData[]) => {
				return pv
					.filter((td: BossSoulCrystalCalculatorTabData) => td.key !== e)
					.map((td: BossSoulCrystalCalculatorTabData, idx: number) => {
						// ???????????? ????????????..
						return {
							...td,
							label: `?????????${idx + 1}`
						}
				});
			})
		}
	}
	
	const resetCurrentTab = () => {
		setTabData((pv: BossSoulCrystalCalculatorTabData[]) => {
			return pv
				.map((td: BossSoulCrystalCalculatorTabData) => {
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
		
		NotificationUtil.fire('success', '????????? ??????', '?????? ?????? ????????? ???????????????.')
	}
	
	const copyCurrentTab = () => {
		if (tabData.length >= 5) {
			NotificationUtil.fire('error', '?????? ??????', '?????? 5?????? ????????? ?????? ?????? ??? ????????????.');
			return;
		}
		
		const activeKey = (Math.max(...tabData.map(v => Number(v.key))) + 1).toString();
		const currentActiveData = tabData.find(data => data.key === activeTabKey)!;
		
		setTabData((pv: BossSoulCrystalCalculatorTabData[]) => [ ...pv, {
			key: (Math.max(...tabData.map(v => Number(v.key))) + 1).toString(),
			label: `?????????${pv.length + 1}`,
			dailyBossData: currentActiveData.dailyBossData,
			weeklyBossData: currentActiveData.weeklyBossData
		}])
		setActiveTabKey(activeKey)
	}
	
	const calculateData = (): { crystalTotal: number, priceTotal: number } => {
		
		let crystalTotal = 0;
		let priceTotal = 0;
		
		const calc = (bossColumns: BossColumn[]) => {
			bossColumns.forEach((bc: BossColumn) => {
				if (bc.colNumberOfPeople !== 0) {
					crystalTotal += bc.colDefeatCount;
					
					// N?????? ???????????????
					if (Array.isArray(bc.difficulty) && Array.isArray(bc.crystalPrice)) {
						priceTotal += Math.floor(bc.crystalPrice[bc.difficulty.findIndex((diff) => diff === bc.colDifficulty)] / bc.colNumberOfPeople) * bc.colDefeatCount;
					} else {
						priceTotal += Math.floor(bc.crystalPrice as number / bc.colNumberOfPeople) * bc.colDefeatCount;
					}
				}
			})
		}
		
		tabData.forEach((td: BossSoulCrystalCalculatorTabData) => {
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
			title: '?????????',
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
				title={'????????? ?????? ?????????'}
				marginBottom={'.5rem'}
				extraContents={
				<FlexBox gap={'.5rem'}>
					<FlexBox alignItems={'center'} gap={'.5rem'}>
						<CommonStyledSpan fontSize={'14px'} fontWeight={600}>????????????</CommonStyledSpan>
						<Switch checked={autoSave} onChange={setAutoSave} />
					</FlexBox>
					<Button type={'primary'} onClick={openHelpModal}>?????????</Button>
				</FlexBox>
				}
			/>
			<CustomRow gutter={32}>
				<CustomCol span={12}>
					<Tabs
						activeKey={activeTabKey}
						onChange={setActiveTabKey}
						type={'editable-card'}
						className={'full-height'}
						onEdit={onEdit}
						tabBarExtraContent={
							<FlexBox gap={'.5rem'}>
								<Button type={'primary'} onClick={copyCurrentTab}>?????? ??? ??????</Button>
								<Button type={'primary'} onClick={resetCurrentTab}>?????? ??? ?????????</Button>
							</FlexBox>
						}
						items={tabData.map((data: BossSoulCrystalCalculatorTabData) => {
							return {
								...data,
								closable: tabData.length !== 1,
								className: 'full-height',
								children:
									<div key={data.key} className={'full-height overflow-auto'}>
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
									</div>
							}
						})}
					/>
				</CustomCol>
				<CustomCol span={12}>
					<Title level={5}>??????</Title>
					<Descriptions bordered column={2}>
						<Descriptions.Item label="????????? ???">{tabData.length}???</Descriptions.Item>
						<Descriptions.Item label="????????? ?????? ??????">{calculateData().crystalTotal}???</Descriptions.Item>
						<Descriptions.Item label="?????? ??????" span={2}>{calculateData().priceTotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</Descriptions.Item>
					</Descriptions>
					
					<Title level={5} style={{ marginTop: '2rem' }}>????????? ?????????</Title>
					<Table dataSource={getBossPriceTable()} pagination={false} sticky={true} size={'small'} style={{ overflow: 'auto' }}>
						<Column
							width={'10%'}
							align={'center'}
							render={(_, record: BossInformation) => <img src={getImageSrcByBoss(record.boss)} alt={Boss[record.boss]} style={{ width: '40px', height: '40px' }} />}
						/>
						<Column
							title={'??????'}
							render={(_, record: BossInformation) => Boss[record.boss]}
						/>
						<Column
							title={'?????????'}
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
							title={'??????'}
							render={(_, record: BossInformation) => record.crystalPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						/>
					</Table>
				</CustomCol>
			</CustomRow>
		</>
	)
}
