export type EquipmentGroup =
	| 'Ring'
	| 'Cap'
	| 'Weapon'
	| 'Accessory'
	| 'Coat'
	| 'Longcoat'
	| 'Pants'
	| 'Glove'
	| 'Cape'
	| 'Shoes'
	| 'Android'

export const equipmentGroupName: Record<EquipmentGroup, string> = {
	'Ring'        : '반지',
	'Cap'         : '모자',
	'Weapon'      : '무기',
	'Accessory'   : '액세서리',
	'Coat'        : '상의',
	'Longcoat'    : '한벌옷',
	'Pants'       : '하의',
	'Glove'       : '장갑',
	'Cape'        : '망토',
	'Shoes'       : '신발',
	'Android'     : '안드로이드'
}

export type EquipmentCategory =
	| 'One-Handed Weapon'
	| 'Two-Handed Weapon'
	| 'Secondary Weapon'
	| 'Accessory'
	| 'Armor'
	| 'Mount'
	| 'Other'

export const equipmentCategoryName: Record<EquipmentCategory, string> = {
	'One-Handed Weapon'       : '한손무기',
	'Two-Handed Weapon'       : '두손무기',
	'Secondary Weapon'        : '보조무기',
	'Accessory'               : '액세서리',
	'Armor'                   : '방어구',
	'Mount'                   : '탈것',
	'Other'                   : '기타',
}

export type EquipmentSubCategory =
	| 'Badge'
	| 'Belt'
	| 'Earrings'
	| 'Emblem'
	| 'Eye Decoration'
	| 'Face Accessory'
	| 'Pendant'
	| 'Pocket Item'
	| 'Ring'
	| 'Shoulder Accessory'
	
	| 'Bottom'
	| 'Cape'
	| 'Glove'
	| 'Hat'
	| 'Overall'
	| 'Shield'
	| 'Shoes'
	| 'Top'
	
	| 'Mount'
	
	| 'Bladecaster'
	| 'Breath Shooter'
	| 'Cane'
	| 'Chain'
	| 'Dagger'
	| 'Desperado'
	| 'Gauntlet'
	| 'Katara'
	| 'One-Handed Axe'
	| 'One-Handed Blunt Weapon'
	| 'One-Handed Sword'
	| 'Psy-limiter'
	| 'Ritual Fan'
	| 'Shining Rod'
	| 'Staff'
	| 'Wand'
	| 'Whip Blade'
	
	| 'Android'
	| 'Bits'
	| 'Dragon Equipment'
	| 'Mechanic Equipment'
	| 'Mechanical Heart'
	| 'Pickaxe'
	| 'Shovel'
	
	| 'Arrow Fletching'
	| 'Arrowhead'
	| 'Ballast'
	| 'Bow Thimble'
	| 'Card'
	| 'Charges'
	| 'Charm'
	| 'Chess Piece'
	| 'Core Controller'
	| 'Dagger Scabbard'
	| 'Document'
	| 'Fox Marble'
	| 'Iron Chain'
	| 'Jewel'
	| 'Magic Arrow'
	| 'Magic Marble'
	| 'Magnum'
	| 'Mass'
	| 'Medal'
	| "Nova's Essence"
	| 'Orb'
	| 'Path'
	| 'Powder Keg'
	| 'Relic'
	| 'Rosary'
	| 'Soul Ring'
	| 'Spellbook'
	| 'Transmitter'
	| 'Wings'
	| 'Wrist Band'
	
	| 'Ancient Bow'
	| 'Arm Cannon'
	| 'Bow'
	| 'Claw'
	| 'Crossbow'
	| 'Dual Bowgun'
	| 'Gun'
	| 'Hand Cannon'
	| 'Knuckle'
	| 'Lapis'
	| 'Lazuli'
	| 'Pole Arm'
	| 'Spear'
	| 'Two-Handed Axe'
	| 'Two-Handed Blunt'
	| 'Two-Handed Sword'


export const equipmentSubCategoryInfo: [EquipmentCategory, EquipmentSubCategory, string][] = [
	[ 'Accessory', 'Badge', '뱃지' ],
	[ 'Accessory', 'Belt', '벨트' ],
	[ 'Accessory', 'Earrings', '귀고리' ],
	[ 'Accessory', 'Emblem', '엠블렘' ],
	[ 'Accessory', 'Eye Decoration', '눈 장식' ],
	[ 'Accessory', 'Face Accessory', '얼굴 장식' ],
	[ 'Accessory', 'Medal', '훈장' ],
	[ 'Accessory', 'Pendant', '펜던트' ],
	[ 'Accessory', 'Pocket Item', '포켓 아이템' ],
	[ 'Accessory', 'Ring', '반지' ],
	[ 'Accessory', 'Shoulder Accessory', '어깨 장식' ],
	
	[ 'Armor', 'Bottom', '하의' ],
	[ 'Armor', 'Cape', '망토' ],
	[ 'Armor', 'Glove', '장갑' ],
	[ 'Armor', 'Hat', '모자' ],
	[ 'Armor', 'Overall', '한벌옷' ],
	[ 'Armor', 'Shield', '방패' ],
	[ 'Armor', 'Shoes', '신발' ],
	[ 'Armor', 'Top', '상의' ],
	
	[ 'Mount', 'Mount', '탈것' ],
	
	[ 'One-Handed Weapon', 'Bladecaster', '튜너' ],
	[ 'One-Handed Weapon', 'Breath Shooter', '브레스 슈터' ],
	[ 'One-Handed Weapon', 'Cane', '케인' ],
	[ 'One-Handed Weapon', 'Chain', '체인' ],
	[ 'One-Handed Weapon', 'Dagger', '대거' ],
	[ 'One-Handed Weapon', 'Desperado', '데스페라도' ],
	[ 'One-Handed Weapon', 'Gauntlet', '매직 건틀렛' ],
	[ 'One-Handed Weapon', 'Katara', '블레이드' ],
	[ 'One-Handed Weapon', 'One-Handed Axe', '한손도끼' ],
	[ 'One-Handed Weapon', 'One-Handed Blunt Weapon', '한손둔기' ],
	[ 'One-Handed Weapon', 'One-Handed Sword', '한손검' ],
	[ 'One-Handed Weapon', 'Psy-limiter', 'ESP리미터' ],
	[ 'One-Handed Weapon', 'Ritual Fan', '부채' ],
	[ 'One-Handed Weapon', 'Shining Rod', '샤이닝 로드' ],
	[ 'One-Handed Weapon', 'Staff', '스태프' ],
	[ 'One-Handed Weapon', 'Wand', '완드' ],
	[ 'One-Handed Weapon', 'Whip Blade', '에너지 소드' ],
	
	[ 'Other', 'Android', '안드로이드' ],
	[ 'Other', 'Bits', '비트' ],
	[ 'Other', 'Dragon Equipment', '드래곤 장비' ],
	[ 'Other', 'Mechanic Equipment', '메카닉 장비' ],
	[ 'Other', 'Mechanical Heart', '기계심장' ],
	[ 'Other', 'Pickaxe', '곡괭이' ],
	[ 'Other', 'Shovel', '삽' ],
	
	[ 'Secondary Weapon', 'Arrow Fletching', '화살깃' ],
	[ 'Secondary Weapon', 'Arrowhead', '화살촉'],
	[ 'Secondary Weapon', 'Ballast', '조준기'],
	[ 'Secondary Weapon', 'Bow Thimble', '활골무'],
	[ 'Secondary Weapon', 'Card', '카드'],
	[ 'Secondary Weapon', 'Charges', '장약'],
	[ 'Secondary Weapon', 'Charm', '부적'],
	[ 'Secondary Weapon', 'Chess Piece', '체스피스'],
	[ 'Secondary Weapon', 'Core Controller', '컨트롤러'],
	[ 'Secondary Weapon', 'Dagger Scabbard', '단검용 검집'],
	[ 'Secondary Weapon', 'Document', '문서'],
	[ 'Secondary Weapon', 'Fox Marble', '여우 구슬'],
	[ 'Secondary Weapon', 'Iron Chain', '쇠사슬'],
	[ 'Secondary Weapon', 'Jewel', '보석'],
	[ 'Secondary Weapon', 'Magic Arrow', '마법화살'],
	[ 'Secondary Weapon', 'Magic Marble', '마법구슬'],
	[ 'Secondary Weapon', 'Magnum', '매그넘'],
	[ 'Secondary Weapon', 'Mass', '무게추'],
	[ 'Secondary Weapon', 'Medal', '메달'],
	[ 'Secondary Weapon', "Nova's Essence", '용의 정수'],
	[ 'Secondary Weapon', 'Orb', '오브'],
	[ 'Secondary Weapon', 'Path', '패스 오브 어비스'],
	[ 'Secondary Weapon', 'Powder Keg', '화약통'],
	[ 'Secondary Weapon', 'Relic', '렐릭'],
	[ 'Secondary Weapon', 'Rosary', '로자리오'],
	[ 'Secondary Weapon', 'Soul Ring', '소울링'],
	[ 'Secondary Weapon', 'Spellbook', '마도서'],
	[ 'Secondary Weapon', 'Transmitter', '무기 전송장치'],
	[ 'Secondary Weapon', 'Wings', '매직윙'],
	[ 'Secondary Weapon', 'Wrist Band', '리스트밴드'],
	
	[ 'Two-Handed Weapon', 'Ancient Bow', '에인션트 보우'],
	[ 'Two-Handed Weapon', 'Arm Cannon', '건틀렛 리볼버'],
	[ 'Two-Handed Weapon', 'Bow', '활'],
	[ 'Two-Handed Weapon', 'Claw', '아대'],
	[ 'Two-Handed Weapon', 'Crossbow', '석궁'],
	[ 'Two-Handed Weapon', 'Dual Bowgun', '듀얼 보우건'],
	[ 'Two-Handed Weapon', 'Gun', '총'],
	[ 'Two-Handed Weapon', 'Hand Cannon', '핸드 캐논'],
	[ 'Two-Handed Weapon', 'Knuckle', '너클'],
	[ 'Two-Handed Weapon', 'Lapis', '태도'],
	[ 'Two-Handed Weapon', 'Lazuli', '태검'],
	[ 'Two-Handed Weapon', 'Pole Arm', '폴암'],
	[ 'Two-Handed Weapon', 'Spear', '창'],
	[ 'Two-Handed Weapon', 'Two-Handed Axe', '두손도끼'],
	[ 'Two-Handed Weapon', 'Two-Handed Blunt', '두손둔기'],
	[ 'Two-Handed Weapon', 'Two-Handed Sword', '두손검']
]

export type MetaInfoStats =
	| 'incMAD'          // 마력
	| 'incPAD'          // 공격력
	| 'incSTR'          // STR
	| 'incDEX'          // DEX
	| 'incINT'          // INT
	| 'incLUK'          // LUK
	| 'incMHP'          // HP
	| 'incMMP'          // MP
	| 'incPDD'          // 물리 방어력
	| 'incMDD'          // 마법 방어력
	| 'incJump'         // 점프력
	| 'incSpeed'        // 이동속도
	| 'imdR'            // 방무
	| 'bdR'             // 보공

export type EquipmentOption =
	| 'STR'
	| 'DEX'
	| 'INT'
	| 'LUK'
	| 'MAX_HP'
	| 'MAX_MP'
	| 'WEAR_LEVEL_DECREASE'
	| 'DEFENSE'
	| 'MAGIC_DEFENSE'
	| 'ATTACK'
	| 'MAGIC'
	| 'IGNORE_DEFENSE'
	| 'BOSS_DAMAGE'
	| 'DAMAGE'
	| 'MOVE_SPEED'
	| 'JUMP'
	| 'ALL_STATS'

export const metaInfoEquipmentOptionMap: Record<MetaInfoStats, EquipmentOption> = {
	'incSTR'            : 'STR',
	'incDEX'            : 'DEX',
	'incINT'            : 'INT',
	'incLUK'            : 'LUK',
	'incMHP'            : 'MAX_HP',
	'incMMP'            : 'MAX_MP',
	'incPAD'            : 'ATTACK',
	'incMAD'            : 'MAGIC',
	'incPDD'            : 'DEFENSE',
	'incMDD'            : 'MAGIC_DEFENSE',
	'incSpeed'          : 'MOVE_SPEED',
	'incJump'           : 'JUMP',
	'imdR'              : 'IGNORE_DEFENSE',
	'bdR'               : 'BOSS_DAMAGE'
}

export const equipmentOptionName: Record<EquipmentOption, string> = {
	'STR'                   : 'STR',
	'DEX'                   : 'DEX',
	'INT'                   : 'INT',
	'LUK'                   : 'LUK',
	'MAX_HP'                : 'MaxHP',
	'MAX_MP'                : 'MaxMP',
	'WEAR_LEVEL_DECREASE'   : '착용 레벨 감소',
	'DEFENSE'               : '방어력',
	'MAGIC_DEFENSE'         : '마법 방어력',
	'ATTACK'                : '공격력',
	'MAGIC'                 : '마력',
	'IGNORE_DEFENSE'        : '방어력 무시',
	'BOSS_DAMAGE'           : '보스 몬스터 공격 시 데미지',
	'DAMAGE'                : '데미지 %',
	'MOVE_SPEED'            : '이동속도',
	'JUMP'                  : '점프력',
	'ALL_STATS'             : '올스탯'
}

export interface Stats {
	key: EquipmentOption
	value: number
	additionalValue?: number              // 추옵
	enhancementAdditionalValue?: number   // 장비강화 스탯
}

export interface Equipment {
	itemName: string
	level: number
	isSuperiorItem: boolean
	base64Icon: string
	starForce: number
	isAvailableStarforce: boolean
	category: EquipmentCategory
	subCategory: EquipmentSubCategory
	stats: Stats[]
}
