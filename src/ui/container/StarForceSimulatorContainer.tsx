import PageTitle from '../component/common/PageTitle';
import {Alert, Radio, Space} from 'antd';
import {CustomCol, CustomRow} from '../component/common/element/CustomRowCol';
import React, {useState} from 'react';

const StarForceSimulatorContainer = () => {
	
	const [event, setEvent] = useState(0);
	
	return (
		<>
			<PageTitle
				title={'스타포스 시뮬레이터'}
				marginBottom={'.5rem'}
			/>
			<Alert
				message="PC 환경(사양)에 따라 결과 처리가 늦어질 수 있습니다."
				type="warning"
				showIcon
				closable
				style={{ marginBottom: '.5rem' }}
			/>
			<CustomRow gutter={32}>
				<CustomCol span={15}>
					스타포스 이벤트
					<Radio.Group onChange={(e) => setEvent(e.target.value)} value={event}>
						<Space direction="vertical">
							<Radio value={0}>없음</Radio>
							<Radio value={1}>10성 이하 1+1 강화</Radio>
							<Radio value={2}>강화비용 30% 할인</Radio>
							<Radio value={3}>5, 10, 15성에서 강화시 성공확률 100%</Radio>
							<Radio value={4}>샤이닝 스타포스</Radio>
						</Space>
					</Radio.Group>
				</CustomCol>
				<CustomCol span={9}>
					dd
				</CustomCol>
			</CustomRow>
		</>
	)
}

export default StarForceSimulatorContainer;
