import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {ResetButton} from '../common/element/ResetButton';
import {Button, Progress} from 'antd';
import Color from '../../../model/color.model';
import DateTimeUtils from '../../../util/DateTimeUtils';
import moment from 'moment';
import it from 'node:test';
import {match} from 'assert';

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
	resetDay?: 'thu' | 'mon'
	lastItem?: boolean
}

type Properties = {
	use: boolean,
	src: string,
	name: string,
	doWork: boolean
}

interface LocalStorageSavedForm {
	title: string
	date: string
	type: 'daily' | 'weekly'
	data: Properties[]
	weeklyResetDate?: string
}

export const HOMEWORK_KEY = "HOMEWORK"
const TODAY = DateTimeUtils.getTodayDate();

export const HomeworkTable = (props: Props) => {
	
	const item = window.localStorage.getItem(HOMEWORK_KEY);
	let localStorageSavedItems: LocalStorageSavedForm[] = item === null ? [] : JSON.parse(item) as LocalStorageSavedForm[];
	
	// 오늘날짜가 아닌 숙제가 있다면
	if (localStorageSavedItems.some(item => item.date !== TODAY)) {
		localStorageSavedItems = localStorageSavedItems.map((item: LocalStorageSavedForm) => {
			// 이럴일은 없지만 날짜가 오늘이라면 그냥 그대로 리턴함.
			if (item.date === TODAY) {
				return item;
			}
			
			// 일일 숙제의 경우 날짜는 오늘날짜로 바꾸고 사용여부는 기존의것 사용, 달성여부는 false
			if (item.type === 'daily') {
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
			}
			
			// 주간 숙제
			// 리셋날짜 이전이라면 모든 프로퍼티를 그대로 가저감
			if (moment(TODAY).isBefore(item.weeklyResetDate)) {
				return {
					...item,
					date: TODAY
				}
			}
			
			// 리셋날짜 당일 or 리셋날짜 이후라면 사용여부는 기존것 사용, 달성여부는 false
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
			}
		})
	}
	
	const matchedItem = localStorageSavedItems.find(item => item.title === props.title);
	
	const [data, setData] = useState<Properties[]>(
		props.data.map((prop: Data) => {
			// 로컬스토리지에 저장된 아이템이 있다면
			if (matchedItem) {
				// 이름으로 검색하여 기존의 프로퍼티들을 사용한다. (이미지 빼고)
				// 개발시점에 새롭게 추가된 아이템은 여기서 검색되지 않고 아래로 내려가 초기화 상태의 프로피터들을 사용하게 될 것이다.
				const searchedItem = matchedItem.data.find((item: Properties) => item.name === prop.name);
				
				if (searchedItem) {
					return {
						use: searchedItem.use,
						name: prop.name,
						src: prop.src,
						doWork: searchedItem.doWork
					}
				}
			}
			
			// 저장된 아이템이 없다면 프로퍼티들을 초기화하여 사용한다.
			return {
				use: true,
				src: prop.src,
				name: prop.name,
				doWork: false
			};
		})
	)
	
	useEffect(() => {
		const item = window.localStorage.getItem(HOMEWORK_KEY);
		
		let arr: LocalStorageSavedForm[] = [];
		if (item !== null) {
			arr = JSON.parse(item).filter((item: LocalStorageSavedForm) => item.title !== props.title);
		}
		
		let form: LocalStorageSavedForm = {
			date: TODAY,
			title: props.title,
			data: data,
			type: props.type
		}
		
		// 주간 숙제의 경우 리셋날자 지정
		if (props.type === 'weekly' && props.resetDay) {
			const dayNeed = props.resetDay === 'thu' ? 4 : 1;
			const today = moment().isoWeekday();
			
			// 오늘의 요일이 초기화 요일 이전이라면
			let momentDay;
			if (today < dayNeed) {
				momentDay = moment().isoWeekday(dayNeed);
			}
			// 오늘이 초기화 날짜이거나 그 이후 요일이라면
			else {
				momentDay = moment().add(1, 'weeks').isoWeekday(dayNeed);
			}
			
			form.weeklyResetDate = momentDay.format('YYYY-MM-DD');
		}
		
		arr.push(form)
		
		window.localStorage.setItem(HOMEWORK_KEY, JSON.stringify(arr));
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
		<div style={{ marginBottom: props.lastItem !== true ? '16px' : 0 }}>
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
		</div>
	)
}
