import PageTitle from '../component/common/PageTitle';
import {Alert, Button, Checkbox, Descriptions, Form, Input, Radio, Spin, Switch, Typography, InputNumber } from 'antd';
import {CustomCol, CustomRow} from '../component/common/element/CustomRowCol';
import React, {useEffect, useState} from 'react';
import {FlexBox} from '../component/common/element/FlexBox';
// import MaplestoryIOApi from '../../api/maplestory-io.api';
import useMapleFetch from '../../hooks/useMapleFetch';
import {getAllItems, getItem, getItemIcon} from '../../api/maplestory-io.api';
import styled, {css} from 'styled-components';
import {useRecoilValue} from 'recoil';
import {ThemeAtom} from '../../recoil/theme.atom';
import {BACKGROUND, HOVER} from '../../model/color.model';
import {cacheName, region, version} from '../../model/maplestory-io.model';
import AsyncCacheImage from '../component/common/element/AsyncCacheImage';
import {buildStats, getStarForceUpgradeInfo, isAvailableStarForce, isStarForceDown} from '../../util/equipment.util';
import {Equipment} from '../../model/equipment.model';
import Item from '../component/equipment-enhancement-simulator/Item';
import {numberComma} from '../../util/common.util';
import {CommonStyledSpan} from '../../model/style.model';
import {CloseOutlined} from '@ant-design/icons';

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

const SearchBoxWrapper = styled.div<{ theme: 'light' | 'dark', show: boolean }>`
	position: absolute;
	width: 50%;
	height: 50%;
	background-color: ${props => BACKGROUND(props.theme)};
	border: 1px solid rgba(140, 140, 140, 0.35);
	border-radius: 8px;
	padding: 1rem;
	display: flex;
	flex-direction: column;
	right: 0;
	opacity: 1;

	//@keyframes frames {
	//	from {
	//		opacity: 0;
	//		right: -50%;
	//	}
	//	to {
	//		opacity: 1;
	//		right: 0;
	//	}
	//}
	//
	//animation-name: frames;
	//animation-duration: .3s;
`

const SearchBox = styled.div<{ theme: 'light' | 'dark' }>`
	margin-top: .5rem;
	overflow-y: auto;
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
	const [showSearchItemBox, setShowSearchItemBox] = useState<boolean>(false);
	const [searchItemCount, setSearchItemCount] = useState<number>(defaultSearchItemCount);
	const [searchKeyword, setSearchKeyword] = useState<string>('');
	const [searchedItem, setSearchedItem] = useState<any[]>([]);
	const [searchItemTotal, setSearchItemTotal] = useState<number>(0);
	
	// default - 아케인셰이드 튜너
	const [selectedItemId, setSelectedItemId] = useState<string>('1213018');
	const [selectedFetchItem, error, isLoadingSelectedItem, fetchItem] = useMapleFetch({ apiURL: getItem, notFetchOnInit: true, singleValue: true })
	const [item, setItem] = useState<Equipment | undefined>(undefined);
	const [itemSpairMeso, setItemSpairMeso] = useState<number>(1000000000);
	const [mesoWon, setMesoWon] = useState<number>(2500);
	
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
			destroyed: false,
			isSuperiorItem: Object.hasOwn(selectedFetchItem.metaInfo, 'superiorEqp') && selectedFetchItem.metaInfo.superiorEqp === true,
			isAvailableStarForce: isAvailableStarForce(selectedFetchItem),
			category: selectedFetchItem.typeInfo.category,
			subCategory: selectedFetchItem.typeInfo.subCategory,
			stats: buildStats(selectedFetchItem.metaInfo),
			usedMeso: 0,
			destroyedCount: 0,
			spairMeso: itemSpairMeso,
			mesoWon: mesoWon
		})
	}
	
	const doStarForce = () => {
		
		if (item?.destroyed === true) {
			setItem((pv) => ({ ...pv!, starForce: item.isSuperiorItem ? 0 : 12, starForceFailCount: 0, usedMeso: pv!.usedMeso + pv!.spairMeso, destroyed: false }))
			return;
		}
		
		const info = getStarForceUpgradeInfo(item!);
		
		// 성공
		if (item!.starForceFailCount === 2 || Math.floor(Math.random() * 100) <= info.successPercentage) {
			setItem((pv) => ({ ...pv!, starForce: pv!.starForce + 1, starForceFailCount: 0, usedMeso: pv!.usedMeso + info.cost }))
			return;
		}
		
		// 파괴
		if (Math.floor(Math.random() * 100) <= info.destroyPercentage) {
			setItem((pv) => ({ ...pv!, starForce: 0, starForceFailCount: 0, usedMeso: pv!.usedMeso + info.cost, destroyedCount: pv!.destroyedCount + 1, destroyed: true }))
			return;
		}
		
		// 실패
		setItem((pv) => {
			if (isStarForceDown(pv!)) {
				return { ...pv!, starForce:  pv!.starForce - 1, starForceFailCount: (pv!.starForceFailCount ?? 0) + 1, usedMeso: pv!.usedMeso + info.cost }
			} else {
				return { ...pv!, starForce: pv!.starForce, starForceFailCount: pv!.starForceFailCount, usedMeso: pv!.usedMeso + info.cost }
			}
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
	
	useEffect(() => {
		if (item) {
			setItem((pv) => ({ ...pv!, mesoWon: mesoWon, spairMeso: itemSpairMeso }))
		}
	}, [mesoWon, itemSpairMeso])
	
	return (
		<>
			<PageTitle
				title={'장비강화 시뮬레이터'}
				marginBottom={'.5rem'}
				extraContents={
					<FlexBox alignItems={'center'} gap={'.5rem'}>
						<Button type={'primary'} onClick={() => setShowSearchItemBox(!showSearchItemBox)}>아이템 검색</Button>
						{/*<CommonStyledSpan fontSize={'14px'} fontWeight={'bold'}>아이템 검색</CommonStyledSpan>*/}
						{/*<Switch checked={showSearchItemBox} onChange={setShowSearchItemBox} />*/}
					</FlexBox>
				}
			/>
			{/*<Alert*/}
			{/*	message="PC 환경(사양)에 따라 결과 처리가 늦어질 수 있습니다."*/}
			{/*	type="warning"*/}
			{/*	showIcon*/}
			{/*	closable*/}
			{/*	style={{ marginBottom: '.5rem' }}*/}
			{/*/>*/}
			<CustomRow gutter={0}>
				
				<CustomCol span={16}>
					
					<div style={{ marginBottom: '1rem' }}>
						<Title level={5}>스타포스 옵션 세팅</Title>
					
						<div style={{ marginBottom: '.25rem' }}>스페어(노작) 가격</div>
						<InputNumber
							value={itemSpairMeso}
							formatter={value => numberComma(Number(value!))}
							parser={value => Number(value!.replaceAll(',', ''))}
							onChange={(value) => setItemSpairMeso(value ?? 0)}
							style={{ marginBottom: '1rem', width: '100%' }}
						/>
						
						<div style={{ marginBottom: '.25rem' }}>1억당 현금</div>
						<InputNumber
							value={mesoWon}
							formatter={value => numberComma(Number(value!))}
							parser={value => Number(value!.replaceAll(',', ''))}
							onChange={(value) => setMesoWon(value ?? 0)}
							style={{ marginBottom: '1rem', width: '100%' }}
						/>
					</div>
					
					
					<Title level={5}>스타포스 이벤트</Title>
					<Checkbox.Group
						options={eventOptions}
						style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}
						value={event}
						onChange={(e) => setEvent(e as number[]) }  />
					
					<FlexBox margin={'auto 0 0 0'} gap={'1rem'} justifyContent={'center'}>
						<Button type={'primary'} style={{ marginTop: 'auto', flexGrow: 1 }}>환생의 불꽃 강화</Button>
						<Button type={'primary'} disabled={!(item && item.isAvailableStarForce)} style={{ marginTop: 'auto', flexGrow: 1 }} onClick={() => doStarForce()}>
							{
								item?.destroyed === true
								? '아이템 복구'
								: '스타포스 강화'
							}
						</Button>
					</FlexBox>
					
					{
						showSearchItemBox
						?
							<SearchBoxWrapper theme={theme} show={showSearchItemBox}>
								<FlexBox justifyContent={'space-between'} alignItems={'center'}>
									<Title level={5}>아이템 검색</Title>
									<Radio.Group onChange={(e) => setSearchSort(e.target.value)} value={searchSort}>
										<Radio value={'LEVEL'}>레벨순 정렬</Radio>
										<Radio value={'NAME'}>이름순 정렬</Radio>
									</Radio.Group>
								</FlexBox>
								
								<Input autoFocus placeholder={'아이템 이름을 입력해주세요.'} value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} style={{ marginTop: '.5rem' }} />
								
								{
									searchKeyword && searchedItem.length > 0
										?
										<SearchBox theme={theme}>
											<FlexBox flexDirection={'column'} gap={'.5rem'}>
												{
													searchedItem.map((item: any) =>
														<SearchBoxItem key={item.id} theme={theme} onClick={() => {
															setSelectedItemId(item.id);
															setSearchKeyword('');
															setShowSearchItemBox(false)
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
										: <></>
								}
							</SearchBoxWrapper>
						:
							<></>
					}
					
				</CustomCol>
				
				<CustomCol span={8}>
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
