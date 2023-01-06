import {Property} from 'csstype';
import styled from 'styled-components';
import StyledComponentUtil from '../util/styled-component.util';

export interface CommonStyle {
	margin?: Property.Margin
	padding?: Property.Padding
	border?: Property.Border
	fontSize?: Property.FontSize
	fontWeight?: Property.FontWeight
	height?: Property.Height
	overflowY?: Property.OverflowY
	overflowWrap?: Property.OverflowWrap
	minWidth?: Property.MinWidth
	flex?: Property.Flex
}

export const CommonStyledDiv = styled.div<CommonStyle>`
	${props => StyledComponentUtil.apply(props)}
`

export const CommonStyledSpan = styled.span<CommonStyle>`
	${props => StyledComponentUtil.apply(props)}
`
