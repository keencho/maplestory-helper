import PageTitle from '../component/common/PageTitle';
import {Alert, Button, Checkbox, Input, Radio, Typography} from 'antd';
import {CustomCol, CustomRow} from '../component/common/element/CustomRowCol';
import React, {useEffect, useState} from 'react';
import {FlexBox} from '../component/common/element/FlexBox';
// import MaplestoryIOApi from '../../api/maplestory-io.api';
import useMapleFetch from '../../hooks/useMapleFetch';
import {getAllItems, getItemIcon} from '../../api/maplestory-io.api';
import styled from 'styled-components';
import {useRecoilValue} from 'recoil';
import {ThemeAtom} from '../../recoil/theme.atom';
import {BACKGROUND, HOVER} from '../../model/color.model';
import {doCacheFetch} from '../../util/fetch.util';
import {cacheName, region, version} from '../../model/maplestory-io.model';

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

const SearchBox = styled.div<{ theme: 'light' | 'dark' }>`
		border: 1px solid rgba(140, 140, 140, 0.35);
		max-height: 250px;
		overflow-y: auto;
		position: absolute;
		width: 100%;
		background-color: ${props => BACKGROUND(props.theme)};
	`

const SearchBoxItem = styled.div<{ theme: 'light' | 'dark' }>`
		cursor: pointer;
		padding: .25rem 1rem;
		
		&:hover {
			background-color: ${props => HOVER(props.theme)};
		}
	`

export const StarForceSimulatorContainer = ({ items } : { items: any }) => {
	
	const theme = useRecoilValue(ThemeAtom);
	
	const [event, setEvent] = useState<number[]>([]);
	const [searchSort, setSearchSort] = useState<'NAME' | 'LEVEL'>('LEVEL');
	
	const defaultSearchItemCount = 20;
	const [searchItemCount, setSearchItemCount] = useState<number>(defaultSearchItemCount);
	const [searchKeyword, setSearchKeyword] = useState<string>('나이트');
	const [searchedItem, setSearchedItem] = useState<any[]>([]);
	const [searchItemTotal, setSearchItemTotal] = useState<number>(0);
	
	const searchItem = async(keyword: string) => {
		if (!keyword) {
			setSearchedItem([]);
			return;
		}
		
		const filteredData = items
			.filter((item: any) => item.name.includes(keyword))
			.sort((a: any, b: any) => {
				if (searchSort === 'NAME') {
					return a.name > b.name ? 1 : -1;
				}
				
				return b.requiredLevel - a.requiredLevel
			});
		
		setSearchItemTotal(filteredData.length);
		
		setSearchedItem(
			await Promise.all(
				filteredData
					.slice(0, searchItemCount)
					.map(async (item: any) => { return { ...item, imageUrl: await doCacheFetch(getItemIcon(region, version, item.id), cacheName) } })
			)
		);
	}
	
	useEffect(() => {
		if (defaultSearchItemCount === searchItemCount) {
			searchItem(searchKeyword);
		} else {
			setSearchItemCount(defaultSearchItemCount);
		}
	}, [searchKeyword])
	
	useEffect(() => {
		searchItem(searchKeyword);
	}, [searchItemCount, searchSort]);
	
	useEffect(() => {
		console.log(searchItemTotal);
	}, [searchItemTotal])
	
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
							<Radio value={'LEVEL'}>레벨순 정렬</Radio>
							<Radio value={'NAME'}>이름순 정렬</Radio>
						</Radio.Group>
					</FlexBox>
					
					<Input placeholder={'아이템 이름을 입력해주세요.'} value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
					
					{
						searchKeyword && searchedItem.length > 0
						?
							<div style={{ position: 'relative' }}>
								<SearchBox theme={theme}>
									<FlexBox flexDirection={'column'} gap={'.5rem'}>
										{
											searchedItem.map((item: any) =>
												<SearchBoxItem key={item.id} theme={theme}>
													<FlexBox alignItems={'center'} gap={'.75rem'}>
														<img src={item.imageUrl}  alt={item.name} style={{ width: '25px' }} />
														<span>{item.name}</span>
														<span style={{ marginLeft: 'auto' }}>{item.requiredLevel} lv</span>
													</FlexBox>
												</SearchBoxItem>
											)
										}
										{
											searchedItem.length < searchItemTotal
											?
												<Button type='primary' style={{ borderRadius: 0 }} onClick={() => setSearchItemCount(searchItemCount + defaultSearchItemCount)}>더보기</Button>
											:
												<></>
										}
									</FlexBox>
								</SearchBox>
							</div>
						: <></>
					}
					
				</CustomCol>
			</CustomRow>
		</>
	)
}
