import {ReactNode} from 'react';
import {Gutter} from 'antd/lib/grid/row';
import {Col, Row} from 'antd';

interface RowProps {
	children: ReactNode,
	gutter?: Gutter | [Gutter, Gutter]
}

export const CustomRow = (props: RowProps) => {
	return (
		// children container에서 자신들만의 스크롤바가 생기게 함
		<Row
			gutter={props.gutter}
			style={{
				height: 0,
				flex: '1 1 auto',
		}}>
			{props.children}
		</Row>
	)
}

interface ColProps {
	children?: ReactNode,
	span?: number | string
	height?: number | string
    hideOverflow?: boolean
}

export const CustomCol = (props: ColProps) => {
	return (
		<Col
			span={props.span}
			style={{
				height: `${props.height ? props.height : '100%'}`,
				overflow: props.hideOverflow === true ? 'hidden' : 'auto',
				display: 'flex',
				flexDirection: 'column',
			}}
		>
			{props.children}
		</Col>
	)
}
