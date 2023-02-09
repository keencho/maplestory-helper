import PageTitle from '../component/common/PageTitle';
import {Alert, Button, Checkbox, Input, Radio, Spin, Typography} from 'antd';
import {CustomCol, CustomRow} from '../component/common/element/CustomRowCol';
import React, {useEffect, useState} from 'react';
import {FlexBox} from '../component/common/element/FlexBox';
// import MaplestoryIOApi from '../../api/maplestory-io.api';
import useMapleFetch from '../../hooks/useMapleFetch';
import {getAllItems, getItem, getItemIcon} from '../../api/maplestory-io.api';
import styled from 'styled-components';
import {useRecoilValue} from 'recoil';
import {ThemeAtom} from '../../recoil/theme.atom';
import {BACKGROUND, HOVER} from '../../model/color.model';
import {cacheName, region, version} from '../../model/maplestory-io.model';
import AsyncCacheImage from '../component/common/element/AsyncCacheImage';
import {buildStats, isAvailableStarForce} from '../../util/equipment.util';
import {Equipment} from '../../model/equipment.model';
import Item from '../component/equipment-enhancement-simulator/Item';

const { Title } = Typography;

export const EquipmentEnhancementSimulatorWrapper = () => {
	
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
	
	return <EquipmentEnhancementSimulator items={items} />
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
	padding: .25rem .5rem;
	&:not(:last-child) {
		border-bottom: 1px solid rgba(140, 140, 140, 0.35);
	}
	
	
	&:hover {
		background-color: ${props => HOVER(props.theme)};
	}
`

export const EquipmentEnhancementSimulator = ({ items } : { items: any }) => {
	
	const theme = useRecoilValue(ThemeAtom);
	
	const [event, setEvent] = useState<number[]>([]);
	const [searchSort, setSearchSort] = useState<'NAME' | 'LEVEL'>('LEVEL');
	
	const defaultSearchItemCount = 20;
	const [searchItemCount, setSearchItemCount] = useState<number>(defaultSearchItemCount);
	const [searchKeyword, setSearchKeyword] = useState<string>('');
	const [searchedItem, setSearchedItem] = useState<any[]>([]);
	const [searchItemTotal, setSearchItemTotal] = useState<number>(0);
	
	// default - 아케인셰이드 튜너
	const [selectedItemId, setSelectedItemId] = useState<string>('1213018');
	const [selectedFetchItem, error, isLoadingSelectedItem, fetchItem] = useMapleFetch({ apiURL: getItem, notFetchOnInit: true, singleValue: true })
	const [item, setItem] = useState<Equipment | undefined>(undefined);
	
	const searchItem = async(keyword: string) => {
		if (!keyword) {
			setSearchedItem([]);
			return;
		}
		
		let filteredData = items
			.filter((item: any) => item.name.includes(keyword))
			.sort((a: any, b: any) => {
				if (searchSort === 'NAME') {
					return a.name > b.name ? 1 : -1;
				}
				
				return b.requiredLevel - a.requiredLevel
			});
		
		setSearchItemTotal(filteredData.length);
		
		setSearchedItem(filteredData.slice(0, searchItemCount));
	}
	
	const initItem = () => {
		setItem({
			itemName: selectedFetchItem.description.name,
			level: selectedFetchItem.metaInfo.reqLevel,
			base64Icon: `data:image/png;base64,${selectedFetchItem.metaInfo.iconRaw}`,
			starForce: 0,
			isSuperiorItem: Object.hasOwn(selectedFetchItem.metaInfo, 'superiorEqp') && selectedFetchItem.metaInfo.superiorEqp === true,
			isAvailableStarforce: isAvailableStarForce(selectedFetchItem),
			category: selectedFetchItem.typeInfo.category,
			subCategory: selectedFetchItem.typeInfo.subCategory,
			stats: buildStats(selectedFetchItem.metaInfo)
		})
	}
	
	///////////////////////////////////////////////////////////////////////////////////////////////
	
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
		if (selectedItemId) {
			fetchItem(selectedItemId)
		}
	}, [selectedItemId])
	
	useEffect(() => {
		if (selectedFetchItem) {
			initItem()
		}
	}, [selectedFetchItem])
	
	return (
		<>
			<PageTitle
				title={'장비강화 시뮬레이터'}
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
					
					{/*임시*/}
					{
						selectedFetchItem && <pre style={{ marginTop: '1rem', border: '1px solid blue' }}>{JSON.stringify(
							Object.keys(selectedFetchItem.metaInfo)
								.filter(key => !key.includes('icon'))
								.reduce((obj: any, key: any)=> {
									obj[key] = selectedFetchItem.metaInfo[key];
									return obj;
								}, {}),
							undefined,
							2)}</pre>
					}
					
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
												<SearchBoxItem key={item.id} theme={theme} onClick={() => {
													setSelectedItemId(item.id);
													setSearchKeyword('');
												}}>
													<FlexBox alignItems={'center'} gap={'.75rem'}>
														<AsyncCacheImage src={getItemIcon(region, version, item.id)} cacheName={cacheName} alt={item.name} style={{ width: '30px' }} />
														<span>{item.name}</span>
														<span style={{ marginLeft: 'auto' }}>{item.requiredLevel} lv</span>
													</FlexBox>
												</SearchBoxItem>
											)
										}
										{
											searchedItem.length < searchItemTotal
											? <Button type='primary' style={{ borderRadius: 0 }} onClick={() => setSearchItemCount(searchItemCount + defaultSearchItemCount)}>더보기</Button>
											: <></>
										}
									</FlexBox>
								</SearchBox>
							</div>
						: <></>
					}
					<FlexBox alignItems={'center'} justifyContent={'center'} flex={1} flexDirection={'column'}>
					{
						isLoadingSelectedItem
						?
							<Spin tip="아이템을 불러오는 중입니다..." size={'large'} />
						:
							<Item item={item} />
					}
					</FlexBox>
				</CustomCol>
			</CustomRow>
		</>
	)
}
