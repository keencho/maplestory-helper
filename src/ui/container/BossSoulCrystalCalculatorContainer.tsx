import {Dispatch, SetStateAction, useEffect, useState} from 'react';
import {Col, Row, Space, Table, Tag, Select} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {Boss, BossInformation, DailyBossMap, Difficulty, DifficultyKor, WeeklyBossMap} from '../../model/boss.model';
import {CustomCol, CustomRow} from '../component/CustomRowCol';

const { Column } = Table;

interface BossColumn extends BossInformation {
	colSrc: string
	colName: string
	colDifficulty: Difficulty
	colNumberOfPeople: number
	colPrice: number
	colDefeatCount: number
}

const bossImages = Object.keys(import.meta.glob('../../assets/icon/boss/*.png', { eager: true }));

const mappingBoss = (data: BossInformation) => {
	const imagePath = bossImages.find(path => {
		const arr = path.split('/');
		const fileName = arr[arr.length - 1];
		const pureName = fileName.split('.')[0];
		
		return pureName === Boss[data.boss]
	});
	
	return {
		...data,
		key: data.boss,
		colName: Boss[data.boss],
		colDifficulty: Array.isArray(data.difficulty) ? data.difficulty[0] : data.difficulty,
		colSrc: new URL(imagePath!, import.meta.url).href,
		colNumberOfPeople: 0,
		colPrice: 0,
		colDefeatCount: 1
	}
}

const BossSoulCrystalCalculatorContainer = () => {

	const [dailyBoss, setDailyBoss] = useState<BossColumn[]>(DailyBossMap.map(mappingBoss));
	const [weeklyBoss, setWeeklyBoss] = useState<BossColumn[]>(WeeklyBossMap.map(mappingBoss));
	
	const onChange = (type: 'daily' | 'weekly', column: BossColumn, key: 'difficulty' | 'numberOfPeople' | 'defeatCount', value: any) => {
		const setBoss: Dispatch<SetStateAction<BossColumn[]>> = type === 'daily' ? setDailyBoss : setWeeklyBoss;
		
		setBoss((pv: BossColumn[]) => pv.map((col: BossColumn) => {
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
		}))
	}
	
	useEffect(() => {
		console.log(dailyBoss)
	}, [dailyBoss])
	
	return (
		<>
			<h1>결정석 수입 계산기</h1>
			<CustomRow gutter={32}>
				<CustomCol span={12}>
					<Table dataSource={dailyBoss} pagination={false} sticky={true} size={'small'}>
						<Column
							align={'center'}
							title={'일일보스'}
							width={'10%'}
							render={(_, record: BossColumn) => <img src={record.colSrc} alt={record.colName} style={{ width: '40px', height: '40px' }} />}
						/>
						<Column
							title={'이름'}
							dataIndex={'colName'}
						/>
						<Column
							title={'난이도'}
							dataIndex={'difficulty'}
							render={(_, record: BossColumn) => {
								if (Array.isArray(record.difficulty)) {
									return <Select
										onChange={(value) => onChange('daily', record, 'difficulty', value)}
										defaultValue={record.colDifficulty}
										style={{ width: '100%' }}
										options={record.difficulty.map(value => { return { value: value, label: DifficultyKor[value] } })}
									/>
								}
								
								return DifficultyKor[record.colDifficulty]
							}}
						/>
						<Column
							title={'인원수'}
							dataIndex={'numberOfPeople'}
							render={(_, record: BossColumn) => {
								return <Select
									onChange={(value) => onChange('daily', record, 'numberOfPeople', value)}
									defaultValue={0}
									style={{ width: '100%' }}
									options={[0, 1, 2, 3, 4, 5, 6].map(value => { return { value: value, label: `${value}명` } })}
								/>
							}}
						/>
						<Column
							title={'격파 횟수'}
							dataIndex={'defeatCount'}
							render={(_, record: BossColumn) => {
								return <Select
									onChange={(value) => onChange('daily', record, 'defeatCount', value)}
									defaultValue={record.colDefeatCount}
									style={{ width: '100%' }}
									options={[1, 2, 3, 4, 5, 6, 7].map(value => { return { value: value, label: `${value}회` } })}
								/>
							}}
						/>
						<Column
							title={'가격'}
							dataIndex={'price'}
							render={(_, record: BossColumn) => record.colPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
						/>
					</Table>
					<Table dataSource={weeklyBoss} pagination={false} sticky={true} size={'small'}>
						<Column
							align={'center'}
							title={'주간보스'}
							width={'10%'}
							render={(_, record: BossColumn) => <img src={record.colSrc} alt={record.colName} style={{ width: '40px', height: '40px' }} />}
						/>
						<Column
							title={'이름'}
							dataIndex={'colName'}
						/>
						<Column
							title={'난이도'}
							dataIndex={'difficulty'}
							render={(_, record: BossColumn) => {
								if (Array.isArray(record.difficulty)) {
									return <Select
										onChange={(value) => onChange('weekly', record, 'difficulty', value)}
										defaultValue={record.colDifficulty}
										style={{ width: '100%' }}
										options={record.difficulty.map(value => { return { value: value, label: DifficultyKor[value] } })}
									/>
								}
								
								return DifficultyKor[record.colDifficulty]
							}}
						/>
						<Column
							title={'인원수'}
							dataIndex={'numberOfPeople'}
							render={(_, record: BossColumn) => {
								return <Select
									onChange={(value) => onChange('weekly', record, 'numberOfPeople', value)}
									defaultValue={0}
									style={{ width: '100%' }}
									options={[0, 1, 2, 3, 4, 5, 6].map(value => { return { value: value, label: `${value}명` } })}
								/>
							}}
						/>
						<Column
							title={'격파 횟수'}
							dataIndex={'defeatCount'}
							render={(_, record: BossColumn) => {
								if (record.resettable !== true) {
									return '1회'
								}
								
								return <Select
									onChange={(value) => onChange('weekly', record, 'defeatCount', value)}
									defaultValue={record.colDefeatCount}
									style={{ width: '100%' }}
									options={[1, 2].map(value => { return { value: value, label: `${value}회` } })}
								/>
							}}
						/>
						<Column
							title={'가격'}
							dataIndex={'price'}
							render={(_, record: BossColumn) => {
								return <div>{record.colPrice.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')}</div>
							}}
						/>
					</Table>
				</CustomCol>
				<CustomCol span={12}>
				
				</CustomCol>
			</CustomRow>
		</>
	)
}

export default BossSoulCrystalCalculatorContainer
