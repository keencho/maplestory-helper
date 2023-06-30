import styled, {css} from 'styled-components';
import {Typography} from "antd";

const Wrapper = styled.div<{ marginBottom?: string | number }>`
	display: flex;
	align-items: center;
	justify-content: space-between;
	
	${props => props.marginBottom && css`
		margin-bottom: ${typeof props.marginBottom === 'number' ? `${props.marginBottom}px` : props.marginBottom};
	`}
`

const { Title } = Typography;

interface Props {
	title: string,
	extraContents?: JSX.Element
	marginBottom?: string | number
}

const PageTitle = (props: Props) => {
	return (
		<Wrapper marginBottom={props.marginBottom}>
			<Title level={3}>{props.title}</Title>
			{
				props.extraContents && <div>{props.extraContents}</div>
			}
		</Wrapper>
	)
}

export default PageTitle
