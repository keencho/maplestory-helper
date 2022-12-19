import Column from 'antd/lib/table/Column';
import {Table} from 'antd';
import React from 'react';
import {LinkModel} from '../../../model/link.model';
import {Class} from '../../../model/class.model';
import NoMarginHeading from '../common/element/NoMarginHeading';

export interface LinkSkillTableDisplayDataLinkType {
	displayClassName: string
	skillName: string,
	effect: string
}

export interface LinkSkillTableDisplayData {
	key: string,
	link: LinkSkillTableDisplayDataLinkType[]
}

export interface LinkSkillTableProps {
	data: LinkSkillTableDisplayData[]
}

export const LinkSkillTable = (props: LinkSkillTableProps) => {
	return (
		<>
			{
				props.data.map((dt: LinkSkillTableDisplayData, idx: number) =>
					<Table dataSource={dt.link} pagination={false} size={'small'} key={`${dt.key}-${idx}`}>
						<Column
							align={'center'}
							width={'3%'}
							render={(_, record: LinkSkillTableDisplayDataLinkType) => {
								return <img src={new URL(`../../../assets/icon/link/${record.skillName}.png`, import.meta.url).href} alt={record.skillName} />
							}}
						/>
						<Column
							align={'center'}
							title={'직업'}
							width={'10%'}
							dataIndex={'displayClassName'}
						/>
						<Column
							align={'center'}
							title={'스킬명'}
							width={'12%'}
							dataIndex={'skillName'}
						/>
						<Column
							align={'center'}
							title={'효과'}
							dataIndex={'effect'}
						/>
					</Table>
				)
			}
		</>
	)
}