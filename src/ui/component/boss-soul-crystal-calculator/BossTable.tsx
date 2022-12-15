import {Select, Table} from 'antd';
import {BossColumn, DifficultyKor} from '../../../model/boss.model';
import * as React from 'react';
import Column from 'antd/lib/table/Column';

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

export default BossTable
