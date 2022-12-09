import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {ResetButton} from './element/ResetButton';
import {Button, Progress} from 'antd';
import Color from '../../model/color.model';
import DateTimeUtils from '../../util/DateTimeUtils';

const Table = styled.table`
	border-collapse: collapse;
	
	tbody {
		text-align: center;
		th, tr, td {
			border: 1px solid;
		}
	}
	
	td {
		width: 80px;
	}
`

const TrCheckUse = styled.tr`
`

const TrName = styled.tr`
`

const TrImage = styled.tr`
`

const TrRate = styled.tr`
`

interface Data {
	src: string,
	name: string
}

interface Props {
	title: string
	data: Data[]
	type: 'daily' | 'weekly'
}

type Properties = {
	use: boolean,
	src: string,
	name: string,
	doWork: boolean
}

interface LocalStorageSavedForm {
	title: string
	date: string,
	data: Properties[]
}

const HOMEWORK_DAILY_KEY = "HOMEWORK_DAILY"
const TODAY = DateTimeUtils.getTodayDate();

const HomeworkTable = (props: Props) => {
	
	const dailyItem = window.localStorage.getItem(HOMEWORK_DAILY_KEY);
	const parsedDailyItem: LocalStorageSavedForm[] = dailyItem === null ? [] : JSON.parse(dailyItem) as LocalStorageSavedForm[];
	
	// 일자 지난 데일리 일퀘 현황들은 지워버린다.
	if (parsedDailyItem.some(item => item.date !== TODAY)) {
		window.localStorage.setItem(HOMEWORK_DAILY_KEY, JSON.stringify(parsedDailyItem.filter(item => item.date !== TODAY)));
	}
	
	const matchedDailyItem = parsedDailyItem.find(item => item.date === TODAY && item.title === props.title);
	
	const [data, setData] = useState<Properties[]>(
		matchedDailyItem === undefined
		?
			props.data.map((prop: Data) => {
				return {
					use: true,
					src: prop.src,
					name: prop.name,
					doWork: false
				}
			})
		:
			matchedDailyItem.data
	);
	
	useEffect(() => {
		if (props.type === 'daily') {
			const item = window.localStorage.getItem(HOMEWORK_DAILY_KEY);
			if (item === null) {
				window.localStorage.setItem(HOMEWORK_DAILY_KEY, JSON.stringify([{
					date: TODAY,
					title: props.title,
					data: data
				} as LocalStorageSavedForm ]))
				return;
			}
			
			let parsedItem = JSON.parse(item);
			parsedItem = parsedItem.filter((item: LocalStorageSavedForm) => item.title !== props.title);
			
			parsedItem.push({
				date: TODAY,
				title: props.title,
				data: data
			})
			
			window.localStorage.setItem(HOMEWORK_DAILY_KEY, JSON.stringify(parsedItem));
		}
	}, [data])
	
	const check = (key: 'use' | 'doWork', idx: number) => {
		setData((pv) => pv.map((p: Properties, idx2: number) => {
			if (idx !== idx2) {
				return p;
			}
			if (key === 'use') {
				if (p.use) {
					return { ...p, use: false, doWork: false }
				}
				
				return { ...p, use: !p.use }
			} else {
				return { ...p, doWork: !p.doWork }
			}
			
		}))
	}
	
	const reset = () => {
		setData((pv) => pv.map((p: Properties) => {
			return { ...p, doWork: false }
		}))
	}
	
	const getDataByKey = (key: keyof Properties): JSX.Element | JSX.Element[] => {
		if (!data) return <></>
		
		const mapping = (dt: Properties, idx: number): JSX.Element => {
			switch (key) {
				case 'use':
					if (dt.use) {
						return (
							<td style={{ backgroundColor: Color.BLUE }} key={idx}>
								<ResetButton fullWidth={true} onClick={() => check('use', idx)}>O</ResetButton>
							</td>
						)
					}
					
					return (
						<td style={{ backgroundColor: Color.RED }} key={idx}>
							<ResetButton fullWidth={true} onClick={() => check('use', idx)}>X</ResetButton>
						</td>
					)
					
				case 'name':
					return <td key={idx}>{dt.name}</td>
				case 'src':
					if (!dt.use) {
						return <td key={idx}><img src={dt.src} alt={dt.name} /></td>
					}
					
					return (
						<td key={idx} style={{ backgroundColor: dt.doWork ? Color.BLUE : 'inherit' }}>
							<ResetButton fullWidth={true} onClick={() => check('doWork', idx)}>
								<img src={dt.src} alt={dt.name} />
							</ResetButton>
						</td>
					)
					
				default:
					return <></>
			}
		}
		
		return data.map(mapping);
	}
	
	const calculateRate = (): number => {
		let use = 0;
		let doWork = 0;
		
		data.forEach((dt: Properties) => {
			if (dt.use) use++;
			if (dt.doWork) doWork++;
		})
		
		return Number(((doWork / use) * 100).toFixed(0));
	}
	
	return (
		<>
			<Table>
				<thead>
					<tr>
						<td colSpan={data && data.length - 1}><h3>{props.title}</h3></td>
						<td style={{ textAlign: 'right' }}><Button size={'small'} type={'primary'} danger onClick={reset}>초기화</Button></td>
					</tr>
				</thead>
				<tbody>
					<TrCheckUse>
						{getDataByKey('use')}
					</TrCheckUse>
					<TrName>
						{getDataByKey('name')}
					</TrName>
					<TrImage>
						{getDataByKey('src')}
					</TrImage>
					<TrRate>
						<td colSpan={1}>달성률</td>
						<td colSpan={data && data.length - 1} style={{ padding: '0 16px' }}>
							<Progress percent={calculateRate()} strokeColor={Color.BLUE} status={'normal'} />
						</td>
					</TrRate>
				</tbody>
			</Table>
		</>
	)
}

export default HomeworkTable
