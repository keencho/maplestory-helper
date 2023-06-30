import PageTitle from '../component/common/PageTitle';
import React, {useEffect, useState} from 'react';
import {
    LinkSkillTable,
    LinkSkillTableDisplayData,
    LinkSkillTableDisplayDataLinkType
} from '../component/link/LinkSkillTable';
import {LinkMap, LinkModel, LinkType} from '../../model/link.model';
import {Class, ClassLine, ClassMap, ClassModel, JobLine} from '../../model/class.model';
import {Button, Input, Radio} from 'antd';
import {FlexBox} from '../component/common/element/FlexBox';
import {CommonStyledDiv} from '../../model/style.model';

const LinkSkillContainer = () => {
	
	const [data, setData] = useState<LinkSkillTableDisplayData[] | undefined>(undefined);
	const [type, setType] = useState<'TYPE' | 'CLASS_LINE' | 'JOB_LINE'>('TYPE');
	const [searchValue, setSearchValue] = useState<string>('');
	
	const search = (searchByClass?: boolean) => {
		const tempData: LinkSkillTableDisplayData[] = [];
		
		LinkMap.forEach((link: LinkModel) => {
			const targetClass: Class = Array.isArray(link.class) ? link.class[0] : link.class;
			const pureClass = ClassMap.find((cl: ClassModel) => cl.class === targetClass)!;
			const displayClassName = Array.isArray(link.class) ? link.class.map(dt => Class[dt]).join('\n') : Class[link.class];
			
			if (searchByClass === true && searchValue && !displayClassName.includes(searchValue)) {
				return;
			}
			
			const data: LinkSkillTableDisplayDataLinkType = {
				displayClassName: displayClassName,
				skillName: link.name,
				effect: link.effect,
				key: link.name
			};
			
			let key: string;
			if (type === 'TYPE') {
				key = LinkType[link.type]
			} else if (type === 'JOB_LINE') {
				key = JobLine[pureClass.jobLine]
			} else {
				key = ClassLine[pureClass.classLine];
			}
			
			if (tempData.some(dt => dt.key === key)) {
				tempData.find(dt => dt.key === key)!.link.push(data)
			} else {
				tempData.push({ key: key, link: [data]});
			}
		});
		
		// 타입별 구분은 경험치, 데미지, 기타 순서로 정렬
		if (type === 'TYPE') {
			tempData.sort((a, b) => {
				if (a.key === LinkType[LinkType.경험치]) {
					return -2;
				} else if (a.key === LinkType[LinkType.데미지]) {
					return -1;
				} else if (a.key === LinkType[LinkType.기타]) {
					return 0;
				}
				
				return 0;
			})
		}
		
		setData(tempData)
	}
	
	useEffect(() => {
		setSearchValue('');
		search()
	}, [type])
	
	return (
		<>
			<PageTitle
				title={'링크스킬'}
				marginBottom={'.5rem'}
			/>
			<FlexBox justifyContent={'space-between'} alignItems={'center'}>
				<Radio.Group onChange={(e) => setType(e.target.value)} value={type} style={{ flex: 2 }}>
					<Radio value={'TYPE'}>타입별 구분</Radio>
					<Radio value={'CLASS_LINE'}>직업 계열별 구분</Radio>
					<Radio value={'JOB_LINE'}>전직 계열별 구분</Radio>
				</Radio.Group>
				<FlexBox alignItems={'center'} gap={'.5rem'} flex={1}>
					<Input placeholder="직업 검색" value={searchValue} onChange={(e) => setSearchValue(e.target.value)} onPressEnter={() => search(true)} />
					<Button type={'primary'} onClick={() => search(true)}>검색</Button>
				</FlexBox>
			</FlexBox>
			{
				data && data.length > 0
				?
					<CommonStyledDiv margin={'.5rem 0 0 0'} overflowY={'auto'}>
						<LinkSkillTable data={data} />
					</CommonStyledDiv>
				:
					<FlexBox height={'100%'} alignItems={'center'} justifyContent={'center'} fontSize={'3rem'} fontWeight={'700'}>검색 결과가 없습니다.</FlexBox>
			}
		</>
	)
}

export default LinkSkillContainer
