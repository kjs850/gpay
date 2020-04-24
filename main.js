var mapContainer = document.getElementById("map"), // 지도를 표시할 div
    mapOption = {
        center: new kakao.maps.LatLng(37.272985, 127.048362), // 지도의 중심좌표
        level: 3, // 지도의 확대 레벨
    };


var map = new kakao.maps.Map(mapContainer, mapOption);

// 마커를 클릭하면 장소명을 표출할 인포윈도우 입니다
var infowindow = new kakao.maps.InfoWindow({
    zIndex: 1,
    removable: true,
});

var markers = []; // 마커를 담을 배열입니다
var gpay_places = [];

getCurrentLocation();

var geocoder = new kakao.maps.services.Geocoder();

var filename = "";
var category = "total";

kakao.maps.event.addListener(map, 'center_changed', function() {

    var level = map.getLevel();
    var latlng = map.getCenter();

    debouncedGetDisplayedPosition()

});

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


function getDisplayedPosition() {
    var p = map.getBounds();
    var x = (p.ea + p.ja) / 2;
    var y = (p.la + p.ka) / 2;

    geocoder.coord2Address(x, y, (x) => {
        try {
            // 축소를 계속하다보면 특정 레벨에서는 region_2depth_name에 구 정보를 보여주지 않아서 아래의 방어 로직 추가
            // "수원시 권선구" 이렇게 안나오고 "수원시" 이렇게 나옴.

            // if (x == undefined || x == undefined) return;
            let addr = x.address;
            if (Array.isArray(x)) {
                addr = x[0].address
            }
            // if (addr.region_2depth_name.split(" ").length == 1) return;
            // console.log(addr)

            const a =
                addr.region_1depth_name +
                "도" +
                addr.region_2depth_name.replace(" ", "") + addr.region_3depth_name;


            console.log('filename', filename, a)
            if (filename !== a) {
                filename = a;
                getData(category);
            }
        } catch (e) {
            console.log(e)
        }
    });
}

function debounce (f, delay) {
    var timeout = null;
    return function () {
        clearTimeout(timeout);
        timeout = setTimeout(f, delay);
    };
}
var debouncedGetDisplayedPosition = debounce(getDisplayedPosition, 500);

function refreshData() {}

getDisplayedPosition();

function removeMarker() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
    gpay_places = [];
    infowindow.close();
}

function getData(param) {
    category = param;

    // 선택된 메뉴 컬러를 변경 합니다.
    changeMenuColor();

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();

    var jsonLocation = "./json/basket.json";

    if (category != "") {
        jsonLocation = "./json/" + filename + "_" + category + ".json";
    }

    $.getJSON(jsonLocation, function(data) {
        $.each(data, function(i, item) {
            if (item.lat != "" && item.long != "") {
                savePlaces(item);
            }
        });

        $.each(gpay_places, function(i, ypay_place) {
            displayPlaces(ypay_place);
        });
    });
}

function savePlaces(item) {
    gpay_places.push({
        position: new kakao.maps.LatLng(
            item.lat,
            item.long
        ),
        imageIndex: item.imageIndex,
        items: item.items
    });
}

function displayPlaces(ypay_place) {


    console.log(ypay_place)

    var markerImageSrc = "http://t1.daumcdn.net/localimg/localimages/07/2018/pc/img/marker_theme.png";

    var imageSize = new kakao.maps.Size(30, 30)
    var imageOptions = {
        spriteOrigin: new kakao.maps.Point(0, ypay_place.imageIndex * 40),
        spriteSize: new kakao.maps.Size(30, 910)
    };

    var markerImage = new kakao.maps.MarkerImage(markerImageSrc, imageSize, imageOptions);
    // var marker = createMarker(coffeePositions[i], markerImage);  


    // 마커를 생성하고 지도에 표시합니다
    var marker = new kakao.maps.Marker({
        position: ypay_place.position,
        image: markerImage
    });
    marker.setMap(map);
    markers.push(marker);

    // 마커에 클릭이벤트를 등록합니다
    kakao.maps.event.addListener(marker, "click", function() {
        // 마커를 클릭하면 장소명이 인포윈도우에 표출됩니다

        var height = 100
        if (ypay_place.items.length == 2) {
            height = 200
        } else if (ypay_place.items.length > 2) {
            height = 300
        }
        var html = '<div style="padding:5px;font-size:12px;overflow-y: scroll;height:' + height + 'px;">';
        for (var i = 0; i < ypay_place.items.length; i++) {
            if (i > 0) html += "<hr>"

            var item = ypay_place.items[i]
            html += item.name + "<br>" +
                "<a href=tel:" + item.tel + ">" + item.tel + "</a>" +
                "<br>" +
                item.addr +
                "<br>" +
                item.indutype
        }

        html += "</div>"

        infowindow.setContent(html);
        infowindow.open(map, marker);
    });
}


function changeMenuColor() {
    var menus = ["total", "restaurant", 'coffee', 'oil', 'mart', 'car', 'hotel', 'medical', 'study', 'food', 'leisure', 'beauty', 'other']
    $.each(menus, function(i, menu) {
        if (category == menu) {
            $('#' + menu).css('background', 'silver');
        } else {
            $('#' + menu).css('background', 'white');
        }
    });
}