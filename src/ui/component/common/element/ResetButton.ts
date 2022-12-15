import styled from 'styled-components';

export const ResetButton = styled.button<{ fullWidth?: boolean }>`
	border: none;
	margin: 0;
	padding: 0;
	//width: auto;
	overflow: visible;
	cursor: pointer;
	width: ${props => props.fullWidth === true ? '100%' : 'auto'};

	background: transparent;

	/* inherit font & color from ancestor */
	color: inherit;
	font: inherit;

	/* Normalize \`line-height\`. Cannot be changed from \`normal\` in Firefox 4+. */
	line-height: normal;

	/* Corrects font smoothing for webkit */
	-webkit-font-smoothing: inherit;
	-moz-osx-font-smoothing: inherit;

	/* Corrects inability to style clickable \`input\` types in iOS */
	-webkit-appearance: none;
`
