import {FlexBox} from '../common/element/FlexBox';
import {Alert, Button, Spin, Typography} from 'antd';
import {
	getMaxStarForce,
	getStarForceUpgradeInfo,
	getSubCategoryName,
	isSubWeapon,
	isWeapon
} from '../../../util/equipment.util';
import {
	Equipment,
	equipmentCategoryName,
	equipmentOptionName,
	StarForceEventType
} from '../../../model/equipment.model';
import React, {useEffect} from 'react';
import styled from 'styled-components';
import {StarFilled, StarOutlined} from '@ant-design/icons';
import {numberComma} from '../../../util/common.util';
import {BLUE, RED} from '../../../model/color.model';

const { Title } = Typography;

const ItemStatsBox = styled(FlexBox)`
	justify-content: space-between;

	&:not(:last-child) {
		margin-bottom: .5rem;
	}
`

const ItemStatsText = styled.span`
	font-size: 1rem;
	font-weight: bold;
`

const StarForce = styled.div`
	margin-bottom: 1rem;
	text-align: center;
`

const SummaryBox = styled.div`
	display: flex;
	gap: .5rem;
	margin-bottom: 1rem;
	width: 100%;

	div {
		flex: 1
	}
`

const SummaryItem = styled.div`
	display: flex;
	flex-direction: column;
	border: 1px solid rgba(140, 140, 140, 0.35);
	border-radius: 4px;
	padding: .25rem 1rem;

	span {
		font-size: 20px;
	}
	justify-content: center;
	align-items: center;
`

type Props = {
	item: Equipment | undefined
	isAutoRunning: boolean
	event: StarForceEventType[]
}

const Item = ({ item, isAutoRunning, event }: Props) => {
	
	if (!item) return <></>;
	
	const starForceUpgradeInfo = getStarForceUpgradeInfo(item, event)
	
	const getStarForceElement = (): JSX.Element => {
		if (!item.isAvailableStarForce) return <></>
		if (item.destroyed) return <></>
		
		const arr: JSX.Element[] = [];
		
		for (let i = 1; i <= getMaxStarForce(item.level, item.isSuperiorItem); i ++) {
			
			const style: React.CSSProperties = {
				fontSize: '15px',
				color: '#FFAA00',
			}
			
			if (i % 5 === 1) {
				style.marginLeft = '1rem';
			}
			
			if (i === 16) {
				arr.push(<div style={{ marginTop: '.25rem' }} key={'divider'} />)
			}
			
			if (i <= item.starForce) {
				arr.push(<StarFilled style={style} key={i} />)
			} else {
				arr.push(<StarOutlined style={style} key={i} />)
			}
		}
		
		return <StarForce>{arr}</StarForce>
	}
	
	return (
		<FlexBox flexDirection={'column'} alignItems={'center'} justifyContent={'center'} flex={1}>
			{
				item.isAvailableStarForce === true
					?
					<>
						<SummaryBox>
							<SummaryItem>
								<span style={{ fontWeight: 'bold' }}>누적메소</span>
								<span>{numberComma(item.usedMeso)}</span>
							</SummaryItem>
							
							<SummaryItem>
								<span style={{ fontWeight: 'bold' }}>현금</span>
								<span>{numberComma(Number((item.mesoWon / 100000000 * item.usedMeso).toFixed(0)))}</span>
							</SummaryItem>
							
							<SummaryItem>
								<span style={{ fontWeight: 'bold', color: RED }}>파괴 횟수</span>
								<span style={{ color: RED }}>{numberComma(item.destroyedCount)}</span>
							</SummaryItem>
						</SummaryBox>
						{
							item.destroyed === true
								? <></>
								:
								<SummaryBox>
									<SummaryItem>
										<span style={{ fontWeight: 'bold' }}>강화비용</span>
										<span>{numberComma(starForceUpgradeInfo.cost)}</span>
									</SummaryItem>
									
									<SummaryItem>
										<span style={{ fontWeight: 'bold', color: BLUE }}>성공확률</span>
										<span style={{ color: BLUE }}>{numberComma(starForceUpgradeInfo.successPercentage)}%</span>
									</SummaryItem>
									
									<SummaryItem>
										<span style={{ fontWeight: 'bold', color: RED }}>파괴확률</span>
										<span style={{ color: RED }}>{numberComma(starForceUpgradeInfo.destroyPercentage)}%</span>
									</SummaryItem>
									
								</SummaryBox>
						}
					</>
					:
					<></>
			}
			
			<div style={{ width: '100%', textAlign: 'center' }}>
				<Spin spinning={isAutoRunning} size={'large'} tip={'자동강화가 진행 중입니다.'}>
					{getStarForceElement()}
					<Title level={3}>{item.itemName} {item.destroyed ? '(파괴됨)' : ''}</Title>
					<img src={item.base64Icon} style={{ width: '80px', filter: item.destroyed ? 'grayscale(95%) drop-shadow(black 0px 0px 0.1rem)' : '' }} alt={item.itemName} />
					<div style={{ width: '100%', marginTop: '2rem' }}>
						{
							isWeapon(item.category)
								?
								<ItemStatsBox>
									<ItemStatsText>무기분류</ItemStatsText>
									<ItemStatsText>{getSubCategoryName(item.subCategory)} ({equipmentCategoryName[item.category]})</ItemStatsText>
								</ItemStatsBox>
								:
								<ItemStatsBox>
									<ItemStatsText>장비분류</ItemStatsText>
									<ItemStatsText>
										{
											isSubWeapon(item.category)
												? `보조무기 (${getSubCategoryName(item.subCategory)})`
												: getSubCategoryName(item.subCategory)
										}
									</ItemStatsText>
								</ItemStatsBox>
						}
						<ItemStatsBox>
							<ItemStatsText>요구레벨</ItemStatsText>
							<ItemStatsText>{item.level}</ItemStatsText>
						</ItemStatsBox>
						{
							item.stats.map(stat =>
								<ItemStatsBox key={stat.key}>
									<ItemStatsText>{equipmentOptionName[stat.key]}</ItemStatsText>
									<ItemStatsText>{stat.value} {stat.key === 'IGNORE_DEFENSE' || stat.key === 'BOSS_DAMAGE' || stat.key === 'DAMAGE' ? '%' : ''}</ItemStatsText>
								</ItemStatsBox>
							)
						}
					</div>
					{
						item.isAvailableStarForce
							?
							<></>
							:
							<Alert
								message="스타포스 강화 할 수 없는 아이템 입니다."
								type="warning"
								showIcon
								style={{ marginTop: '5rem' }}
							/>
					}
				</Spin>
			</div>
		</FlexBox>
	)
}

export default Item
