export enum Difficulty {
	EASY,
	NORMAL,
	HARD,
	CHAOS,
	EXTREME
}

export const DifficultyKor = {
	0: '이지',
	1: '노말',
	2: '하드',
	3: '카오스',
	4: '익스트림'
}

export enum Boss {
	자쿰, 매그너스, 힐라, 카웅, 파풀라투스,
	피에르, 반반, 블러디퀸, 벨룸,
	'반 레온', 혼테일, 아카이럼, 핑크빈, 시그너스,
	스우, 데미안, '가디언 엔젤 슬라임', 루시드, 윌,
	더스크, '진 힐라', 듄켈, '검은 마법사',
	'선택받은 세렌', '감시자 칼로스'
}

export interface BossInformation {
	boss: Boss,
	difficulty: Difficulty | Difficulty[],
	crystalPrice: number | number[]
	resettable?: boolean
}

export const DailyBossMap: BossInformation[] = [
	{ boss: Boss.자쿰, difficulty: [ Difficulty.EASY, Difficulty.NORMAL ], crystalPrice: [ 119835, 366997 ] },
	{ boss: Boss.파풀라투스, difficulty: [ Difficulty.EASY, Difficulty.NORMAL ], crystalPrice: [ 410135, 1596506 ] },
	{ boss: Boss.매그너스,  difficulty: [ Difficulty.EASY, Difficulty.NORMAL ], crystalPrice: [ 432605, 1553066 ] },
	{ boss: Boss.힐라, difficulty: Difficulty.NORMAL, crystalPrice: 479343 },
	{ boss: Boss.혼테일, difficulty: [ Difficulty.EASY, Difficulty.NORMAL, Difficulty.HARD ], crystalPrice: [ 528474, 606666, 810086 ] },
	{ boss: Boss.블러디퀸, difficulty: Difficulty.NORMAL, crystalPrice: 580003 },
	{ boss: Boss.반반, difficulty: Difficulty.NORMAL, crystalPrice: 580003 },
	{ boss: Boss.피에르, difficulty: Difficulty.NORMAL, crystalPrice: 580003 },
	{ boss: Boss.벨룸, difficulty: Difficulty.NORMAL, crystalPrice: 580003 },
	{ boss: Boss['반 레온'], difficulty: [ Difficulty.EASY, Difficulty.NORMAL, Difficulty.HARD ], crystalPrice: [ 633927, 873601, 1467984 ] },
	{ boss: Boss.아카이럼, difficulty: [ Difficulty.EASY, Difficulty.NORMAL ], crystalPrice: [ 690249, 1510227 ] },
	{ boss: Boss.카웅, difficulty: Difficulty.NORMAL, crystalPrice: 748970 },
	{ boss: Boss.핑크빈, difficulty: Difficulty.NORMAL, crystalPrice: 841544 },
]

export const WeeklyBossMap: BossInformation[] = [
	{ boss: Boss.시그너스, difficulty: [ Difficulty.EASY, Difficulty.NORMAL ], crystalPrice: [ 5496394, 9039130 ], resettable: true },
	{ boss: Boss.힐라, difficulty: Difficulty.HARD, crystalPrice: 6936489 },
	{ boss: Boss.핑크빈, difficulty: Difficulty.CHAOS, crystalPrice: 7923110 },
	{ boss: Boss.자쿰, difficulty: Difficulty.CHAOS, crystalPrice: 9741285 },
	{ boss: Boss.블러디퀸, difficulty: Difficulty.CHAOS, crystalPrice: 9806780, resettable: true },
	{ boss: Boss.반반, difficulty: Difficulty.CHAOS, crystalPrice: 9818154, resettable: true },
	{ boss: Boss.피에르, difficulty: Difficulty.CHAOS, crystalPrice: 9838932, resettable: true },
	{ boss: Boss.매그너스, difficulty: Difficulty.HARD, crystalPrice: 11579023, resettable: true },
	{ boss: Boss.벨룸, difficulty: Difficulty.CHAOS, crystalPrice: 12590202, resettable: true },
	{ boss: Boss.파풀라투스, difficulty: Difficulty.CHAOS, crystalPrice: 26725937 },
	{ boss: Boss.스우, difficulty: [ Difficulty.NORMAL, Difficulty.HARD ], crystalPrice: [ 33942566, 118294192 ] },
	{ boss: Boss.데미안, difficulty: [ Difficulty.NORMAL, Difficulty.HARD ], crystalPrice: [ 35517853, 112480613] },
	{ boss: Boss['가디언 엔젤 슬라임'], difficulty: [ Difficulty.NORMAL, Difficulty.CHAOS ], crystalPrice: [ 46935874, 155492141 ] },
	{ boss: Boss.루시드, difficulty: [ Difficulty.EASY, Difficulty.NORMAL, Difficulty.HARD ], crystalPrice: [ 48058319, 57505626, 131095655 ] },
	{ boss: Boss.윌, difficulty: [ Difficulty.EASY, Difficulty.NORMAL, Difficulty.HARD ], crystalPrice: [ 52139127, 66311463, 145038483 ] },
	{ boss: Boss.더스크, difficulty: [ Difficulty.NORMAL, Difficulty.CHAOS ], crystalPrice: [ 71054562, 160173752 ] },
	{ boss: Boss.듄켈, difficulty: [ Difficulty.NORMAL, Difficulty.HARD ], crystalPrice: [ 76601412, 160173752 ] },
	{ boss: Boss['진 힐라'], difficulty: [ Difficulty.NORMAL, Difficulty.HARD ], crystalPrice: [ 148112376, 190159452 ] },
	{ boss: Boss['선택받은 세렌'], difficulty: [ Difficulty.NORMAL, Difficulty.HARD, Difficulty.EXTREME ], crystalPrice: [ 196904752, 300000000, 1071302484 ] },
	{ boss: Boss['감시자 칼로스'], difficulty: Difficulty.CHAOS, crystalPrice: 300000000 },
	{ boss: Boss['검은 마법사'], difficulty: [ Difficulty.HARD, Difficulty.EXTREME ], crystalPrice: [ 1418809857, 5675239428 ] },
]
