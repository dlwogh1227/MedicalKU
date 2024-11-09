import { roundStringValue, appendElement } from "../utils/utils.js";
/* uiHandlers.js */

/* @버튼 */
/* 버튼 이벤트 */
function btnEvents() {
    $(".back-home>span, header>span").on("click", function() {
        window.location.href = '/medicalku/home'; 
    });

    $(".info-btn").on("click", function() {
        $(".info").toggle();
    });

    $(".close-btn").on("click", function() {
        $(".info").hide();
    });

    $(document).on("click", ".retry", function(){
        restoreUploadUi();
    });
    $(document).on("click", ".specialist", function(){
        window.open('https://www.kuh.ac.kr/medical/dept/deptIntro.do?dept_cd=000290', '_blank');
    });
    $(document).on("click", ".home-btn", function(){
        window.location.href = '/medicalku/home'; 
    });
}
/* 버튼 속성 변경 */
function changeBtn(selector, icon, text, newClass) {
    $(selector + ">span").eq(0).text(icon);
    $(selector + ">span").eq(1).text(text);
    $(selector).attr("class", newClass);
}
function disableBtn(selector) {
    $(selector).css("pointer-events", "none");
    $(selector).css("opacity", "0.5");
}
function enableBtn(selector) {
    $(selector).css("pointer-events", "all");
    $(selector).css("opacity", "1");
}
function UpdateBtn(changeBtnParam, enableBtnParam, disableBtnParam) {
    if(changeBtnParam && Object.keys(changeBtnParam).length == 4) {
        let {selector, icon, text, newClass} = changeBtnParam;
        changeBtn(selector, icon, text, newClass);
    }
    if(enableBtnParam) {
        enableBtn(enableBtnParam);
    }
    if(disableBtnParam) {
        disableBtn(disableBtnParam);
    }
}


/* @이미지 처리 UI */
/* 이미지 처리화면 UI */
function changePage() {
    $(".help, .upload-file").hide();
    $(".back-home, .pre-img-container, .progress-container").show();
    $(".tip").text("tip: 정확한 진단을 위해 첨부한 사진을 잘라보세요!");
    changePage = function() {
    };
}
/* 프리뷰 UI */
function showPreview(imgUrl) {
    $(".pre-img").attr("src", imgUrl);
}
/* 프리뷰 실패 화면 */
function showReadError() {
    alert("파일데이터 읽기 실패");
}
/* 원본프리뷰UI-크롭프리뷰UI 전환 */
function switchCroppedPreview(imgUrl) {
    $(".cropedImg").attr("src", imgUrl).show();
    $(".pre-img").hide();
}
function switchOriginalPreview() {
    $(".cropedImg").attr("src", "");
    $(".cropedImg").hide();
    $(".pre-img").show();
}
/* 결과화면 -> 이미지 처리화면 전환 */
function restoreUploadUi() {
    $(".progress-bar").css("width", "0%");
    $(".fail, .retry").remove();
    $(".tip, .progress-container").toggle();
    $(".pre-img-container").toggleClass("back-img"); /* 클래스 추가 */
}


/* @ 결과화면 */

/* 로딩화면 UI */
function setResponseUi(minimumTime) {
    $(".load").show();
    animateLoading(minimumTime);
    $(".progress-container").toggle();
    $(".pre-img-container").toggleClass("back-img"); /* 클래스 지움 */
}
/* 로딩화면 UI (애니메이션) */
function animateLoading(minimumTime) {
    /* let startTime = Date.now(); */ 
    // 로딩바
    $(".progress-bar").animate({
        width: "100%"
    }, {duration: minimumTime-500,
        easing: 'linear' ,
       /*  complete: function(){
            let endTime = Date.now(); 
            let animationDuration = endTime - startTime;  
            console.log('애니메이션 시간: ' + animationDuration + ' ms');} */
    }); 
}
/* 결과 화면 UI */
function showResponse(response) {
    /* console.log(response) */
    $(".load").hide();
    $(".tip").toggle();
    $(".content").append(response);
    $(".scan-effect ").toggle();
    if($(".fail").length == 0) {
        $(".content").toggleClass("result-container");  /* 레이아웃 조정 */
        $(".pre-img-container").removeClass("item");
        $(".pre-img-container").toggleClass("result-item");
        $(".title-text").text("진단결과");              /* 타이틀 조정 */
        $(".title").css("margin-bottom", "5%");
        $(".desease-rate1").text(roundStringValue(".desease-rate1"));
        $(".desease-rate2").text(roundStringValue(".desease-rate2")); 
        $(".desease-rate3").text(roundStringValue(".desease-rate3"));    /* 반올림 */
        appendElement(".pre-img-container", ".chart-container");    /* 요소 추가(재배치) */
        appendElement(".pre-img-container", ".result-desease-container");
        appendElement(".pre-img-container", ".result-info");
        appendElement(".pre-img-container", ".specialist");
        $(".pre-img-container").toggleClass("result-preview-container");    /* 미리보기 이미지 레이아웃 변경 */
        $(".pre-img, .cropedImg").toggleClass("result-preview");    /* 미리보기 이미지 레이아웃 변경 */
        isNormalSkin();                                 /* 정상피부 검사 */
    }
}
/* 정상피부 일떄 UI 결정 */
function isNormalSkin() { 
    if($(".ns").val() == 1) {
        $(".result-container").toggleClass("result-normalSkin-container");
        $(".result-item").toggleClass("result-nomalSkin-item");
    }
}



/* @에러화면 */
function setErrorPage() {
    let htmlstr;
    htmlstr = "<div class='item error-container'>";
    htmlstr += "<span class='material-symbols-outlined error-icon'>error</span>";
    htmlstr += "<span class='error-text'></span>";
    htmlstr += "<span class='error-text-sub'></span>";
    htmlstr += "<span class='home-btn'><span class='material-symbols-outlined'>home</span>홈으로</span>";
    htmlstr += "</div>";

    return htmlstr;
}
function showErrorPage(str,substr) {

    $('.content').empty();
    $('.content').css("width", "1200px");
    $('.content').append(setErrorPage());
    $(".error-text").text(str);
    $(".error-text-sub").text(substr);
}

export {btnEvents, changePage, showPreview, showReadError, UpdateBtn, animateLoading, setResponseUi}; /* 메인 */
export {switchCroppedPreview, switchOriginalPreview}; /* 2페 */
export {showResponse}; /* 3페 */
export {showErrorPage};

