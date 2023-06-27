import {CSSProperties} from 'react';
import {Typography} from "antd";

const { Title } = Typography;

interface Props {
	size: 1 | 2 | 3 | 4 | 5,
	children: React.ReactNode
}

const style: CSSProperties = { margin: 0 }

const NoMarginHeading = (props: Props) => {
	return <Title level={props.size} style={style}>{props.children}</Title> ;
}

export default NoMarginHeading
