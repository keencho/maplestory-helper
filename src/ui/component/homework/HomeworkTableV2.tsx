import React from 'react';
import {Data, HomeworkTabData, Table as TableInterface} from '../../container/HomeworkContainerV2';
import styled from 'styled-components';
import NoMarginHeading from '../common/element/NoMarginHeading';
import {Button, Progress} from 'antd';
import Color from '../../../model/color.model';
import {ResetButton} from '../common/element/ResetButton';

const Table = styled.table`
	border-collapse: collapse;
	
	&:not(:last-child) {
		margin-bottom: 16px;
	}
	
	tbody {
		text-align: center;
		
		th, tr, td {
			border: 1px solid;
		}
		
		&:before {
			line-height: .25em;
			content: "\\00a0";
			color: inherit; /* background color */
			display:block;
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

interface Props extends HomeworkTabData {
	onClickRow: (key: keyof Data, title: string, indexOfRow: number) => any
	reset: (title: string) => any
}

const HomeworkTableV2 = (props: Props): JSX.Element => {
	
	const getElementByKey = (key: keyof Data, table: TableInterface): JSX.Element[] => {
		
		const mapping = (data: Data, idx: number) => {
			switch (key) {
				case 'use':
					if (data.use) {
						return (
							<td style={{ backgroundColor: Color.BLUE }} key={idx}>
								<ResetButton fullWidth={true} onClick={() => props.onClickRow(key, table.title, idx)}>O</ResetButton>
							</td>
						)
					}
					
					return (
						<td style={{ backgroundColor: Color.RED }} key={idx}>
							<ResetButton fullWidth={true} onClick={() => props.onClickRow(key, table.title, idx)}>X</ResetButton>
						</td>
					)
				case 'name':
					return <td key={idx}>{data.name}</td>
				case 'src':
					if (!data.use) {
						return <td key={idx}><img src={data.src} alt={data.name} /></td>
					}
					
					return (
						<td key={idx} style={{ backgroundColor: data.doWork ? Color.BLUE : 'inherit' }}>
							<ResetButton fullWidth={true} onClick={() => props.onClickRow(key, table.title, idx)}>
								<img src={data.src} alt={data.name} />
							</ResetButton>
						</td>
					)
				default:
					return <></>
			}
		}
		
		return table.data.map(mapping);
	}
	
	const calculateRate = (data: Data[]): number => {
		let use = 0;
		let doWork = 0;
		
		data.forEach((dt: Data) => {
			if (dt.use) use++;
			if (dt.doWork) doWork++;
		})
		
		return Number(((doWork / use) * 100).toFixed(0));
	}
	
	return (
		<>
			{
				props.table.map(table => {
					return (
						<Table key={table.title}>
							<thead>
							<tr>
								<td colSpan={table && table.data.length - 1}>
									<NoMarginHeading size={3}>{table.title}</NoMarginHeading>
								</td>
								<td style={{ textAlign: 'right' }}><Button size={'small'} type={'primary'} danger onClick={() => props.reset(table.title)}>초기화</Button></td>
							</tr>
							</thead>
							<tbody>
							<tr>
								{getElementByKey('use', table)}
							</tr>
							<tr>
								{getElementByKey('name', table)}
							</tr>
							<tr>
								{getElementByKey('src', table)}
							</tr>
							<tr>
								<td colSpan={1}>달성률</td>
								<td colSpan={table && table.data.length - 1} style={{ padding: '0 16px' }}>
									<Progress percent={calculateRate(table.data)} strokeColor={Color.BLUE} status={'normal'} />
								</td>
							</tr>
							</tbody>
						</Table>
					)
				})
			}
		</>
	)
}

export default HomeworkTableV2