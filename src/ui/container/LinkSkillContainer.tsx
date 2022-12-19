import PageTitle from '../component/common/PageTitle';
import React from 'react';
import {LinkSkillTable, LinkSkillTableDisplayData} from '../component/link-skill/LinkSkillTable';
import {LinkMap, LinkModel} from '../../model/link.model';
import {Class, ClassLine, ClassMap, ClassModel, JobLine} from '../../model/class.model';

const LinkSkillContainer = () => {
	
	const arr: LinkSkillTableDisplayData[] = [];
	LinkMap.forEach((link: LinkModel) => {
		const targetClass: Class = Array.isArray(link.class) ? link.class[0] : link.class;
		const pureClass = ClassMap.find((cl: ClassModel) => cl.class === targetClass);
		
		if (pureClass) {
			const displayClassName: string = Array.isArray(link.class) ? `${ClassLine[pureClass.classLine]} ${pureClass.classLine === ClassLine.모험가 ? ` (${JobLine[pureClass.jobLine]})` : '' }` : Class[link.class];
			
			if (arr.some(dt => dt.key === ClassLine[pureClass.classLine])) {
				arr.find(dt => dt.key === ClassLine[pureClass.classLine])!.link.push({ displayClassName: displayClassName, skillName: link.name, effect: link.effect })
			} else {
				arr.push({ key: ClassLine[pureClass.classLine], link: [{ displayClassName: displayClassName, skillName: link.name, effect: link.effect }] })
			}
		}
	})
	
	return (
		<>
			<PageTitle
				title={'링크스킬'}
				marginBottom={'.5rem'}
			/>
			<LinkSkillTable data={arr} />
		</>
	)
}

export default LinkSkillContainer
