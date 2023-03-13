import Path from './path.model';
import React from 'react';
import {DollarCircleOutlined, HomeOutlined, LinkOutlined, SkinOutlined} from '@ant-design/icons';
import {BossSoulCrystalCalculatorContainer} from '../ui/container/BossSoulCrystalCalculatorContainer';
import LinkSkillContainer from '../ui/container/LinkSkillContainer';
import {HomeworkContainer} from '../ui/container/HomeworkContainer';
import {EquipmentEnhancementSimulatorWrapper} from '../ui/container/EquipmentEnhancementSimulator';

export interface MenuType {
	path: string,
	label?: string
	redirect?: string,
	element?: JSX.Element,
	menuIcon?: JSX.Element,
	dev?: boolean
}

export const Menu: MenuType[] = [
	{
		path: Path.INDEX,
		redirect: Path.HOMEWORK
	},
	{
		path: Path.HOMEWORK,
		label: '숙제표',
		element: <HomeworkContainer />,
		menuIcon: <HomeOutlined />
	},
	{
		path: Path.EQUIPMENT_ENFORCE_SIMULATOR,
		label: '장비강화 시뮬레이터',
		element: <EquipmentEnhancementSimulatorWrapper />,
		menuIcon: <SkinOutlined />
	},
	{
		path: Path.BOSS_SOUL_CRYSTAL_CALCULATOR,
		label: '결정석 수입 계산기',
		element: <BossSoulCrystalCalculatorContainer />,
		menuIcon: <DollarCircleOutlined />
	},
	{
		path: Path.LINK_SKILL,
		label: '링크 스킬',
		element: <LinkSkillContainer />,
		menuIcon: <LinkOutlined />
	}
]
