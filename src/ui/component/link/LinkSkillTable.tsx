import Column from 'antd/lib/table/Column';
import {Table} from 'antd';
import React from 'react';
import NoMarginHeading from '../common/element/NoMarginHeading';

export interface LinkSkillTableDisplayDataLinkType {
	key: string
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
				props.data.map((dt: LinkSkillTableDisplayData) =>
					<Table dataSource={dt.link} pagination={false} size={'small'} key={dt.key} sticky={true}>
						<Column
							align={'center'}
							title={dt.key}
							width={'5%'}
							render={(_, record: LinkSkillTableDisplayDataLinkType) => {
								return <img src={new URL(`../../../assets/icon/link/${record.skillName}.png`, import.meta.url).href} alt={record.skillName} />
							}}
						/>
						<Column
							align={'center'}
							title={'직업'}
							width={'10%'}
							render={(_, record: LinkSkillTableDisplayDataLinkType) => {
								return record.displayClassName.split('\n').map((item, idx) => <div key={idx}>{item}</div>)
							}}
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
