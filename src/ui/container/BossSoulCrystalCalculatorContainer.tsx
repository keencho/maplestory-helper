import {Dispatch, SetStateAction, useState} from 'react';
import {Descriptions, Select, Table, Tag, Typography, Tabs, notification, Button} from 'antd';
import {
	Boss,
	BossInformation,
	DailyBossMap,
	Difficulty,
	DifficultyKor,
	getBossPriceTable,
	WeeklyBossMap
} from '../../model/boss.model';
import {CustomCol, CustomRow} from '../component/common/element/CustomRowCol';
import * as React from 'react';
import NotificationUtil from '../../util/NotificationUtil';

const { Title } = Typography;
const { Column } = Table;

interface BossColumn extends BossInformation {
	key: any
	colSrc: string
	colName: string
	colDifficulty: Difficulty
	colNumberOfPeople: number
	colPrice: number
	colDefeatCount: number
}

const getImageSrcByBoss = (boss: Boss) => {
	// const bossImage = bossImages.find(path => {
	// 	const arr = path.split('/');
	// 	const fileName = arr[arr.length - 1];
	// 	const pureName = fileName.split('.')[0];
	//
	// 	return pureName === Boss[boss];
	// });
	
	// HomeworkContainer 에 똑같이 이미지 불러오는곳 주석 참조.
	// 뭔가 이상해서 절대경로 불러오듯이 함.
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

interface TabData {
	label: string,
	key: string,
	dailyBossData: BossColumn[]
	weeklyBossData: BossColumn[]
}

const BossTable = ({ data, type, onChange }: { data: BossColumn[], type: 'daily' | 'weekly', onChange: (column: BossColumn, key: 'difficulty' | 'numberOfPeople' | 'defeatCount', value: any) => void }): JSX.Element => {
	return (
		<Table dataSource={data} pagination={false} sticky={true} size={'small'}>
			<Column
				align={'center'}
				title={type === 'daily' ? '일일보스' : '주간보스'}
				width={'10%'}
				render={(_, record: BossColumn) => <img src={record.colSrc} alt={record.colName} style={{ width: '40px', height: '40px' }} />}
			/>
			<Column
				title={'이름'}
				dataIndex={'colName'}
			/>
			<Column
				title={'난이도'}
				render={(_, record: BossColumn) => {
					if (Array.isArray(record.difficulty)) {
						return <Select
							onChange={(value) => onChange(record, 'difficulty', value)}
							value={record.colDifficulty}
							style={{ width: '100%' }}
							options={record.difficulty.map(value => { return { value: value, label: DifficultyKor[value] } })}
						/>
					}
					
					return DifficultyKor[record.colDifficulty]
				}}
			/>
			<Column
				title={'인원수'}
				render={(_, record: BossColumn) => {
					return <Select
						onChange={(value) => onChange(record, 'numberOfPeople', value)}
						value={record.colNumberOfPeople}
						style={{ width: '100%' }}
						options={[0, 1, 2, 3, 4, 5, 6].map(value => { return { value: value, label: `${value}명` } })}
					/>
				}}
			/>
			<Column
				title={'격파 횟수'}
				render={(_, record: BossColumn) => {
					if (type === 'weekly') {
						if (record.resettable !== true) {
							return '1회'
						}
					}
					
					let arr = type === 'daily' ? [1, 2, 3, 4, 5, 6, 7] : [1, 2];
					
					return <Select
						onChange={(value) => onChange(record, 'defeatCount', value)}
						value={record.colDefeatCount}
						style={{ width: '100%' }}
						options={arr.map(value => { return { value: value, label: `${value}회` } })}
					/>
				}}
			/>
			<Column
				title={'가격'}
				render={(_, record: BossColumn) => record.colPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
			/>
		</Table>
	)
}

const BossSoulCrystalCalculatorContainer = () => {
	
	const [activeTabKey, setActiveTabKey] = useState<string>('1');
	const [tabData, setTabData] = useState<TabData[]>([{ label: '캐릭터1', key: '1', dailyBossData: DailyBossMap.map(mappingBoss), weeklyBossData: WeeklyBossMap.map(mappingBoss) }]);
	
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
	
	return (
		<>
			<Title level={3}>결정석 수입 계산기</Title>
			<CustomRow gutter={32}>
				<CustomCol span={12}>
					<Tabs
						activeKey={activeTabKey}
						onChange={setActiveTabKey}
						type={'editable-card'}
						onEdit={onEdit}
						tabBarExtraContent={<Button size={'middle'} type={'primary'} onClick={resetCurrentTab}>현재 탭 초기화</Button>}
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
