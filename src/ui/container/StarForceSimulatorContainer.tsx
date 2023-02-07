import PageTitle from '../component/common/PageTitle';
import {Alert, Checkbox, Input, Radio, Typography} from 'antd';
import {CustomCol, CustomRow} from '../component/common/element/CustomRowCol';
import React, {useEffect, useState} from 'react';
import {FlexBox} from '../component/common/element/FlexBox';
// import MaplestoryIOApi from '../../api/maplestory-io.api';
import useMapleFetch from '../../hooks/useMapleFetch';
import {getAllItems, getItemIcon} from '../../api/maplestory-io.api';
import styled from 'styled-components';
import {BACKGROUND, HOVER} from '../../model/color.model';

const { Title } = Typography;

export const StarForceSimulatorContainerWrapper = () => {
	
	const [items, errors, isLoading] = useMapleFetch({
		apiURL: getAllItems,
		filter: (data: any) => data
			.filter((item: any) => item.name && item.requiredLevel)
			.filter(function(this: any, item: any) {
				return !this.has(item.name) && this.add(item.name)
			}, new Set)
	});
	
	if (items.length === 0) {
		return <></>
	}
	
	return <StarForceSimulatorContainer items={items} />
}

const eventOptions = [
	{ label: '10성 이하 1+1 강화', value: 0 },
	{ label: '강화비용 30% 할인', value: 1 },
	{ label: '5, 10, 15성에서 강화시 성공확률 100%', value: 2 },
];

const data = [
	{
		title: 'Ant Design Title 1',
	},
	{
		title: 'Ant Design Title 2',
	},
	{
		title: 'Ant Design Title 3',
	},
	{
		title: 'Ant Design Title 4',
	},
];

export const StarForceSimulatorContainer = ({ items } : { items: any }) => {
	
	const [data, error, isLoading, fetchIcon] = useMapleFetch({ apiURL: getItemIcon, notFireOnInit: true  })
	const [event, setEvent] = useState<number[]>([]);
	const [searchSort, setSearchSort] = useState<'NAME' | 'LEVEL'>('NAME');
	const [searchKeyword, setSearchKeyword] = useState<string>('아케인셰이드 나이트');
	const [searchedItem, setSearchedItem] = useState<any[]>([]);
	
	const searchItem = async(keyword: string) => {
		if (!keyword) {
			setSearchedItem([]);
			return;
		}
		
		const item = items
			.filter((item: any) => item.name.includes(keyword))
			.sort((a: any, b: any) => {
				if (searchSort === 'NAME') {
					return a.name > b.name ? 1 : -1;
				}
				
				return b.requiredLevel - a.requiredLevel
			})
		
		setSearchedItem(item);
	}
	
	useEffect(() => {
		searchItem(searchKeyword);
	}, [searchKeyword, searchSort]);
	
	return (
		<>
			<PageTitle
				title={'스타포스 시뮬레이터'}
				marginBottom={'.5rem'}
			/>
			<Alert
				message="PC 환경(사양)에 따라 결과 처리가 늦어질 수 있습니다."
				type="warning"
				showIcon
				closable
				style={{ marginBottom: '.5rem' }}
			/>
			<CustomRow gutter={32}>
				<CustomCol span={15}>
					<Title level={5}>스타포스 이벤트</Title>
					<Checkbox.Group
						options={eventOptions}
						style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}
						value={event}
						onChange={(e) => setEvent(e as number[]) }  />
				</CustomCol>
				<CustomCol span={9}>
					<FlexBox justifyContent={'space-between'} alignItems={'center'}>
						<Title level={5}>아이템 검색</Title>
						<Radio.Group onChange={(e) => setSearchSort(e.target.value)} value={searchSort}>
							<Radio value={'NAME'}>이름순 정렬</Radio>
							<Radio value={'LEVEL'}>레벨순 정렬</Radio>
						</Radio.Group>
					</FlexBox>
					
					<Input value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
					
					{
						searchKeyword && searchedItem.length > 0
						?
							<div style={{ position: 'relative' }}>
								<SearchBox>
									<FlexBox flexDirection={'column'} gap={'.5rem'}>
										{searchedItem.map((item: any) =>
											<SearchBoxItem
												key={item.id}
												style={{ cursor: 'pointer' }}
											>
												{/*<img src={fetchIcon(item.id)}  alt={''}/>*/}
												{item.name} ({item.requiredLevel} lv)
											</SearchBoxItem>)}
									</FlexBox>
								</SearchBox>
							</div>
						: <></>
					}
					dd
				</CustomCol>
			</CustomRow>
		</>
	)
}

const SearchBox = styled.div`
	border: 1px solid rgba(140, 140, 140, 0.35);
	max-height: 250px;
	overflow-y: auto;
	position: absolute;
	width: 100%;
	background-color: ${BACKGROUND};
`

const SearchBoxItem = styled.div`
	padding: .25rem 1rem;
	
	&:hover {
		background-color: ${HOVER};
	}
`
