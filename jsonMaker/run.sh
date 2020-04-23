#!/bin/bash

# <option value="\d+">\W+<\/option>  <- 파일 31개인지 확인
#<option value="41820">가평군</option><option value="41280">고양시</option><option value="41290">과천시</option><option value="41210">광명시</option><option value="41610">광주시</option><option value="41310">구리시</option><option value="41410">군포시</option><option value="41570">김포시</option><option value="41360">남양주시</option><option value="41250">동두천시</option><option value="41190">부천시</option><option value="41130">성남시</option><option value="41110">수원시</option><option value="41390">시흥시</option><option value="41270">안산시</option><option value="41550">안성시</option><option value="41170">안양시</option><option value="41630">양주시</option><option value="41830">양평군</option><option value="41670">여주시</option><option value="41800">연천군</option><option value="41370">오산시</option><option value="41460">용인시</option><option value="41430">의왕시</option><option value="41150">의정부시</option><option value="41500">이천시</option><option value="41480">파주시</option><option value="41220">평택시</option><option value="41650">포천시</option><option value="41450">하남시</option><option value="41590">화성시</option>


# arr=("41210" "41610" "41310" "41410" "41570" "41360" "41250" "41190" "41130" "41110" "41390" "41270" "41550" "41170" "41630" "41830" "41670" "41800" "41370" "41460" "41430" "41150" "41500" "41480" "41220" "41650" "41450" "41590" "41820" "41280" "41290")
arr=("41210" "41610" "41310" "41410" "41570" "41360" "41250" "41190" "41130" "41110" "41390" "41270" "41550" "41170" "41630" "41830" "41670" "41800" "41370" "41460" "41430" "41150" "41500" "41480" "41220" "41650" "41450" "41590" "41820" "41280" "41290")

# arr=("41110") # 수원

## curl https://data.gg.go.kr/portal/data/service/selectServicePage.do\?infId\=3NPA52LBMO36CQEQ1GMY28894927\&infSeq\=1 -I
## curl로 cookie값을 확인후 jssionid 변경해줘야함.

for i in "${arr[@]}"
do
  echo "run ${i}"
  curl "https://data.gg.go.kr/portal/data/sheet/downloadSheetData.do?rows=100&infId=3NPA52LBMO36CQEQ1GMY28894927&infSeq=1&downloadType=J&loc=&SIGUN_CD=${i}&CMPNM_NM=&INDUTYPE_NM=&REFINE_ROADNM_ADDR=&REFINE_LOTNO_ADDR=" \
  -H 'Connection: keep-alive' \
  -H 'Pragma: no-cache' \
  -H 'Cache-Control: no-cache' \
  -H 'Upgrade-Insecure-Requests: 1' \
  -H 'User-Agent: Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.113 Safari/537.36' \
  -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9' \
  -H 'Sec-Fetch-Site: same-origin' \
  -H 'Sec-Fetch-Mode: navigate' \
  -H 'Sec-Fetch-Dest: iframe' \
  -H 'Referer: https://data.gg.go.kr/portal/data/service/selectServicePage.do?infId=3NPA52LBMO36CQEQ1GMY28894927&infSeq=1' \
  -H 'Accept-Language: ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7' \
  -H 'Cookie: _ga=GA1.3.1716443046.1587086522; JSESSIONID=5kLthlNxNC9xww3j823Je51fnCWzyOCRpFlywJMxr3uINDnY4nmj6mxfRxdjY2FJ.amV1c19kb21haW4vc2VydmVyMQ==; _gid=GA1.3.1076144690.1587470520; _gat=1; _voicemonjs.ttsmode=false; _voicemonjs.controllbarType=1; _voicemonjs.controlbarPosition=BR; _voicemonjs.controlbarScreenZoom=3; _voicemonjs.controlbarContrastMode=0; _voicemonjs.controlbarContrast=1; _voicemonjs.controlbarZoom=3; _voicemonjs.controlbarZoomContrast=1; _voicemonjs.controlbarHighlightColor=1; _voicemonjs.voiceVolume=M; _voicemonjs.voicePitch=M; _voicemonjs.voiceSpeed=M; _voicemonjs.zoomPanelmode=0; _voicemonjs.controlbarSkinColor=0054FF; _voicemonjs.cpanel_showmode=1; wcs_bt=e3e3ef78216a94:1587470524; _voicemonjs.option_change_flag=true; _voicemonjs.controlbarHighlight=0' \
  -o "./input/${i}.json"

  # curl "https://data.gg.go.kr/portal/data/sheet/downloadSheetData.do?rows=100&infId=3NPA52LBMO36CQEQ1GMY28894927&infSeq=1&downloadType=J&loc=&SIGUN_CD=${i}&CMPNM_NM=&INDUTYPE_NM=&REFINE_ROADNM_ADDR=&REFINE_LOTNO_ADDR=" -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:75.0) Gecko/20100101 Firefox/75.0' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' -H 'Accept-Language: ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3' --compressed -H 'Connection: keep-alive' -H 'Referer: https://data.gg.go.kr/portal/data/service/selectServicePage.do?infId=3NPA52LBMO36CQEQ1GMY28894927&infSeq=1' -H 'Cookie: JSESSIONID=737fSF4JauYhKbrJkYcVJdTcU9GuTb6a9Y7kjCBo3hvo7J4J4Cs3rdbzjqCNzdTY.amV1c19kb21haW4vc2VydmVyMQ==; wcs_bt=e3e3ef78216a94:1587101474; _ga=GA1.3.1616550693.1587099687; _gid=GA1.3.268667941.1587099687; _voicemonjs.option_change_flag=true; _voicemonjs.ttsmode=false; _voicemonjs.controllbarType=1; _voicemonjs.controlbarPosition=BR; _voicemonjs.controlbarScreenZoom=3; _voicemonjs.controlbarContrastMode=0; _voicemonjs.controlbarContrast=1; _voicemonjs.controlbarZoom=3; _voicemonjs.controlbarZoomContrast=1; _voicemonjs.controlbarHighlight=0; _voicemonjs.controlbarHighlightColor=1; _voicemonjs.voiceVolume=M; _voicemonjs.voicePitch=M; _voicemonjs.voiceSpeed=M; _voicemonjs.zoomPanelmode=0; _voicemonjs.controlbarSkinColor=0054FF; _voicemonjs.cpanel_showmode=1' -H 'Upgrade-Insecure-Requests: 1' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -o "./input/${i}.json"
done

echo "$(ls ./input | wc -l)개의 데이터를 다운받았습니다."

echo "데이터 변환을 시작합니다."
node index.js
echo "$(ls ../json | wc -l)개의 데이터가 생성되었습니다."