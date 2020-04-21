#!/bin/bash
# arr=("41210" "41610" "41310" "41410" "41570" "41360" "41250" "41190" "41130" "41110" "41390" "41270" "41550" "41170" "41630" "41830" "41670" "41800" "41370" "41460" "41430" "41150" "41500" "41480" "41220" "41650" "41450" "41590" "41820" "41280" "41290")
arr=("41210" "41610" "41310" "41410" "41570" "41360" "41250" "41190" "41130" "41110" "41390" "41270" "41550" "41170" "41630" "41830" "41670" "41800" "41370" "41460" "41430" "41150" "41500" "41480" "41220" "41650" "41450" "41590" "41820" "41280" "41290")

for i in "${arr[@]}"
do
  echo "run ${i}"
  curl "https://data.gg.go.kr/portal/data/sheet/downloadSheetData.do?rows=100&infId=3NPA52LBMO36CQEQ1GMY28894927&infSeq=1&downloadType=J&loc=&SIGUN_CD=${i}&CMPNM_NM=&INDUTYPE_NM=&REFINE_ROADNM_ADDR=&REFINE_LOTNO_ADDR=" -H 'User-Agent: Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:75.0) Gecko/20100101 Firefox/75.0' -H 'Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8' -H 'Accept-Language: ko-KR,ko;q=0.8,en-US;q=0.5,en;q=0.3' --compressed -H 'Connection: keep-alive' -H 'Referer: https://data.gg.go.kr/portal/data/service/selectServicePage.do?infId=3NPA52LBMO36CQEQ1GMY28894927&infSeq=1' -H 'Cookie: JSESSIONID=737fSF4JauYhKbrJkYcVJdTcU9GuTb6a9Y7kjCBo3hvo7J4J4Cs3rdbzjqCNzdTY.amV1c19kb21haW4vc2VydmVyMQ==; wcs_bt=e3e3ef78216a94:1587101474; _ga=GA1.3.1616550693.1587099687; _gid=GA1.3.268667941.1587099687; _voicemonjs.option_change_flag=true; _voicemonjs.ttsmode=false; _voicemonjs.controllbarType=1; _voicemonjs.controlbarPosition=BR; _voicemonjs.controlbarScreenZoom=3; _voicemonjs.controlbarContrastMode=0; _voicemonjs.controlbarContrast=1; _voicemonjs.controlbarZoom=3; _voicemonjs.controlbarZoomContrast=1; _voicemonjs.controlbarHighlight=0; _voicemonjs.controlbarHighlightColor=1; _voicemonjs.voiceVolume=M; _voicemonjs.voicePitch=M; _voicemonjs.voiceSpeed=M; _voicemonjs.zoomPanelmode=0; _voicemonjs.controlbarSkinColor=0054FF; _voicemonjs.cpanel_showmode=1' -H 'Upgrade-Insecure-Requests: 1' -H 'Pragma: no-cache' -H 'Cache-Control: no-cache' -o "./input/${i}.json"
done

node index.js

