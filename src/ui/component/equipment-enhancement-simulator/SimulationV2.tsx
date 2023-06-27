import React, {useEffect, useState} from "react";
import {FlexBox} from "../common/element/FlexBox";
import {Equipment} from "../../../model/equipment.model";
import {Bar, BarChart, Brush, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {Alert, Descriptions, Empty, Spin, Typography} from "antd";
import {groupBy, numberComma, numberToKorean} from "../../../util/common.util";
import styled from "styled-components";
import useRechartsColor from "../../../hooks/useRechartsColor";

const { Title } = Typography;

interface Props {
    simulationNumber: number
    progressRate: number
    simulationResult: Equipment[]
    running: boolean
}

type StatisticalData = {
    totalDestroyedCount: number,
    totalUsedMeso: number,
    mesoWon: number,
    itemName: string,
    itemStarForce: number,
    simulationNumber: number
}

const SimulationV2 = (props: Props) => {
    
    const rechartsColor = useRechartsColor();
    
    const [statisticalData, setStatisticalData] = useState<StatisticalData | undefined>(undefined);
    const [usedMesoData, setUsedMesoData] = useState<{ x: any, y: any }[] | undefined>(undefined);
    const [destroyedData, setDestroyedData] = useState<{ x: any, y: any }[] | undefined>(undefined);
    
    const buildUsedMesoResult = (arr: number[]) => {
        if (arr.length === 0) {
            return;
        }
        
        arr = arr.sort((a, b) => a - b);
        
        const numBins = 30;
        const binSize = (arr[arr.length - 1] - arr[0]) / numBins;
        
        const bins = Array.from({ length: numBins }, (_, i) => ({
            lowerBound: Math.floor(i * binSize),
            upperBound: Math.floor((i + 1) * binSize),
            count: 0
        }));
        
        // Count the number of data points that fall into each bin
        let i = 0;
        let currBin = bins[i];
        arr.forEach((x) => {
            while (x > currBin.upperBound && i < numBins - 1) {
                i++;
                currBin = bins[i];
            }
            currBin.count++;
        });
        
        let chartData: { x: string, y: number }[] = bins.map(dt =>({ x: `${numberToKorean(dt.lowerBound)} ~ ${numberToKorean(dt.upperBound)}`, y: dt.count }));
        
        const slice = (arr: { x: string, y: number }[]) => {
            const idx = arr.findIndex(item => item.y !== 0)
            if (idx > 0) {
                arr = arr.slice(idx)
            }
            
            return arr;
        }
        
        // 일종의 trim 작업
        chartData = slice(chartData);
        chartData = chartData.reverse();
        chartData = slice(chartData);
        chartData = chartData.reverse();
        
        setUsedMesoData(chartData);
    }
    
    const buildDestroyedData = (arr: number[]) => {
        if (arr.length === 0) {
            return;
        }
        
        const groupedArr = groupBy(arr, item => item);
        const chartData = Object.keys(groupedArr).map(vv => {
            return { x: vv, y: groupedArr[vv].length };
        })
        
        setDestroyedData(chartData);
    }
    
    const buildStatisticsResult = () => {
        let result = props.simulationResult;
        
        let totalUsedMeso = 0;
        let totalDestroyedCount = 0;
        result.forEach((item: Equipment) => {
            totalUsedMeso += item.usedMeso;
            totalDestroyedCount += item.destroyedCount;
        })
        
        setStatisticalData({
            totalUsedMeso: totalUsedMeso,
            totalDestroyedCount: totalDestroyedCount,
            itemName: props.simulationResult[0].itemName,
            itemStarForce: props.simulationResult[0].starForce,
            simulationNumber: props.simulationNumber,
            mesoWon: Math.round(totalUsedMeso / props.simulationResult[0].mesoWon),
        });
        
        const mesoArray = result.map(it => it?.usedMeso).filter(it => it !== undefined);
        const destroyedArray = result.map(it => it?.destroyedCount).filter(it => it !== undefined);

        buildUsedMesoResult(mesoArray);
        buildDestroyedData(destroyedArray);
    }
    
    useEffect(() => {
        if (props.simulationResult.length === props.simulationNumber) {
            buildStatisticsResult()
        }
    }, [props.simulationResult])
    
    return (
        <FlexBox flex={1} overflowY={'hidden'}>
            {
                props.running
                ?
                    <FlexBox alignItems={'center'} justifyContent={'center'} flex={1} flexDirection={'column'} gap={'.5rem'} width={'50px'}>
                        <Spin tip={`스타포스 강화 시뮬레이션 중입니다... ${props.progressRate}%`}>
                            <div />
                        </Spin>
                    </FlexBox>
                :
                    statisticalData && usedMesoData && destroyedData
                    ?
                        <Wrapper>
                            <div>
                                <Alert showIcon message={`${statisticalData.itemStarForce}성 '${statisticalData.itemName}'을(를) ${numberComma(statisticalData.simulationNumber)}개 제작 하였습니다.`} type="info" />
                                
                                <Descriptions bordered column={2} size={'small'} style={{ marginTop: '.5rem' }}>
                                    <Descriptions.Item label="총 소모 메소" span={2}>{numberToKorean(statisticalData.totalUsedMeso)}메소</Descriptions.Item>
                                    <Descriptions.Item label="총 파괴 횟수" span={2}>{numberToKorean(statisticalData.totalDestroyedCount)}회</Descriptions.Item>
                                    <Descriptions.Item label="총 소모 현금" span={2}>{numberToKorean(statisticalData.mesoWon)}원</Descriptions.Item>
                                    <Descriptions.Item label="평균 소모 메소">{numberToKorean(statisticalData.totalUsedMeso / props.simulationNumber)}메소</Descriptions.Item>
                                    <Descriptions.Item label="평균 파괴 횟수">{numberToKorean(statisticalData.totalDestroyedCount / props.simulationNumber)}회</Descriptions.Item>
                                </Descriptions>
                            </div>
                            
                            <BlockWrapper>
                                <ChartBlock>
                                    <Title level={3}>메소 소모 통계</Title>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={usedMesoData}
                                        >
                                            <XAxis
                                                dataKey={'x'}
                                                interval={'preserveStartEnd'}
                                            />
                                            <YAxis
                                                dataKey={'y'}
                                                tickFormatter={(v) => numberComma(Number(v))}
                                            />
                                            <Tooltip
                                                contentStyle={rechartsColor.tooltip}
                                                cursor={rechartsColor.tooltip}
                                                formatter={(v) =>`${numberComma(Number(v))}회 / ${ ((Number(v) / props.simulationNumber) * 100).toFixed(2) }%`}
                                            />
                                            <Bar
                                                dataKey="y"
                                                fill={rechartsColor.fill}
                                                name={'횟수'}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartBlock>
                                <ChartBlock>
                                    <Title level={3}>파괴 횟수 통계</Title>
                                    <ResponsiveContainer width="100%" height={300}>
                                        <BarChart
                                            data={destroyedData}
                                        >
                                            <XAxis
                                                dataKey={'x'}
                                                interval={'preserveStartEnd'}
                                            />
                                            <YAxis
                                                dataKey={'y'}
                                                tickFormatter={(v) => numberComma(Number(v))}
                                            />
                                            <Tooltip
                                                contentStyle={rechartsColor.tooltip}
                                                cursor={rechartsColor.tooltip}
                                                labelFormatter={(v) => `${v}회 파괴`}
                                                formatter={(v) =>`${numberComma(Number(v))}회 / ${ ((Number(v) / props.simulationNumber) * 100).toFixed(2) }%`}
                                            />
                                            <Brush
                                                dataKey="y"
                                                height={15}
                                                stroke={rechartsColor.fill}
                                            />
                                            <Bar
                                                dataKey="y"
                                                fill={rechartsColor.fill}
                                                name={'횟수'}
                                            />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ChartBlock>
                            </BlockWrapper>
                        </Wrapper>
                    :
                        <></>
            }
            {
                !props.running && !usedMesoData && !destroyedData &&
                <FlexBox alignItems={'center'} justifyContent={'center'} flex={1}>
                    <Empty description={<>시뮬레이션 결과가 없습니다.</>} />
                </FlexBox>
            }
        </FlexBox>
    )
}

export default SimulationV2

const Wrapper = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	overflow: hidden;
`

const BlockWrapper = styled.div`
	margin-top: 1rem;
	display: flex;
	flex-direction: column;
	gap: .5rem;
    overflow-x: hidden;
    overflow-y: auto;
`

const ChartBlock = styled.div`
	display: flex;
	flex-direction: column;
	gap: .5rem;
`
