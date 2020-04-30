function shareKakaotalk() {

    Kakao.Link.sendDefault({
        objectType:"feed"
        , content : {
            title:"경기 화폐 가맹점 맵, 경기 지역 화폐 가맹점 찾기"   // 콘텐츠의 타이틀
            , description:"경기 지역 화폐 사용처를 카테고리 별로 알려드립니다."   // 콘텐츠 상세설명
            , imageUrl:"https://g-pay.info/img/gpay_logo_white.png"   // 썸네일 이미지
            , link : {
                mobileWebUrl:"https://g-pay.info/"   // 모바일 카카오톡에서 사용하는 웹 링크 URL
                , webUrl:"https://g-pay.info/" // PC버전 카카오톡에서 사용하는 웹 링크 URL
            }
        }
        , buttons : [
            {
                title:"내 주변 사용처 확인"    // 버튼 제목
                , link : {
                    mobileWebUrl:"https://g-pay.info/"   // 모바일 카카오톡에서 사용하는 웹 링크 URL
                    , webUrl:"https://g-pay.info/" // PC버전 카카오톡에서 사용하는 웹 링크 URL
                }
            }
        ]
    });
}