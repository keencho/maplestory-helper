import {ReactNode} from 'react';
import styled from 'styled-components';
import {Property} from 'csstype';
import StyledComponentUtil from '../../../../util/styled-component.util';
import {CommonStyle, CommonStyledDiv} from '../../../../model/style.model';

interface Props extends CommonStyle {
	children: ReactNode
	
	alignItems?: Property.AlignItems
	justifyContent?: Property.JustifyContent
	gap?: Property.Gap
	flexDirection?: Property.FlexDirection
	flexGrow?: Property.FlexGrow
	width?: Property.Width
    backgroundColor?: Property.BackgroundColor
}

const FlexBoxContainer = styled(CommonStyledDiv)<Props>`
	display: flex;
	${props => StyledComponentUtil.apply(props)}
`

export const FlexBox = (props: Props) => {
	return (
		<FlexBoxContainer {...props}>
			{props.children}
		</FlexBoxContainer>
	)
}
