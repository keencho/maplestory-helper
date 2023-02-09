import {FlexBox} from '../common/element/FlexBox';
import {Alert, Typography} from 'antd';
import {getMaxStarForce, getSubCategoryName, isSubWeapon, isWeapon} from '../../../util/equipment.util';
import {Equipment, equipmentCategoryName, equipmentOptionName} from '../../../model/equipment.model';
import React from 'react';
import styled from 'styled-components';
import {StarFilled, StarOutlined} from '@ant-design/icons';

const { Title } = Typography;

const ItemStatsBox = styled(FlexBox)`
	justify-content: space-between;
	
	&:not(:last-child) {
		margin-bottom: .5rem;
	}
`

const ItemStatsText = styled.span`
	font-size: 18px;
	font-weight: bold;
`

const StarForce = styled.div`
	margin-bottom: 1rem;
	text-align: center;
`

const Item = ({ item }: { item: Equipment | undefined }) => {
	
	if (!item) return <></>;
	
	const getStarForceElement = (): JSX.Element => {
		if (!item.isAvailableStarforce) return <></>
		
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
			
			if (i <= 8) {
				arr.push(<StarFilled style={style} key={i} />)
			} else {
				arr.push(<StarOutlined style={style} key={i} />)
			}
			
		}
		
		return <StarForce>{arr}</StarForce>
	}
	
	return (
		<FlexBox flexDirection={'column'} alignItems={'center'} width={'80%'}>
			{getStarForceElement()}
			<Title level={3}>{item.itemName}</Title>
			<img src={item.base64Icon} style={{ width: '100px' }} />
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
				item.isAvailableStarforce
					? <></>
					: <Alert
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
