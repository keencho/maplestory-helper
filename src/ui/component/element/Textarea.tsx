import styled from 'styled-components';
import {Dispatch} from 'react';

interface StyledProps {
	resize: 'auto' | 'none' | 'vertical' | 'horizontal'
	fullWidth?: boolean
	height?: number
}

interface Props extends StyledProps {
	value?: string
	setValue?: Dispatch<string>
}

const StyledTextarea = styled.textarea<StyledProps>`
	width: ${props => props.fullWidth === true ? '100%' : 'inherit'};
	height: ${props => props.height === undefined ? 'inherit' : `${props.height}px`};
	background-color: inherit;
	resize: ${props => props.resize};
`

const Textarea = (props: Props) => {
	return (
		<StyledTextarea
			value={props.value}
			onChange={(e) => {
				if (props.setValue) {
					props.setValue(e.target.value);
				}
			}}
			spellCheck={false}
			{...props}
		/>
	)
}

export default Textarea;
