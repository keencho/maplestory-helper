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
		
		img {
			width: 33px;
			height: 33px;
		}
	}
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
	type: 'daily' | 'weekly'
	data: Properties[]
}

export const HOMEWORK_KEY = "HOMEWORK"
const TODAY = DateTimeUtils.getTodayDate();

export const HomeworkTable = (props: Props) => {
	
	const item = window.localStorage.getItem(HOMEWORK_KEY);
	let parsedItem: LocalStorageSavedForm[] = item === null ? [] : JSON.parse(item) as LocalStorageSavedForm[];
	
	// 오늘날짜가 아닌 데일리 숙제가 있다면
	if (parsedItem.some(item => item.date !== TODAY && item.type === 'daily')) {
		window.localStorage.setItem(HOMEWORK_KEY, JSON.stringify(parsedItem.filter(item => item.date !== TODAY && item.type === 'daily')));
		
		// 날짜는 오늘날짜로 바꾸고 사용여부는 기존의것 사용, 달성여부는 false
		parsedItem = parsedItem.map((item: LocalStorageSavedForm) => {
			return {
				...item,
				date: TODAY,
				data: item.data.map((data: Properties) => {
					return {
						...data,
						use: data.use,
						doWork: false
					}
				})
			};
		})
	}
	
	const matchedDailyItem = parsedItem.find(item => item.date === TODAY && item.title === props.title);
	
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
			const item = window.localStorage.getItem(HOMEWORK_KEY);
			if (item === null) {
				window.localStorage.setItem(HOMEWORK_KEY, JSON.stringify([{
					date: TODAY,
					title: props.title,
					data: data,
					type: props.type
				} as LocalStorageSavedForm ]))
				return;
			}
			
			let parsedItem = JSON.parse(item);
			parsedItem = parsedItem.filter((item: LocalStorageSavedForm) => item.title !== props.title);
			
			parsedItem.push({
				date: TODAY,
				title: props.title,
				data: data,
				type: props.type
			})
			
			window.localStorage.setItem(HOMEWORK_KEY, JSON.stringify(parsedItem));
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
					<tr>
						{getDataByKey('use')}
					</tr>
					<tr>
						{getDataByKey('name')}
					</tr>
					<tr>
						{getDataByKey('src')}
					</tr>
					<tr>
						<td colSpan={1}>달성률</td>
						<td colSpan={data && data.length - 1} style={{ padding: '0 16px' }}>
							<Progress percent={calculateRate()} strokeColor={Color.BLUE} status={'normal'} />
						</td>
					</tr>
				</tbody>
			</Table>
		</>
	)
}
