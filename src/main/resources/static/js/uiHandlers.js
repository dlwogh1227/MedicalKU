import {setResponseUi} from './ajaxDiagnosis.js'

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
        revertUploadUi();
    });
}


function revertUploadUi() {
    $(".progress-bar").css("width", "0%");
    $(".fail, .retry").remove();
    $(".tip, .progress-container").toggle();
    $(".pre-img-container").toggleClass("back-img");
}

function changeBtn(icon, text, Selector, newClass) {
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

function isNormalSkin() {
    console.log("원래 순서2");
    if($(".ns").val() == 1) {
        $(".result-container").toggleClass("result-normalSkin-container");
        $(".result-item").toggleClass("result-nomalSkin-item");
    }

}


export {changeBtn, disableBtn, enableBtn, btnEvents ,isNormalSkin};


