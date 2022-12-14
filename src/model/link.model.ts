import {Class} from './class.model';

export enum LinkType {
	경험치, 데미지, 기타
}

export interface LinkModel {
	class: Class | Class[]
	name: string,
	effect: string,
	type: LinkType
}

export const LinkMap: LinkModel[] = [
	{ class: [ Class.히어로, Class.팔라딘, Class.다크나이트 ], name: '인빈서블 빌리프', effect: '3초 동안 1초마다 최대 HP의 20%/23%/26%/29%/32%/35% 회복, 재발동 대기시간 410/370/330/290/250/210초 (HP가 15% 이하일 때 자동 발동)', type: LinkType.기타 },
	{ class: [ Class['아크메이지(불,독)'], Class['아크메이지(썬,콜)'], Class.비숍 ], name: '임피리컬 널리지', effect: '공격한 적 중 최대 HP가 가장 높은 적의 약점을 15%/17%/19%/21%/23%/25% 확률로 파악, 파악한 약점은 10초 동안 지속되며 최대 3회까지 중첩, 중첩 당 데미지 1%/1%/2%/2%/3%/3%, 방어율 무시 1%/1%/2%/2%/3%/3% 증가', type: LinkType.데미지 },
	{ class: [ Class.보우마스터, Class.신궁, Class.패스파인더 ], name: '어드벤쳐러 큐리어스', effect: '몬스터 컬렉션 등록 확률 10%/15%/20%/25%/30%/35%, 크리티컬 확률 3%/4%/5%/7%/8%/10% 증가', type: LinkType.데미지 },
	{ class: [ Class.나이트로드, Class.섀도어, Class.듀얼블레이드 ], name: '시프 커닝', effect: '적에게 상태이상을 적용시키면 10초 동안 데미지 3%/6%/9%/12%/15%/18% 증가, 재발동 대기시간 20초', type: LinkType.데미지 },
	{ class: [ Class.바이퍼, Class.캡틴, Class.캐논슈터 ], name: '파이렛 블레스', effect: '올스탯 20/30/40/50/60/70, HP,MP 350/525/700/875/1050/1225, 데미지 흡수 5%/7%/9%/11%/13%/15% 증가', type: LinkType.데미지 },
	{ class: [ Class.소울마스터, Class.플레임위자드, Class.윈드브레이커, Class.나이트워커, Class.스트라이커 ], name: '시그너스 블레스', effect: '공격력·마력 7/9/11/13/15/17/19/21/23/25, 상태이상 내성 2/5/7/10/12/15/17/20/22/25, 모든 속성 저항 2%/5%/7%/10%/12%/15%/17%/20%/22%/25% 증가', type: LinkType.기타 },
	{ class: Class.미하일, name: '빛의 수호', effect: '10/15초 동안 상태 이상 내성 100 증가', type: LinkType.기타 },
	{ class: [ Class.배틀메이지, Class.블래스터, Class.와일드헌터, Class.메카닉 ], name: '스피릿 오브 프리덤', effect: '부활시 1/2/3/4/5/6/7/8초 동안 피해를 받지 않음', type: LinkType.기타 },
	{ class: Class.제논, name: '하이브리드 로직', effect: '올스탯 5%/10% 증가', type: LinkType.데미지 },
	{ class: Class.데몬슬레이어, name: '데몬스 퓨리', effect: '보스 몬스터 공격 시 데미지 10%/15% 증가', type: LinkType.데미지 },
	{ class: Class.데몬어벤져, name: '와일드 레이지', effect: '데미지 5%/10% 증가', type: LinkType.데미지 },
	{ class: Class.아란, name: '콤보킬 어드밴티지', effect: '영구적으로 콤보킬 구슬 경험치 획득량 400%/650%', type: LinkType.경험치 },
	{ class: Class.에반, name: '룬 퍼시스턴스', effect: '해방된 룬의 힘 지속시간 30%/50% 증가', type: LinkType.경험치 },
	{ class: Class.루미너스, name: '퍼미에이트', effect: '방어율 무시 10%/15% 증가', type: LinkType.데미지 },
	{ class: Class.메르세데스, name: '엘프의 축복', effect: '경험치 10%/15% 추가', type: LinkType.경험치 },
	{ class: Class.팬텀, name: '데들리 인스팅트', effect: '크리티컬 확률 10%/15% 증가', type: LinkType.데미지 },
	{ class: Class.은월, name: '구사 일생', effect: '사망에 이르는 공격을 당할 시, 5%/10% 확률로 생존', type: LinkType.기타 },
	{ class: Class.카이저, name: '아이언 윌', effect: '최대 HP 10%/15% 증가', type: LinkType.기타 },
	{ class: Class.카인, name: '프라이어 프리퍼레이션', effect: '적 8명 처치, 혹은 보스 몬스터에게 5번 공격 적중 시 사전 준비 1번 완료, 사전 준비를 5번 마치면 20초 동안 데미지 9/17% 증가, 재발동 대기시간 40초', type: LinkType.데미지 },
	{ class: Class.카데나, name: '인텐시브 인썰트', effect: '낮은 레벨 몬스터 공격시 데미지 3%/6%, 상태이상 공격시 데미지 3%/6%', type: LinkType.데미지 },
	{ class: Class.엔젤릭버스터, name: '소울 컨트랙트', effect: '10초간 스킬 데미지 30%/45% 증가', type: LinkType.데미지 },
	{ class: Class.아델, name: '노블레스', effect: '같은 맵에 있는 자신을 포함한 파티원 1명 당 데미지 1/2% 증가 (최대 4/8%까지 증가), 보스 몬스터 공격 시 데미지 2/4% 증가', type: LinkType.데미지 },
	{ class: Class.일리움, name: '전투의 흐름', effect: '일정거리 이동시 데미지 1%/2% 증가, 최대 6회 중첩 가능', type: LinkType.데미지 },
	{ class: Class.칼리, name: '이네이트 기프트', effect: '데미지 3%/5% 증가. 공격시 100%확률로 5초동안 매초 최대 HP/MP의 1%/2% 회복', type: LinkType.데미지 },
	{ class: Class.아크, name: '무아', effect: '전투 상태가 5초 지속되면 발동되며 최대 5회 중첩 가능, 지속시간 5초 발동 시 데미지 1% 증가, 각 중첩당 데미지 1/2% 증가', type: LinkType.데미지 },
	{ class: Class.라라, name: '자연의 벗', effect: '데미지 3/5% 증가, 일반 몬스터 20명 처치 시 30초 동안 일반 몬스터 공격 시 데미지 7/11% 증가, 재발동 대기 시간 30초', type: LinkType.데미지 },
	{ class: Class.호영, name: '자신감', effect: '방어율 무시 5/10% 추가, HP가 100%인 몬스터 공격 시 데미지 7/14% 증가', type: LinkType.데미지 },
	{ class: Class.제로, name: '륀느의 축복', effect: '피격 데미지 3%/6%/9%/15% 감소, 공격 시 대상의 방어율 2%/4%/6%/10% 무시', type: LinkType.데미지 },
	{ class: Class.키네시스, name: '판단', effect: '크리티컬 데미지 2%/4% 증가', type: LinkType.데미지 },
]
