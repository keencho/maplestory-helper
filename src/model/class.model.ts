// 전체 직업
export enum Class {
	히어로, 팔라딘, 다크나이트,
	'아크메이지(불,독)', '아크메이지(썬,콜)', 비숍,
	보우마스터, 신궁, 패스파인더,
	나이트로드, 섀도어, 듀얼블레이드,
	바이퍼, 캡틴, 캐논슈터,
	소울마스터, 플레임위자드, 윈드브레이커, 나이트워커, 스트라이커, 미하일,
	블래스터, 배틀메이지, 와일드헌터, 메카닉, 제논,
	데몬슬레이어, 데몬어벤져,
	아란, 에반, 루미너스, 메르세데스, 팬텀, 은월,
	카이저, 카인, 카데나, 엔젤릭버스터,
	아델, 일리움, 칼리, 아크,
	라라, 호영,
	제로,
	키네시스
}

// 직업 계열
export enum ClassLine {
	모험가, '시그너스 기사단', 레지스탕스, 영웅, 노바, 레프, 아니마, 제로, 키네시스
}

// 전직 계열
export enum JobLine {
	전사, 마법사, 궁수, 도적, 해적, 하이브리드
}

export interface ClassModel {
	class: Class,
	classLine: ClassLine,
	jobLine: JobLine
}

export const ClassMap: ClassModel[] = [
	{ class: Class.히어로, classLine: ClassLine.모험가, jobLine: JobLine.전사 },
	{ class: Class.팔라딘, classLine: ClassLine.모험가, jobLine: JobLine.전사 },
	{ class: Class.다크나이트, classLine: ClassLine.모험가, jobLine: JobLine.전사 },
	{ class: Class['아크메이지(불,독)'], classLine: ClassLine.모험가, jobLine: JobLine.마법사 },
	{ class: Class['아크메이지(썬,콜)'], classLine: ClassLine.모험가, jobLine: JobLine.마법사 },
	{ class: Class.비숍, classLine: ClassLine.모험가, jobLine: JobLine.마법사 },
	{ class: Class.보우마스터, classLine: ClassLine.모험가, jobLine: JobLine.궁수 },
	{ class: Class.신궁, classLine: ClassLine.모험가, jobLine: JobLine.궁수 },
	{ class: Class.패스파인더, classLine: ClassLine.모험가, jobLine: JobLine.궁수 },
	{ class: Class.나이트로드, classLine: ClassLine.모험가, jobLine: JobLine.도적 },
	{ class: Class.섀도어, classLine: ClassLine.모험가, jobLine: JobLine.도적 },
	{ class: Class.듀얼블레이드, classLine: ClassLine.모험가, jobLine: JobLine.도적 },
	{ class: Class.바이퍼, classLine: ClassLine.모험가, jobLine: JobLine.해적 },
	{ class: Class.캡틴, classLine: ClassLine.모험가, jobLine: JobLine.해적 },
	{ class: Class.캐논슈터, classLine: ClassLine.모험가, jobLine: JobLine.해적 },
	
	{ class: Class.소울마스터, classLine: ClassLine['시그너스 기사단'], jobLine: JobLine.전사 },
	{ class: Class.플레임위자드, classLine: ClassLine['시그너스 기사단'], jobLine: JobLine.마법사 },
	{ class: Class.윈드브레이커, classLine: ClassLine['시그너스 기사단'], jobLine: JobLine.궁수 },
	{ class: Class.나이트워커, classLine: ClassLine['시그너스 기사단'], jobLine: JobLine.도적 },
	{ class: Class.스트라이커, classLine: ClassLine['시그너스 기사단'], jobLine: JobLine.해적 },
	{ class: Class.미하일, classLine: ClassLine['시그너스 기사단'], jobLine: JobLine.전사 },
	
	{ class: Class.블래스터, classLine: ClassLine.레지스탕스, jobLine: JobLine.전사 },
	{ class: Class.배틀메이지, classLine: ClassLine.레지스탕스, jobLine: JobLine.마법사 },
	{ class: Class.와일드헌터, classLine: ClassLine.레지스탕스, jobLine: JobLine.궁수 },
	{ class: Class.메카닉, classLine: ClassLine.레지스탕스, jobLine: JobLine.해적 },
	{ class: Class.제논, classLine: ClassLine.레지스탕스, jobLine: JobLine.하이브리드 },
	{ class: Class.데몬슬레이어, classLine: ClassLine.레지스탕스, jobLine: JobLine.전사 },
	{ class: Class.데몬어벤져, classLine: ClassLine.레지스탕스, jobLine: JobLine.전사 },
	
	{ class: Class.아란, classLine: ClassLine.영웅, jobLine: JobLine.전사 },
	{ class: Class.에반, classLine: ClassLine.영웅, jobLine: JobLine.마법사 },
	{ class: Class.루미너스, classLine: ClassLine.영웅, jobLine: JobLine.마법사 },
	{ class: Class.메르세데스, classLine: ClassLine.영웅, jobLine: JobLine.궁수 },
	{ class: Class.팬텀, classLine: ClassLine.영웅, jobLine: JobLine.도적 },
	{ class: Class.은월, classLine: ClassLine.영웅, jobLine: JobLine.해적 },
	
	{ class: Class.카이저, classLine: ClassLine.노바, jobLine: JobLine.전사 },
	{ class: Class.카인, classLine: ClassLine.노바, jobLine: JobLine.궁수 },
	{ class: Class.카데나, classLine: ClassLine.노바, jobLine: JobLine.도적 },
	{ class: Class.엔젤릭버스터, classLine: ClassLine.노바, jobLine: JobLine.해적 },
	
	{ class: Class.아델, classLine: ClassLine.레프, jobLine: JobLine.전사 },
	{ class: Class.일리움, classLine: ClassLine.레프, jobLine: JobLine.마법사 },
	{ class: Class.칼리, classLine: ClassLine.레프, jobLine: JobLine.도적 },
	{ class: Class.아크, classLine: ClassLine.레프, jobLine: JobLine.전사 },
	
	{ class: Class.라라, classLine: ClassLine.아니마, jobLine: JobLine.마법사 },
	{ class: Class.호영, classLine: ClassLine.아니마, jobLine: JobLine.도적 },
	
	{ class: Class.제로, classLine: ClassLine.제로, jobLine: JobLine.전사 },
	{ class: Class.키네시스, classLine: ClassLine.키네시스, jobLine: JobLine.마법사 },
]