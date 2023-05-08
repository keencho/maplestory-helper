import {Button, Checkbox, Input, Select} from "antd";
import React, {useEffect, useState} from "react";
import {
	EquipmentCategory,
	equipmentCategoryName,
	EquipmentSubCategory,
	equipmentSubCategoryInfo
} from "../../../model/equipment.model";
import {getItemIcon} from "../../../api/maplestory-io.api";
import {cacheName, region, version} from "../../../model/maplestory-io.model";
import styled from "styled-components";
import {BLUE} from '../../../model/color.model';
import AsyncImage from "../common/element/AsyncImage";
import {FlexBox} from '../common/element/FlexBox';
import SkinDefault from '../../../assets/icon/items/skin_default.png'

const equipmentCategorySortMap: Map<EquipmentCategory, number> = new Map([
	['Character', 0],
	['Armor', 1],
	['Accessory', 2],
	['One-Handed Weapon', 3],
	['Two-Handed Weapon', 4],
	['Mount', 5]
]);

const equipmentCategoryOptions: {
	value: EquipmentCategory,
	label: string
}[] = (Object.keys(equipmentCategoryName) as Array<EquipmentCategory>)
	.filter(key => equipmentCategorySortMap.has(key))
	.sort((a, b) => equipmentCategorySortMap.get(a)! - equipmentCategorySortMap.get(b)!)
	.map(key => ({value: key, label: equipmentCategoryName[key]}))

const equipmentSubCategoryOptions: {
	category: EquipmentCategory,
	value: EquipmentSubCategory,
	label: string
}[] = equipmentSubCategoryInfo.map(item => ({category: item[0], value: item[1], label: item[2]}))

const Items = ({items, onClickItem}: { items: any, onClickItem: (item: any) => void }) => {
	
	const defaultSearchItemCount = 50;
	const [searchItemCount, setSearchItemCount] = useState<number>(defaultSearchItemCount);
	const [searchedItem, setSearchedItem] = useState<any[]>([]);
	const [searchKeyword, setSearchKeyword] = useState<string>('');
	const [onlyCash, setOnlyCash] = useState<boolean>(false)
	
	const [equipmentCategory, setEquipmentCategory] = useState<EquipmentCategory | '카테고리를 선택하세요.'>(equipmentCategoryOptions[0].value)
	const [equipmentSubCategoryList, setEquipmentSubCategoryList] = useState(equipmentSubCategoryOptions.filter(item => item.category === equipmentCategory))
	const [equipmentSubCategory, setEquipmentSubCategory] = useState<EquipmentSubCategory | ''>(equipmentSubCategoryList.length > 0 ? equipmentSubCategoryList[0].value : '')
	const [categoryItems, setCategoryItems] = useState<any[]>([]);
	
	useEffect(() => {
		let filteredItems = items.filter((item: any) => searchKeyword.length === 0
			? item.typeInfo.subCategory === equipmentSubCategory
			: item.name.includes(searchKeyword)
		);
		
		if (onlyCash) {
			filteredItems = filteredItems.filter((item: any) => item.isCash === true)
		}
		
		setCategoryItems(filteredItems);
		setSearchedItem(filteredItems.slice(0, defaultSearchItemCount))
		setSearchItemCount(defaultSearchItemCount)
		
	}, [equipmentCategory, equipmentSubCategory, searchKeyword, onlyCash])
	
	useEffect(() => {
		if (searchItemCount === defaultSearchItemCount) return;
		
		setSearchedItem(categoryItems.slice(0, searchItemCount))
	}, [searchItemCount])
	
	return (
		<Wrapper>
			<SearchBox>
				<Select
					onChange={value => {
						setEquipmentCategory(value)
						const list = equipmentSubCategoryOptions.filter((item: any) => item.category === value);
						setEquipmentSubCategoryList(list)
						setEquipmentSubCategory(list[0].value)
						setSearchKeyword('')
					}}
					value={equipmentCategory}
					options={equipmentCategoryOptions}
				/>
				<Select
					onChange={value => {
						setEquipmentSubCategory(value)
						setSearchKeyword('')
					}}
					value={equipmentSubCategory}
					options={equipmentSubCategoryList}
				/>
				<FlexBox gap={'.5rem'} alignItems={'center'}>
					<Input
						placeholder="아이템명 입력"
						value={searchKeyword}
						onChange={(e) => {
							const value = e.target.value;
							setSearchKeyword(value)
							
							if (value.length > 0) {
								setEquipmentCategory('카테고리를 선택하세요.')
								setEquipmentSubCategory('')
								setEquipmentSubCategoryList([])
							} else {
								const v = equipmentCategoryOptions[0].value
								const sl = equipmentSubCategoryOptions.filter(item => item.category === v);
								setEquipmentCategory(v)
								setEquipmentSubCategoryList(sl)
								setEquipmentSubCategory(sl[0].value)
							}
						}}
						style={{flex: 2}}
					/>
					<Checkbox
						onChange={(e) => setOnlyCash(e.target.checked)}
						checked={onlyCash}
						style={{flex: 1, marginLeft: 'auto', display: 'flex', justifyContent: 'end'}}
					>
						캐시아이템만
					</Checkbox>
				</FlexBox>
			</SearchBox>
			
			<ItemBox>
				{
					searchedItem.map((item: any) => (
						<Item key={item.id} onClick={() => onClickItem(item)}>
							{
								item.typeInfo.subCategory === 'Head'
									?
									<img src={SkinDefault} alt={'피부'} />
									:
									<AsyncImage
										src={getItemIcon(region, version, item.id)}
										cache={{cacheName: cacheName}}
										alt={item.name}
										style={{
											width: 'auto',
											height: 'auto',
											maxWidth: '35px'
										}}
									/>
							}
							<ItemName>{item.name}</ItemName>
						</Item>
					))
				}
				{
					searchedItem.length !== categoryItems.length
						?
						<Button
							type='primary'
							style={{borderRadius: 0, width: '100%', marginTop: '.5rem'}}
							onClick={() => setSearchItemCount(searchItemCount + defaultSearchItemCount)}
						>
							더보기
						</Button>
						:
						<></>
				}
			</ItemBox>
		</Wrapper>
	)
}

const Wrapper = styled.div`
	display: flex;
	flex-direction: column;
	overflow: hidden;
	gap: .5rem;
`

const SearchBox = styled.div`
	display: flex;
	flex-direction: column;
	gap: .25rem;
`

const ItemBox = styled.div`
	overflow-y: auto;
	width: 100%;
	display: flex;
	flex-wrap: wrap;
`

const Item = styled.div`
	cursor: pointer;
	flex: 0 0 50%;
	text-align: center;
	display: flex;
	align-items: center;

	transition: transform 0.5s;
	transform-style: preserve-3d;

	padding: .5rem;

	&:hover {
		transform: translateY(-3px);
		border: 1px solid ${BLUE};
		border-radius: 4px;
	}

	&:nth-child(odd) {
		padding-right: .5rem;
	}

	&:nth-child(even) {
		padding-left: .5rem;
	}

`

const ItemName = styled.span`
	margin-left: auto;
	word-break: keep-all;
	max-width: 75%;
	text-align: right;
`

export default Items
