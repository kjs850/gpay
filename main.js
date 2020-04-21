var mapContainer = document.getElementById("map"), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(127.04467328158901, 37.276004970303035), // 지도의 중심좌표, 용인시청
        level: 3, // 지도의 확대 레벨
    };

var map = new kakao.maps.Map(mapContainer, mapOption);

// 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
var infowindow = new kakao.maps.InfoWindow({
    zIndex: 1,
    removable: true,
});

var markers = []; // 마커를 담을 배열입니다
var ypay_places = [];

getCurrentLocation();

var geocoder = new kakao.maps.services.Geocoder();

var filename = "";
var category = "restaurant";

function getDisplayedPosition() {
    var p = map.getBounds();
    var x = (p.ea + p.ja) / 2;
    var y = (p.la + p.ka) / 2;

    geocoder.coord2Address(x, y, (x) => {
        try {
            // 축소를 계속하다보면 특정 레벨에서는 region_2depth_name에 구 정보를 보여주지 않아서 아래의 방어 로직 추가
            // "수원시 권선구" 이렇게 안나오고 "수원시" 이렇게 나옴.
            console.log(x[0].address.region_1depth_name, x[0].address.region_2depth_name, x[0].address.region_3depth_name)
            if (x[0].address.region_2depth_name.split(" ").length == 1) return;
            const a =
                x[0].address.region_1depth_name +
                "도" +
                x[0].address.region_2depth_name.replace(" ", "") + x[0].address.region_3depth_name;

            if (filename !== a) {
                filename = a;
                getData(category);
            }
        } catch (e) {
            console.log(e)
        }
    });
}

function refreshData() {}

getDisplayedPosition();

setInterval(function() {
    getDisplayedPosition();
}, 3000);

function getCurrentLocation() {
    // HTML5의 geolocation으로 사용할 수 있는지 확인합니다
    if (navigator.geolocation) {
        // GeoLocation을 이용해서 접속 위치를 얻어옵니다
        navigator.geolocation.getCurrentPosition(function(position) {
            var lat = position.coords.latitude, // 위도
                lon = position.coords.longitude; // 경도
            var locPosition = new kakao.maps.LatLng(lat, lon); // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
            // 지도 중심좌표를 접속위치로 변경합니다
            map.setCenter(locPosition);
        });
    }
}

function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
    ypay_places = [];
    infowindow.close();
}

function getData(param) {
    console.log(filename, category);
    category = param;
    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();

    var jsonLocation = "./json/basket.json";

    if (category != "") {
        jsonLocation = "./json/" + filename + "_" + category + ".json";
    }

    $.getJSON(jsonLocation, function(data) {
        console.log(data);
        $.each(data, function(i, item) {
            if (item.REFINE_WGS84_LAT != "" && item.REFINE_WGS84_LOGT != "") {
                savePlaces(item);
            }
        });
        console.log("finish load data!");

        $.each(ypay_places, function(i, ypay_place) {
            displayPlaces(ypay_place);
        });
    });
}

function savePlaces(item) {
    // console.log("====== savePlaces : " +item.REFINE_WGS84_LAT  + ", " + item.REFINE_WGS84_LOGT + ", " + item.CMPNM_NM);
    ypay_places.push({
        position: new kakao.maps.LatLng(
            item.REFINE_WGS84_LAT,
            item.REFINE_WGS84_LOGT
        ),
        CMPNM_NM: item.CMPNM_NM,
        TELNO: item.TELNO,
        REFINE_LOTNO_ADDR: item.REFINE_LOTNO_ADDR,
        INDUTYPE_NM: item.INDUTYPE_NM,
    });
}

function displayPlaces(ypay_place) {
    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({
        position: ypay_place.position,
    });
    marker.setMap(map);
    markers.push(marker);

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, "click", function() {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다
        infowindow.setContent(
            '<div style="padding:5px;font-size:12px;">' +
            ypay_place.CMPNM_NM +
            "<br>" +
            "<a href=tel:" +
            ypay_place.TELNO +
            ">" +
            ypay_place.TELNO +
            "</a>" +
            "<br>" +
            ypay_place.REFINE_LOTNO_ADDR +
            "<br>" +
            ypay_place.INDUTYPE_NM +
            "</div>"
        );
        infowindow.open(map, marker);
    });
}