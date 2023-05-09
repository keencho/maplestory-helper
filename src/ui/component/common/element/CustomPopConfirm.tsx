import {TooltipPlacement} from 'antd/lib/tooltip';
import React from 'react';
import {Popconfirm} from 'antd';

interface Props {
	placement: TooltipPlacement
	title: string
	onConfirm?: (e?: React.MouseEvent<HTMLElement>) => void
	children: React.ReactNode;
}

const CustomPopConfirm = (props: Props) => {
	return (
		<Popconfirm
			placement={props.placement}
			title={props.title}
			onConfirm={props.onConfirm}
			okText={'예'}
			cancelText={'아니오'}
		>
			{props.children}
		</Popconfirm>
	)
}

export default CustomPopConfirm
