import PageTitle from '../component/common/PageTitle';
import {Button, Checkbox, Input, InputNumber, Radio, Result, Spin, Switch, Typography} from 'antd';
import {CustomCol, CustomRow} from '../component/common/element/CustomRowCol';
import React, {useEffect, useRef, useState} from 'react';
import {FlexBox} from '../component/common/element/FlexBox';
import useMapleFetch from '../../hooks/useMapleFetch';
import {getAllItems, getItem, getItemIcon} from '../../api/maplestory-io.api';
import styled from 'styled-components';
import {useRecoilValue} from 'recoil';
import {ThemeAtom} from '../../recoil/theme.atom';
import {BACKGROUND, HOVER} from '../../model/color.model';
import {cacheName, region, version} from '../../model/maplestory-io.model';
import AsyncCacheImage from '../component/common/element/AsyncCacheImage';
import {buildStats, isAvailableStarForce} from '../../util/equipment.util';
import {Equipment, StarForceEventType} from '../../model/equipment.model';
import Item from '../component/equipment-enhancement-simulator/Item';
import {numberComma} from '../../util/common.util';
import NotificationUtil from '../../util/notification.util';
import {starForceSimulationWorker} from '../../workers/starforceSimulationWorker'
import {doStarForce} from '../../util/starforce-util';
import Simulation from '../component/equipment-enhancement-simulator/Simulation';

const { Title } = Typography;

const LoadingBox = styled(FlexBox)`
	width: 100%;
	height: 100%;
	align-items: center;
	justify-content: center;
`

export const EquipmentEnhancementSimulatorWrapper = () => {
	
	const [items, errors, isLoading] = useMapleFetch({
		apiURL: getAllItems,
		filter: (data: any) => data
			.filter((item: any) => item.name && item.requiredLevel)
			.filter(function(this: any, item: any) {
				return !this.has(item.name) && this.add(item.name)
			}, new Set)
	});
	
	if (isLoading) {
		return (
			<LoadingBox>
				<Spin size={'large'} tip={'로딩중 입니다...'} />
			</LoadingBox>
		)
	}
	
	if (errors) {
		return (
			<LoadingBox>
				<Result
					status="500"
					title="에러"
					subTitle="데이터를 불러오는데 실패하였습니다."
					extra={<Button type="primary" onClick={() => location.reload()}>새로고침</Button>}
				/>
			</LoadingBox>
		)
	}
	
	if (items.length == 0) {
		return <></>
	}
	
	return <EquipmentEnhancementSimulator items={items} />
}

const eventOptions: { label: string, value: StarForceEventType }[] = [
	{ label: '10성 이하 1+1 강화', value: StarForceEventType.ONE_PLUS_ONE },
	{ label: '강화비용 30% 할인', value: StarForceEventType.DISCOUNT_30 },
	{ label: '5, 10, 15성에서 강화시 성공확률 100%', value: StarForceEventType.PERCENTAGE_100 },
];

export const EquipmentEnhancementSimulator = ({ items } : { items: any }) => {
	
	const theme = useRecoilValue(ThemeAtom);
	const starForceSimulationNumber = 10000;
	
	const [rightComponentType, setRightComponentType] = useState<'ITEM' | 'STARFORCE_SIMULATION'>('ITEM');
	const [event, setEvent] = useState<StarForceEventType[]>([]);
	const [searchSort, setSearchSort] = useState<'NAME' | 'LEVEL'>('LEVEL');
	const [autoStarForce, setAutoStarForce] = useState<boolean>(false);
	const [autoStarForceRunning, setAutoStarForceRunning] = useState<boolean>(false);
	const [autoStarForceTargetStar, setAutoStarForceTargetStar] = useState<number>(22);
	const autoStarForceRef = useRef<NodeJS.Timeout | null>(null);
	
	const [starForceSimulationRunning, setStarForceSimulationRunning] = useState<boolean>(false);
	const [starForceSimulationPercentage, setStarForceSimulationPercentage] = useState<number>(0);
	const [starForceSimulationResult, setStarForceSimulationResult] = useState<Equipment[]>([]);
	
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
	const [itemSpairMeso, setItemSpairMeso] = useState<number>(100000000);
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
	
	const initBasicItem = (): Equipment => {
		return {
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
		}
	}
	
	const initItem = () => {
		setItem(initBasicItem())
	}
	
	const resetItem = () => {
		if (autoStarForceRunning) {
			stopAutoStarForceRunning()
		}
		initItem()
		NotificationUtil.fire('success', '아이템이 초기화 되었습니다.');
	}
	
	const stopAutoStarForceRunning = () => {
		if (autoStarForceRunning) {
			setAutoStarForceRunning(false);
		}
		
		if (autoStarForceRef.current) {
			clearTimeout(autoStarForceRef.current)
		}
	}
	
	const onClickStarForce = () => {
		if (autoStarForce) {
			if (item!.starForce >= autoStarForceTargetStar) {
				NotificationUtil.fire('error', '자동강화 불가', '목표 스타포스를 조정하거나 아이템을 초기화 해 주세요.')
				return;
			}
			setAutoStarForceRunning(true);
		} else {
			doStarForceOnCurrentItem();
		}
	}
	
	const doStarForceSimulating = () => {
		setStarForceSimulationRunning(true);
		setStarForceSimulationPercentage(0);
		setRightComponentType('STARFORCE_SIMULATION');
		starForceSimulationWorker.postMessage({ item: initBasicItem(), simulationNumber: starForceSimulationNumber, targetStarForce: autoStarForceTargetStar })
	}
	
	const doStarForceOnCurrentItem = () => {
		setItem(pv => doStarForce(pv!, event));
	}
	
	//////////////////////////////////////////////////////////////////////////////////////////////
	
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
	
	useEffect(() => {
		if (item && autoStarForceRunning) {
			if (item.starForce < autoStarForceTargetStar) {
				autoStarForceRef.current = setTimeout(doStarForceOnCurrentItem, 25);
			} else {
				NotificationUtil.fire('success', '강화 완료', `${autoStarForceTargetStar}성 강화가 완료되었습니다.`)
				stopAutoStarForceRunning();
			}
		}
	}, [autoStarForceRunning, item])
	
	useEffect(() => {
		
		starForceSimulationWorker.onmessage = ({ data }: { data: Equipment[] | number }) => {
			// 시뮬레이션 끝났음을 의미
			if (Array.isArray(data)) {
				setStarForceSimulationRunning(false);
				setStarForceSimulationPercentage(0);
				setStarForceSimulationResult(data);
			} else {
				setStarForceSimulationPercentage(data);
			}
			
		};
		
		return () => {
			stopAutoStarForceRunning();
		}
	}, []);
	
	useEffect(() => {
		const map = starForceSimulationResult
				.map(it => {
				if (it) {
					return {
						destroyedCount: it.destroyedCount,
						usedMeso: it.usedMeso
					}
				}
				
				return undefined;
			})
			.filter(it => it !== undefined)
			.sort((a, b) => a?.usedMeso! - b?.usedMeso!)
		
		console.log(map);
	}, [starForceSimulationResult])
	
	return (
		<>
			<PageTitle
				title={'장비강화 시뮬레이터'}
				marginBottom={'.5rem'}
				extraContents={
					<FlexBox alignItems={'center'} gap={'.5rem'}>
						<Button type={'primary'} disabled={autoStarForceRunning} onClick={() => setShowSearchItemBox(!showSearchItemBox)}>아이템 검색</Button>
						<Button type={'primary'} onClick={resetItem}>아이템 초기화</Button>
						<Switch checked={rightComponentType === 'ITEM'} onChange={(checked) => {setRightComponentType(checked ? 'ITEM' : 'STARFORCE_SIMULATION')}} />
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
				
				{/* 왼쪽 */}
				<CustomCol span={16}>
					<CustomRow gutter={0}>
						
						{/* 왼쪽 위 - 스타포스 */}
						<CustomCol span={24} height={'50%'}>
							<Title level={4}>스타포스</Title>
							<FlexBox width={'100%'} gap={'1rem'}>
								<FlexBox flex={1} flexDirection={'column'}>
									<Title level={5}>이벤트</Title>
									<Checkbox.Group
										options={eventOptions}
										style={{ display: 'flex', flexDirection: 'column', gap: '.5rem' }}
										value={event}
										onChange={(e) => setEvent(e as StarForceEventType[]) }
										disabled={autoStarForceRunning || starForceSimulationRunning}
									/>
								</FlexBox>
								<FlexBox flex={1} flexDirection={'column'}>
									<Title level={5}>스페어(노작) 메소</Title>
									<InputNumber
										value={itemSpairMeso}
										formatter={value => numberComma(Number(value!))}
										parser={value => Number(value!.replaceAll(',', ''))}
										onChange={(value) => setItemSpairMeso(value ?? 0)}
										style={{ marginBottom: '1rem', width: '100%' }}
										disabled={autoStarForceRunning || starForceSimulationRunning}
									/>
									<Title level={5}>1억당 현금</Title>
									<InputNumber
										value={mesoWon}
										formatter={value => numberComma(Number(value!))}
										parser={value => Number(value!.replaceAll(',', ''))}
										onChange={(value) => setMesoWon(value ?? 0)}
										style={{ marginBottom: '1rem', width: '100%' }}
										disabled={autoStarForceRunning || starForceSimulationRunning}
									/>
								</FlexBox>
								<FlexBox flex={1} flexDirection={'column'}>
									<Title level={5}>목표 스타포스</Title>
									<InputNumber
										value={autoStarForceTargetStar}
										onChange={(value) => setAutoStarForceTargetStar(value ?? 0)}
										style={{ marginBottom: '1rem', width: '100%' }}
										min={1}
										max={25}
										disabled={autoStarForceRunning || starForceSimulationRunning}
									/>
									
									<Title level={5}>자동강화</Title>
									<Checkbox
										onChange={(e) => setAutoStarForce(e.target.checked)}
										checked={autoStarForce}
										disabled={autoStarForceRunning || starForceSimulationRunning}
									>
										활성화
									</Checkbox>
								</FlexBox>
							</FlexBox>
							
							<FlexBox gap={'1rem'} justifyContent={'center'} margin={'auto 0 0 0'}>
								<FlexBox width={'50%'} gap={'1rem'}>
									
									<Button type={'primary'} disabled={!(item && item.isAvailableStarForce) || starForceSimulationRunning} style={{ flex: 1 }} onClick={autoStarForceRunning ? stopAutoStarForceRunning : onClickStarForce}>
										{
											autoStarForceRunning
											?
												'자동강화 멈추기'
											:
												item?.destroyed === true
													? '복구'
													: '강화'
										}
									</Button>
									<Button type={'primary'} style={{ flex: 1 }} onClick={doStarForceSimulating} disabled={autoStarForceRunning}>
										{
											starForceSimulationRunning
											? '시뮬레이션 멈추기'
											: '시뮬레이션'
										}
									</Button>
								</FlexBox>
							</FlexBox>
							
						</CustomCol>
						
						{/* 왼쪽 아래 - 잠재, 환불 (?) */}
						<CustomCol span={24} height={'50%'}>
						
						</CustomCol>
					</CustomRow>
					
					{/* 아이템 검색 박스 */}
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
				
				{/* 오른쪽 */}
				<CustomCol span={8}>
					<FlexBox alignItems={'center'} justifyContent={'center'} flex={1} flexDirection={'column'}>
						{
							isLoadingSelectedItem
							?
								<Spin tip="아이템을 불러오는 중입니다..." size={'large'} />
							:
								rightComponentType === 'ITEM'
									?
									<Item
										item={item}
										isAutoRunning={autoStarForceRunning}
										event={event}
									/>
									:
									<Simulation
										simulationNumber={starForceSimulationNumber}
										progressRate={starForceSimulationPercentage}
										simulationResult={starForceSimulationResult}
									/>
						}
					</FlexBox>
				</CustomCol>
				
			</CustomRow>
		</>
	)
}

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
