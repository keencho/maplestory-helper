const HomeworkHelp = () => {
	return (
		<div>
			<div>숙제표는 일일숙제, 주간숙제(보스 포함)로 나누어져 있습니다.</div>
			<br />
			<div>각 표의 첫번째 행을 클릭해 해당 숙제의 사용여부를 지정할 수 있습니다.</div>
			<div>만약 숙제를 사용하지 않음 (X) 처리해 두었다면, 해당 숙제는 달성률에 영향을 끼치지 않습니다.</div>
			<br />
			<div>각 표의 세번째 행(이미지)을 클릭해 해당 숙제의 수행여부를 변경할 수 있습니다.</div>
			<div>수행여부를 변경할 때마다 변경 정보가 브라우저 저장소에 저장됩니다.</div>
			<div>예를들어 어떤 일일 숙제를 수행하였다면, 이 수행정보는 날짜가 변경되기 전까지 유지됩니다.</div>
			<div>주간숙제의 경우 날짜가 변경되더라도 초기화 요일 (월, 목)전까지 수행정보가 유지됩니다.</div>
			<br />
			<div>수행여부와 별개로 사용여부(첫번째 행)는 날짜 변경과 관계 없이 정보가 유지됩니다.</div>
			<div>따라서 일마다(혹은 주마다) 사용여부를 지정할 필요없이 한번 지정해둔 정보를 계속 사용할 수 있습니다.</div>
		</div>
	)
}

export default HomeworkHelp