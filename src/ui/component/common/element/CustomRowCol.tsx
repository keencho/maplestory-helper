import {ReactNode} from 'react';
import {Gutter} from 'antd/lib/grid/row';
import {Col, Row} from 'antd';

interface RowProps {
	children: ReactNode,
	gutter?: Gutter
}

export const CustomRow = (props: RowProps) => {
	return (
		// children container에서 자신들만의 스크롤바가 생기게 함
		<Row gutter={props.gutter} style={{ height: 0, flex: '1 1 auto' }}>
			{props.children}
		</Row>
	)
}

interface ColProps {
	children: ReactNode,
	span?: number | string
}

export const CustomCol = (props: ColProps) => {
	return (
		<Col span={props.span} style={{ border: '1px solid red', height: '100%', overflow: 'auto', display: 'flex', flexDirection: 'column' }}>
			{props.children}
		</Col>
	)
}
