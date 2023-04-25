import {Select} from "antd";
import React, {useEffect, useState} from "react";
import {
  EquipmentCategory,
  equipmentCategoryName,
  EquipmentSubCategory,
  equipmentSubCategoryInfo
} from "../../../model/equipment.model";
import AsyncCacheImage from "../common/element/AsyncCacheImage";
import {getItemIcon} from "../../../api/maplestory-io.api";
import {cacheName, region, version} from "../../../model/maplestory-io.model";
import styled from "styled-components";
import {BLUE} from '../../../model/color.model';

const equipmentCategorySortMap: Map<EquipmentCategory, number> = new Map([
    ['Character', 0],
    ['Armor', 1],
    ['Accessory', 2],
    ['One-Handed Weapon', 3],
    ['Two-Handed Weapon', 4],
    ['Mount', 5]
]);

const equipmentCategoryOptions: { value: EquipmentCategory, label: string }[] = (Object.keys(equipmentCategoryName) as Array<EquipmentCategory>)
    .filter(key => equipmentCategorySortMap.has(key))
    .sort((a, b) => equipmentCategorySortMap.get(a)! - equipmentCategorySortMap.get(b)!)
    .map(key => ( { value: key, label: equipmentCategoryName[key] } ))

const equipmentSubCategoryOptions: { category: EquipmentCategory, value: EquipmentSubCategory, label: string }[] = equipmentSubCategoryInfo.map(item => ( { category: item[0], value: item[1], label: item[2] }) )

const Items = ({ items }: { items: any }) => {

    const defaultSearchItemCount = 50;
    const [searchItemCount, setSearchItemCount] = useState<number>(defaultSearchItemCount);
    const [searchedItem, setSearchedItem] = useState<any[]>([]);

    const [equipmentCategory, setEquipmentCategory] = useState(equipmentCategoryOptions[0].value)
    const [equipmentSubCategoryList, setEquipmentSubCategoryList] = useState(equipmentSubCategoryOptions.filter(item => item.category === equipmentCategory))
    const [equipmentSubCategory, setEquipmentSubCategory] = useState(equipmentSubCategoryList[0].value)
    const [categoryItems, setCategoryItems] = useState<any[]>([]);

    useEffect(() => {
        const filteredItems = items.filter((item: any) => item.typeInfo.subCategory === equipmentSubCategory);

        setCategoryItems(filteredItems);
        setSearchedItem(filteredItems.slice(0, searchItemCount))
    }, [equipmentCategory, equipmentSubCategory])

    return (
        <Wrapper>
            <SearchBox>
                <Select
                    onChange={value => {
                        setEquipmentCategory(value)
                        const list = equipmentSubCategoryOptions.filter((item: any) => item.category === value);
                        setEquipmentSubCategoryList(list)
                        setEquipmentSubCategory(list[0].value)
                    }}
                    value={equipmentCategory}
                    options={equipmentCategoryOptions}
                />
                <Select
                    onChange={value => setEquipmentSubCategory(value)}
                    value={equipmentSubCategory}
                    options={equipmentSubCategoryList}
                />
            </SearchBox>

            <ItemBox>
                {
                    searchedItem.map((item: any) => (
                        <Item key={item.id}>
                            <AsyncCacheImage src={getItemIcon(region, version, item.id)} cacheName={cacheName} alt={item.name} style={{ width: '30px' }} />
                            <ItemName>{item.name}</ItemName>
                        </Item>
                    ))
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

  transition: transform 0.5s;
  transform-style: preserve-3d;
  //perspective: 500px;
  
  padding: .5rem;
  
  &:hover {
    transform: translateY(-3px);
    border: 1px solid ${BLUE};
    border-radius: 4px;
  }
  
  &:nth-child(odd) {
    padding-right: 1rem;
  }
  
  &:nth-child(even) {
    padding-left: 1rem;
  }
  
`

const ItemName = styled.span`
  margin-left: auto;
  
`

export default Items
