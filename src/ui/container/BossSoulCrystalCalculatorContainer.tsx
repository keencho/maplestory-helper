import {useEffect, useState} from 'react';
import {Col, Row, Space, Table, Tag} from 'antd';
import { ColumnsType } from 'antd/lib/table';
import {Boss, BossInformation, DailyBossMap} from '../../model/boss.model';

interface DataType {
	key: string;
	image: string;
	age: number;
	address: string;
	tags: string[];
}

const columns: ColumnsType<DataType> = [
	{
		title: '음.',
		dataIndex: 'image',
		key: 'image',
		render: text => <a>{text}</a>,
	},
	{
		title: 'Age',
		dataIndex: 'age',
		key: 'age',
	},
	{
		title: 'Address',
		dataIndex: 'address',
		key: 'address',
	},
	{
		title: 'Tags',
		key: 'tags',
		dataIndex: 'tags',
		render: (_, { tags }) => (
			<>
				{tags.map(tag => {
					let color = tag.length > 5 ? 'geekblue' : 'green';
					if (tag === 'loser') {
						color = 'volcano';
					}
					return (
						<Tag color={color} key={tag}>
							{tag.toUpperCase()}
						</Tag>
					);
				})}
			</>
		),
	},
	{
		title: 'Action',
		key: 'action',
		render: (_, record) => (
			<Space size="middle">
				<a>Invite {record.image}</a>
				<a>Delete</a>
			</Space>
		),
	},
];

const data: DataType[] = [
	{
		key: '1',
		image: 'John Brown',
		age: 32,
		address: 'New York No. 1 Lake Park',
		tags: ['nice', 'developer'],
	},
	{
		key: '2',
		image: 'Jim Green',
		age: 42,
		address: 'London No. 1 Lake Park',
		tags: ['loser'],
	},
	{
		key: '3',
		image: 'Joe Black',
		age: 32,
		address: 'Sidney No. 1 Lake Park',
		tags: ['cool', 'teacher'],
	},
];

interface BossColumn extends BossInformation {
	src: string
	name: string
	availableDefeatCount: number
}

const bossColumns: ColumnsType<BossColumn> = [
	{
		title: '',
		dataIndex: 'image',
		key: 'image',
		width: '5%',
		render: (_, record) => (
			<img src={record.src} alt={record.name} style={{ width: '40px', height: '40px' }} />
		)
	},
	{
		title: '이름',
		dataIndex: 'name',
		key: 'name'
	}
]

const BossSoulCrystalCalculatorContainer = () => {
	
	const bossImages = Object.keys(import.meta.glob('../../assets/icon/boss/*.png', { eager: true }));
	const [dailyBoss, setDailyBoss] = useState<BossColumn[]>( DailyBossMap.map((data) => {
		const imagePath = bossImages.find(path => {
			const arr = path.split('/');
			const fileName = arr[arr.length - 1];
			const pureName = fileName.split('.')[0];
			
			return pureName === Boss[data.boss]
		});
		
		return { ...data, key: data.boss, availableDefeatCount: 7, name: Boss[data.boss], src: new URL(imagePath!, import.meta.url).href }
	}));
	
	useEffect(() => {
		console.log(bossImages[0])
	}, [dailyBoss])
	
	return (
		<>
			<h1>결정석 수입 계산기</h1>
			<Row gutter={32}>
				<Col span={12}>
					{/*<Table columns={columns} dataSource={data} pagination={false} />*/}
					<Table columns={bossColumns} dataSource={dailyBoss} pagination={false}  />
				</Col>
				<Col span={12}>
				</Col>
			</Row>
		</>
	)
}

export default BossSoulCrystalCalculatorContainer
