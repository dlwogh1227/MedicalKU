import { setCrop } from './imageHandler.js';
import { createFormData } from './ajaxDiagnosis.js'

/* 기타 버튼 */
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
}

/* 이미지 처리 UI */
function changePage() {
    $(".help, .upload-file").hide();
    $(".back-home, .pre-img-container, .progress-container").show();
    $(".tip").text("tip: 정확한 진단을 위해 첨부한 사진을 잘라보세요!");
    setCrop(".pre-img");
    changePage = function() {
    };
}
function setPreview(imgUrl) {
    $(".pre-img").attr("src", imgUrl);
}
/* 버튼 변경 */
function changeBtn(Selector, icon, text, newClass) {
    $(Selector + ">span").eq(0).text(icon);
    $(Selector + ">span").eq(1).text(text);
    $(Selector).attr("class", newClass);
}
function disableBtn(selector) {
    $(selector).css("pointer-events", "none");
    $(selector).css("opacity", "0.5");
}
function enableBtn(selector) {
    $(selector).css("pointer-events", "all");
    $(selector).css("opacity", "1");
}
/* 원본미리보기-크롭이미지미리보기 전환 */
function switchCroppedPreview(imgUrl) {
    $(".cropedImg").attr("src", imgUrl).show();
    $(".pre-img").hide();
}
function switchOriginalPreview() {
    $(".cropedImg").attr("src", "");
    $(".cropedImg").hide();
    $(".pre-img").show();
}



/* 3페 */
/* 제출버튼 */
function submitBtn() {
    $(".next").on("click", function(){
        createFormData();
    });
}
/* 로딩화면 UI */
function setResponseUi() {
    $(".load").show();
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
/* 업로드 화면 복구(실패케이스) */
function restoreUploadUi() {
    $(".progress-bar").css("width", "0%");
    $(".fail, .retry").remove();
    $(".tip, .progress-container").toggle();
    $(".pre-img-container").toggleClass("back-img"); /* 클래스 추가 */
}
/* 정상피부 UI */
function isNormalSkin() {
    if($(".ns").val() == 1) {
        $(".result-container").toggleClass("result-normalSkin-container");
        $(".result-item").toggleClass("result-nomalSkin-item");
    }
}
/* 요소추가 */
function appendElement(position, element) {
    let newElement = $(element).detach();
    $(position).append(newElement);
}
/* 반올림 */
function roundStringValue(selector) {
    let str = $(selector).text();
    let roundVal = Math.round(parseFloat(str));
    if (!isNaN(roundVal)) {
        return roundVal;
    } else {
        console.log("부적절한 확률값");
        return ""; 
    }
}
/* 결과화면 */
function showResponse(response) {
    /* console.log(response) */
    $(".load").hide();
    $(".tip").toggle();
    $(".content").append(response);
    if($(".fail").length == 0) {
        $(".content").toggleClass("result-container");  /* 레이아웃 조정 */
        $(".pre-img-container").removeClass("item");
        $(".pre-img-container").toggleClass("result-item");
        $(".title-text").text("진단결과");              /* 타이틀 조정 */
        $(".title").css("margin-bottom", "5%");
        $(".desease-rate").text(roundStringValue(".desease-rate"));   /* 반올림 */
        appendElement(".pre-img-container", ".chart-container");    /* 요소 추가(재배치) */
        appendElement(".pre-img-container", ".result-desease-container");
        appendElement(".pre-img-container", ".result-info");
        appendElement(".pre-img-container", ".specialist");
        $(".pre-img-container").toggleClass("result-preview-container");    /* 미리보기 이미지 레이아웃 변경 */
        $(".pre-img, .cropedImg").toggleClass("result-preview");    /* 미리보기 이미지 레이아웃 변경 */
        isNormalSkin();                                 /* 정상피부 검사 */
    }
}

/* 에러화면 */
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
    $('.content').css("width", "1000px");
    $('.content').append(setErrorPage());
    $(".error-text").text(str);
    $(".error-text-sub").text(substr);
}

export {changeBtn, disableBtn, enableBtn, btnEvents};
export {changePage, setPreview, switchCroppedPreview, switchOriginalPreview}; /* 2페 */
export {submitBtn, animateLoading, setResponseUi, showResponse}; /* 3페 */
export {showErrorPage};

