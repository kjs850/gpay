# GPAY

### 개발자 :

- [Boo Jongmin](https://github.com/boojongmin)
- [Ko Jaesung](https://github.com/kjs850)
- [Ahn Jaeha](https://github.com/eu81273)
- [Lee Jonguk](https://github.com/jonguk0114)

### vscode

chrome debugger

### 추가 설치

```bash
npm i -g live-server

live-server --port=8080 --no-browser --host=localhost --ignore="./jsonMaker/**"
```

### 데이터 받는 곳

[지역화폐 가맹점 현황](https://data.gg.go.kr/portal/data/service/selectServicePage.do?infId=3NPA52LBMO36CQEQ1GMY28894927&infSeq=1)

### 좌표로 행정동/법정동 조회 api 참조 메모

https://apis.map.kakao.com/web/sample/coord2addr/

```
function searchAddrFromCoords(coords, callback) {
    // 좌표로 행정동 주소 정보를 요청합니다
    geocoder.coord2RegionCode(coords.getLng(), coords.getLat(), callback);
}

function searchDetailAddrFromCoords(coords, callback) {
    // 좌표로 법정동 상세 주소 정보를 요청합니다
    geocoder.coord2Address(coords.getLng(), coords.getLat(), callback);
}
```
