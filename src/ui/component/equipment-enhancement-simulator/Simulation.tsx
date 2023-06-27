// import {Alert, Descriptions, Empty, Spin, Typography} from 'antd';
// import {Equipment} from '../../../model/equipment.model';
// import * as React from 'react';
// import {useEffect, useState} from 'react';
// import {groupBy, numberComma, numberToKorean} from '../../../util/common.util';
// import {Column, ColumnConfig} from '@ant-design/charts';
// import {useRecoilValue} from 'recoil';
// import {ThemeAtom} from '../../../recoil/theme.atom';
// import styled from 'styled-components';
// import {FlexBox} from '../common/element/FlexBox';
//
// const { Title } = Typography;
//
// interface Props {
// 	simulationNumber: number
// 	progressRate: number
// 	simulationResult: Equipment[]
// 	running: boolean
// }
//
// const buildDefaultConfig = (data: { x: string, y: number}[], theme: 'light' | 'dark'): ColumnConfig => {
// 	return {
// 		data,
// 		xField: 'x',
// 		yField: 'y',
// 		yAxis: {
// 			label: {
// 				formatter: (text) => {
// 					return numberComma(Number(text))
// 				}
// 			}
// 		},
// 		tooltip: {
// 			formatter: (datum) => {
// 				return { name: '횟수', value: numberComma(datum['y']) }
// 			}
// 		},
// 		theme:
// 			theme === 'light'
// 				? 'default'
// 				: {"background":"rgba(48, 48, 48, 1)","subColor":"rgba(255,255,255,0.05)","semanticRed":"#F4664A","semanticGreen":"#30BF78","padding":"auto","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","columnWidthRatio":0.5,"maxColumnWidth":null,"minColumnWidth":null,"roseWidthRatio":0.9999999,"multiplePieWidthRatio":0.7692307692307692,"sequenceColors":["#B8E1FF","#9AC5FF","#7DAAFF","#5B8FF9","#3D76DD","#085EC0","#0047A5","#00318A","#001D70"],"shapes":{"point":["hollow-circle","hollow-square","hollow-bowtie","hollow-diamond","hollow-hexagon","hollow-triangle","hollow-triangle-down","circle","square","bowtie","diamond","hexagon","triangle","triangle-down","cross","tick","plus","hyphen","line"],"line":["line","dash","dot","smooth"],"area":["area","smooth","line","smooth-line"],"interval":["rect","hollow-rect","line","tick"]},"sizes":[1,10],"components":{"axis":{"common":{"title":{"autoRotate":true,"position":"center","spacing":12,"style":{"fill":"#A6A6A6","fontSize":12,"lineHeight":12,"textBaseline":"middle","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\""}},"label":{"autoRotate":false,"autoEllipsis":false,"autoHide":{"type":"equidistance","cfg":{"minGap":6}},"offset":8,"style":{"fill":"#737373","fontSize":12,"lineHeight":12,"fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\""}},"line":{"style":{"lineWidth":1,"stroke":"#404040"}},"grid":{"line":{"type":"line","style":{"stroke":"#262626","lineWidth":1,"lineDash":null}},"alignTick":true,"animate":true},"tickLine":{"style":{"lineWidth":1,"stroke":"#404040"},"alignTick":true,"length":4},"subTickLine":null,"animate":true},"top":{"position":"top","grid":null,"title":null,"verticalLimitLength":0.5},"bottom":{"position":"bottom","grid":null,"title":null,"verticalLimitLength":0.5},"left":{"position":"left","title":null,"line":null,"tickLine":null,"verticalLimitLength":0.3333333333333333},"right":{"position":"right","title":null,"line":null,"tickLine":null,"verticalLimitLength":0.3333333333333333},"circle":{"title":null,"grid":{"line":{"type":"line","style":{"stroke":"#262626","lineWidth":1,"lineDash":null}},"alignTick":true,"animate":true}},"radius":{"title":null,"grid":{"line":{"type":"circle","style":{"stroke":"#262626","lineWidth":1,"lineDash":null}},"alignTick":true,"animate":true}}},"legend":{"common":{"title":null,"marker":{"symbol":"circle","spacing":8,"style":{"r":4,"fill":"#5B8FF9"}},"itemName":{"spacing":5,"style":{"fill":"#A6A6A6","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","fontSize":12,"lineHeight":12,"fontWeight":"normal","textAlign":"start","textBaseline":"middle"}},"itemStates":{"active":{"nameStyle":{"opacity":0.8}},"unchecked":{"nameStyle":{"fill":"#D8D8D8"},"markerStyle":{"fill":"#D8D8D8","stroke":"#D8D8D8"}},"inactive":{"nameStyle":{"fill":"#D8D8D8"},"markerStyle":{"opacity":0.2}}},"flipPage":true,"pageNavigator":{"marker":{"style":{"size":12,"inactiveFill":"#737373","inactiveOpacity":0.45,"fill":"#737373","opacity":1}},"text":{"style":{"fill":"#A6A6A6","fontSize":12}}},"animate":false,"maxItemWidth":200,"itemSpacing":24,"itemMarginBottom":12,"padding":[8,8,8,8]},"right":{"layout":"vertical","padding":[0,8,0,8]},"left":{"layout":"vertical","padding":[0,8,0,8]},"top":{"layout":"horizontal","padding":[8,0,8,0]},"bottom":{"layout":"horizontal","padding":[8,0,8,0]},"continuous":{"title":null,"background":null,"track":{},"rail":{"type":"color","size":12,"defaultLength":100,"style":{"fill":"#262626","stroke":null,"lineWidth":0}},"label":{"align":"rail","spacing":4,"formatter":null,"style":{"fill":"#737373","fontSize":12,"lineHeight":12,"textBaseline":"middle","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\""}},"handler":{"size":10,"style":{"fill":"#F0F0F0","stroke":"#BFBFBF"}},"slidable":true,"padding":[8,8,8,8]}},"tooltip":{"showContent":true,"follow":true,"showCrosshairs":false,"showMarkers":true,"shared":false,"enterable":false,"position":"auto","marker":{"symbol":"circle","stroke":"#fff","shadowBlur":10,"shadowOffsetX":0,"shadowOffsetY":0,"shadowColor":"rgba(0,0,0,0.09)","lineWidth":2,"r":4},"crosshairs":{"line":{"style":{"stroke":"#404040","lineWidth":1}},"text":null,"textBackground":{"padding":2,"style":{"fill":"rgba(0, 0, 0, 0.25)","lineWidth":0,"stroke":null}},"follow":false},"domStyles":{"g2-tooltip":{"position":"absolute","visibility":"hidden","zIndex":8,"transition":"left 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s, top 0.4s cubic-bezier(0.23, 1, 0.32, 1) 0s","backgroundColor":"#1f1f1f","opacity":0.95,"boxShadow":"0px 2px 4px rgba(0,0,0,.5)","borderRadius":"3px","color":"#A6A6A6","fontSize":"12px","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","lineHeight":"12px","padding":"0 12px 0 12px"},"g2-tooltip-title":{"marginBottom":"12px","marginTop":"12px"},"g2-tooltip-list":{"margin":0,"listStyleType":"none","padding":0},"g2-tooltip-list-item":{"listStyleType":"none","padding":0,"marginBottom":"12px","marginTop":"12px","marginLeft":0,"marginRight":0},"g2-tooltip-marker":{"width":"8px","height":"8px","borderRadius":"50%","display":"inline-block","marginRight":"8px"},"g2-tooltip-value":{"display":"inline-block","float":"right","marginLeft":"30px"}}},"annotation":{"arc":{"style":{"stroke":"#262626","lineWidth":1},"animate":true},"line":{"style":{"stroke":"#404040","lineDash":null,"lineWidth":1},"text":{"position":"start","autoRotate":true,"style":{"fill":"#A6A6A6","stroke":null,"lineWidth":0,"fontSize":12,"textAlign":"start","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","textBaseline":"bottom"}},"animate":true},"text":{"style":{"fill":"#A6A6A6","stroke":null,"lineWidth":0,"fontSize":12,"textBaseline":"middle","textAlign":"start","fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\""},"animate":true},"region":{"top":false,"style":{"lineWidth":0,"stroke":null,"fill":"#FFFFFF","fillOpacity":0.06},"animate":true},"image":{"top":false,"animate":true},"dataMarker":{"top":true,"point":{"style":{"r":3,"stroke":"#5B8FF9","lineWidth":2}},"line":{"style":{"stroke":"#404040","lineWidth":1},"length":16},"text":{"style":{"textAlign":"start","fill":"#A6A6A6","stroke":null,"lineWidth":0,"fontSize":12,"fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\""}},"direction":"upward","autoAdjust":true,"animate":true},"dataRegion":{"style":{"region":{"fill":"#FFFFFF","fillOpacity":0.06},"text":{"textAlign":"center","textBaseline":"bottom","fill":"#A6A6A6","stroke":null,"lineWidth":0,"fontSize":12,"fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\""}},"animate":true}},"slider":{"common":{"padding":[8,8,8,8],"backgroundStyle":{"fill":"#416180","opacity":0.05},"foregroundStyle":{"fill":"#5B8FF9","opacity":0.15},"handlerStyle":{"width":10,"height":24,"fill":"#F7F7F7","opacity":1,"stroke":"#BFBFBF","lineWidth":1,"radius":2,"highLightFill":"#FFF"},"textStyle":{"fill":"#fff","opacity":0.45,"fontSize":12,"lineHeight":12,"fontWeight":"normal","stroke":null,"lineWidth":0}}},"scrollbar":{"common":{"padding":[8,8,8,8]},"default":{"style":{"trackColor":"rgba(255,255,255,0.65)","thumbColor":"rgba(0,0,0,0.35)"}},"hover":{"style":{"thumbColor":"rgba(0,0,0,0.45)"}}}},"labels":{"offset":12,"style":{"fill":"#A6A6A6","fontSize":12,"fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","stroke":null,"lineWidth":0},"fillColorDark":"#2c3542","fillColorLight":"#ffffff","autoRotate":true},"innerLabels":{"style":{"fill":"#000","fontSize":12,"fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","stroke":null,"lineWidth":0},"autoRotate":true},"overflowLabels":{"style":{"fill":"#A6A6A6","fontSize":12,"fontFamily":"\"Segoe UI\", Roboto, \"Helvetica Neue\", Arial,\n    \"Noto Sans\", sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\",\n    \"Noto Color Emoji\"","stroke":"#000","lineWidth":1}},"pieLabels":{"labelHeight":14,"offset":10,"labelLine":{"style":{"lineWidth":1}},"autoRotate":true},"styleSheet":{"brandColor":"#5B8FF9","paletteQualitative10":["#5B8FF9","#5AD8A6","#5D7092","#F6BD16","#6F5EF9","#6DC8EC","#945FB9","#FF9845","#1E9493","#FF99C3"],"paletteQualitative20":["#5B8FF9","#CDDDFD","#5AD8A6","#CDF3E4","#5D7092","#CED4DE","#F6BD16","#FCEBB9","#6F5EF9","#D3CEFD","#6DC8EC","#D3EEF9","#945FB9","#DECFEA","#FF9845","#FFE0C7","#1E9493","#BBDEDE","#FF99C3","#FFE0ED"]}}
// 	}
// }
//
// const buildUsedMesoConfig = (data: { x: string, y: number }[], theme: 'light' | 'dark'): ColumnConfig => {
// 	const df: ColumnConfig = buildDefaultConfig(data, theme);
//
// 	return {
// 		...df,
// 		xAxis: {
// 			label: {
// 				autoHide: true,
// 				autoRotate: false,
// 				formatter: (text) => {
// 					return text.split('~')[1]
// 				}
// 			},
// 		},
// 	}
// }
//
// const buildDestroyedCountConfig = (data: { x: string, y: number }[], theme: 'light' | 'dark'): ColumnConfig => {
// 	const df: ColumnConfig = buildDefaultConfig(data, theme);
//
// 	const slider: Slider = data.length > 50 ? { start: 0, end: 0.5 } : false;
//
// 	return {
// 		...df,
// 		xAxis: {
// 			label: {
// 				autoHide: true,
// 				autoRotate: false,
// 				formatter: (text) => {
// 					return text.split('~')[1]
// 				}
// 			},
// 		},
// 		slider: slider
// 	}
// }
//
// type StatisticalData = {
// 	totalDestroyedCount: number,
// 	totalUsedMeso: number,
// 	mesoWon: number,
// 	itemName: string,
// 	itemStarForce: number,
// 	simulationNumber: number
// }
//
// const Simulation = (props: Props) => {
//
// 	const theme = useRecoilValue(ThemeAtom);
//
// 	const [usedMesoConfig, setUsedMesoConfig] = useState<ColumnConfig | undefined>(undefined);
// 	const [destroyedCountConfig, setDestroyedCountConfig] = useState<ColumnConfig | undefined>(undefined);
// 	const [statisticalData, setStatisticalData] = useState<StatisticalData | undefined>(undefined);
//
// 	const drawUsedMeso = (arr: number[]) => {
// 		if (arr.length === 0) {
// 			return;
// 		}
//
// 		arr = arr.sort((a, b) => a - b);
//
// 		const numBins = 30;
// 		const binSize = (arr[arr.length - 1] - arr[0]) / numBins;
//
// 		const bins = Array.from({ length: numBins }, (_, i) => ({
// 			lowerBound: Math.floor(i * binSize),
// 			upperBound: Math.floor((i + 1) * binSize),
// 			count: 0
// 		}));
//
// 		// Count the number of data points that fall into each bin
// 		let i = 0;
// 		let currBin = bins[i];
// 		arr.forEach((x) => {
// 			while (x > currBin.upperBound && i < numBins - 1) {
// 				i++;
// 				currBin = bins[i];
// 			}
// 			currBin.count++;
// 		});
//
// 		let chartData: { x: string, y: number }[] = bins.map(dt =>({ x: `${numberToKorean(dt.lowerBound)} ~ ${numberToKorean(dt.upperBound)}`, y: dt.count }));
//
// 		const slice = (arr: { x: string, y: number }[]) => {
// 			const idx = arr.findIndex(item => item.y !== 0)
// 			if (idx > 0) {
// 				arr = arr.slice(idx)
// 			}
//
// 			return arr;
// 		}
//
// 		// 일종의 trim 작업
// 		chartData = slice(chartData);
// 		chartData = chartData.reverse();
// 		chartData = slice(chartData);
// 		chartData = chartData.reverse();
//
// 		setUsedMesoConfig(buildUsedMesoConfig(chartData, theme));
// 	}
//
// 	const drawDestroyedCount = (arr: number[]) => {
// 		if (arr.length === 0) {
// 			return;
// 		}
//
// 		const groupedArr = groupBy(arr, item => item);
// 		const chartData = Object.keys(groupedArr).map(vv => {
// 			return { x: vv, y: groupedArr[vv].length };
// 		})
//
// 		setDestroyedCountConfig(buildDestroyedCountConfig(chartData, theme));
// 	}
//
// 	const controlResult = () => {
// 		let result = props.simulationResult;
//
// 		let totalUsedMeso = 0;
// 		let totalDestroyedCount = 0;
// 		result.forEach((item: Equipment) => {
// 			totalUsedMeso += item.usedMeso;
// 			totalDestroyedCount += item.destroyedCount;
// 		})
//
// 		setStatisticalData({
// 			totalUsedMeso: totalUsedMeso,
// 			totalDestroyedCount: totalDestroyedCount,
// 			itemName: props.simulationResult[0].itemName,
// 			itemStarForce: props.simulationResult[0].starForce,
// 			simulationNumber: props.simulationNumber,
// 			mesoWon: Math.round(totalUsedMeso / props.simulationResult[0].mesoWon),
// 		});
//
// 		const mesoArray = result.map(it => it?.usedMeso).filter(it => it !== undefined);
// 		const destroyedArray = result.map(it => it?.destroyedCount).filter(it => it !== undefined);
//
// 		drawUsedMeso(mesoArray);
// 		drawDestroyedCount(destroyedArray);
// 	}
//
// 	useEffect(() => {
// 		if (usedMesoConfig) {
// 			setUsedMesoConfig(buildUsedMesoConfig(usedMesoConfig.data as any, theme));
// 		}
//
// 		if (destroyedCountConfig) {
// 			setDestroyedCountConfig(buildDestroyedCountConfig(destroyedCountConfig.data as any, theme))
// 		}
// 	}, [theme])
//
// 	useEffect(() => {
// 		if (props.simulationResult.length === props.simulationNumber) {
// 			controlResult()
// 		}
// 	}, [props.simulationResult])
//
// 	return (
// 		<FlexBox flex={1} overflowY={'hidden'}>
// 			{
// 				props.running
// 					?
// 					<FlexBox alignItems={'center'} justifyContent={'center'} flex={1} flexDirection={'column'} gap={'.5rem'}>
// 						<Spin tip={`스타포스 강화 시뮬레이션 중입니다... ${props.progressRate}%`} />
// 					</FlexBox>
// 					:
// 						usedMesoConfig && destroyedCountConfig && statisticalData
// 						?
// 							<Wrapper>
// 								<div>
// 									<Alert showIcon message={`${statisticalData.itemStarForce}성 '${statisticalData.itemName}'을(를) ${numberComma(statisticalData.simulationNumber)}개 제작 하였습니다.`} type="info" />
//
// 									<Descriptions bordered column={2} size={'small'} style={{ marginTop: '.5rem' }}>
// 										<Descriptions.Item label="총 소모 메소" span={2}>{numberToKorean(statisticalData.totalUsedMeso)}메소</Descriptions.Item>
// 										<Descriptions.Item label="총 파괴 횟수" span={2}>{numberToKorean(statisticalData.totalDestroyedCount)}회</Descriptions.Item>
// 										<Descriptions.Item label="총 소모 현금" span={2}>{numberToKorean(statisticalData.mesoWon)}원</Descriptions.Item>
// 										<Descriptions.Item label="평균 소모 메소">{numberToKorean(statisticalData.totalUsedMeso / props.simulationNumber)}메소</Descriptions.Item>
// 										<Descriptions.Item label="평균 파괴 횟수">{numberToKorean(statisticalData.totalDestroyedCount / props.simulationNumber)}회</Descriptions.Item>
// 									</Descriptions>
//
// 								</div>
// 								<BlockWrapper>
// 									<ChartBlock>
// 										<Title level={3}>메소 소모 통계</Title>
// 										<Column { ...usedMesoConfig } />
// 									</ChartBlock>
// 									<ChartBlock>
// 										<Title level={3}>파괴 횟수 통계</Title>
// 										<Column { ...destroyedCountConfig } />
// 									</ChartBlock>
// 								</BlockWrapper>
// 							</Wrapper>
// 						:
// 							<></>
// 			}
// 			{
// 				!props.running && !usedMesoConfig && !destroyedCountConfig &&
//           <FlexBox alignItems={'center'} justifyContent={'center'} flex={1}>
// 						<Empty description={<>시뮬레이션 결과가 없습니다.</>} />
//           </FlexBox>
// 			}
// 		</FlexBox>
// 	)
// }
//
// export default Simulation
//
// const Wrapper = styled.div`
// 	flex: 1;
// 	display: flex;
// 	flex-direction: column;
// 	overflow: hidden;
// `
//
// const BlockWrapper = styled.div`
// 	margin-top: 1rem;
// 	display: flex;
// 	flex-direction: column;
// 	gap: 1rem;
// 	overflow: scroll;
// `
//
// const ChartBlock = styled.div`
// 	display: flex;
// 	flex-direction: column;
// 	gap: .5rem;
// `
