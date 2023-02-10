import {FlexBox} from '../common/element/FlexBox';
import {Alert, Typography} from 'antd';
import {
	getMaxStarForce,
	getStarForceUpgradeInfo,
	getSubCategoryName,
	isSubWeapon,
	isWeapon
} from '../../../util/equipment.util';
import {Equipment, equipmentCategoryName, equipmentOptionName} from '../../../model/equipment.model';
import React, {useEffect} from 'react';
import styled from 'styled-components';
import {StarFilled, StarOutlined} from '@ant-design/icons';
import {numberComma} from '../../../util/common.util';

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

const Item = ({ item }: { item: Equipment | undefined }) => {
	
	if (!item) return <></>;
	
	const starForceUpgradeInfo = getStarForceUpgradeInfo(item)
	
	const getStarForceElement = (): JSX.Element => {
		if (!item.isAvailableStarForce) return <></>
		
		const arr: JSX.Element[] = [];
		
		for (let i = 1; i <= getMaxStarForce(item.level, item.isSuperiorItem); i ++) {
			const style: React.CSSProperties = {
				fontSize: '15px',
				color: '#FFAA00'
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
		<FlexBox flexDirection={'column'} alignItems={'center'} width={'90%'}>
			{getStarForceElement()}
			<Title level={3}>{item.itemName}</Title>
			{/*<img src={'https://cdn.pixabay.com/photo/2018/05/13/16/57/dog-3397110__480.jpg'} style={{ width: '200px' }} />*/}
			<img src={item.base64Icon} style={{ width: '80px' }} alt={item.itemName} />
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
				{/*<div>잠재</div>*/}
				{/*<div>잠재1</div>*/}
				{/*<div>잠재2</div>*/}
				{/*<div>잠재3</div>*/}
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
							style={{ marginTop: '1rem' }}
						/>
			}
		</FlexBox>
	)
}

export default Item
