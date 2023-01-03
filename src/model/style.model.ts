import {Property} from 'csstype';
import styled from 'styled-components';
import StyledComponentUtil from '../util/styled-component.util';

export interface CommonStyle {
	margin?: Property.Margin
	padding?: Property.Padding
	border?: Property.Border
	fontSize?: Property.FontSize
	fontWeight?: Property.FontWeight
}

export const CommonStyledDiv = styled.div<CommonStyle>`
	${props => StyledComponentUtil.apply('margin', props.margin)}
	${props => StyledComponentUtil.apply('padding', props.padding)}
	${props => StyledComponentUtil.apply('border', props.border)}
	${props => StyledComponentUtil.apply('font-size', props.fontSize)}
	${props => StyledComponentUtil.apply('font-weight', props.fontWeight)}
`

export const CommonStyledSpan = styled.span<CommonStyle>`
	${props => StyledComponentUtil.apply('margin', props.margin)}
	${props => StyledComponentUtil.apply('padding', props.padding)}
	${props => StyledComponentUtil.apply('border', props.border)}
	${props => StyledComponentUtil.apply('font-size', props.fontSize)}
	${props => StyledComponentUtil.apply('font-weight', props.fontWeight)}
`
