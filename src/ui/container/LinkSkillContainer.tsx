import PageTitle from '../component/common/PageTitle';
import React, {useEffect, useState} from 'react';
import {LinkSkillTable, LinkSkillTableDisplayData} from '../component/link-skill/LinkSkillTable';
import {LinkMap, LinkModel} from '../../model/link.model';
import {Class, ClassLine, ClassMap, ClassModel, JobLine} from '../../model/class.model';
import { Radio } from 'antd';
import {isArray} from 'util';

const LinkSkillContainer = () => {
	
	const [data, setData] = useState<LinkSkillTableDisplayData[] | undefined>(undefined);
	const [type, setType] = useState<'CATEGORY' | 'CLASS_LINE' | 'JOB_LINE'>('CLASS_LINE');
	
	useEffect(() => {
		const tempData: LinkSkillTableDisplayData[] = [];
		
		LinkMap.forEach((link: LinkModel) => {
			switch (type) {
				case 'CLASS_LINE':
					const targetClass: Class = Array.isArray(link.class) ? link.class[0] : link.class;
					const pureClass = ClassMap.find((cl: ClassModel) => cl.class === targetClass);
					
					if (pureClass) {
						const displayClassName: string = Array.isArray(link.class) ? `${ClassLine[pureClass.classLine]} ${pureClass.classLine === ClassLine.모험가 ? ` (${JobLine[pureClass.jobLine]})` : '' }` : Class[link.class];
						const data = { displayClassName: displayClassName, skillName: link.name, effect: link.effect, key: link.name };
						
						if (tempData.some(dt => dt.key === ClassLine[pureClass.classLine])) {
							tempData.find(dt => dt.key === ClassLine[pureClass.classLine])!.link.push(data)
						} else {
							tempData.push({ key: ClassLine[pureClass.classLine], link: [data] });
						}
					}
					break;
				case 'JOB_LINE':
					
					const getMatchClass = (clazz: Class) => {
						return ClassMap.find((cl: ClassModel) => cl.class === clazz);
					}
					
					// 모험가
					if (Array.isArray(link.class)) {
						
						link.class.forEach((clazz: Class) => {
							const pureClass = getMatchClass(clazz)!;
							
							if (tempData.some(dt => dt.key === JobLine[pureClass.jobLine])) {
								tempData.find(dt => dt.key === JobLine[pureClass.jobLine])!.link.push({ displayClassName: Class[pureClass.class], skillName: link.name, effect: link.effect, key: link.name })
							} else {
								tempData.push({ key: JobLine[pureClass.jobLine], link: [{ displayClassName: Class[pureClass.class], skillName: link.name, effect: link.effect, key: link.name }] })
							}
						})
					} else {
						const pureClass = getMatchClass(link.class)!;
						
						if (tempData.some(dt => dt.key === JobLine[pureClass.jobLine])) {
							tempData.find(dt => dt.key === JobLine[pureClass.jobLine])!.link.push({ displayClassName: Class[link.class], skillName: link.name, effect: link.effect, key: link.name })
						} else {
							tempData.push({ key: JobLine[pureClass.jobLine], link: [{ displayClassName: Class[link.class], skillName: link.name, effect: link.effect, key: link.name }] })
						}
					}
					
				break;
			}
		})
		
		setData(tempData)
	}, [type])
	
	return (
		<>
			<PageTitle
				title={'링크스킬'}
				marginBottom={'.5rem'}
			/>
			<Radio.Group onChange={(e) => setType(e.target.value)} value={type}>
				{/*<Radio value={'CATEGORY'}>타입별 구분</Radio>*/}
				<Radio value={'CLASS_LINE'}>직업 계열별 구분</Radio>
				<Radio value={'JOB_LINE'}>전직 계열별 구분</Radio>
			</Radio.Group>
			{
				data ? <LinkSkillTable data={data} /> : <></>
			}
		</>
	)
}

export default LinkSkillContainer
