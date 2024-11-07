import {cropped, croppedCanvas} from './crop.js'
import { isNormalSkin } from './uiHandlers.js';

function ajaxDiagnosis(formData) {
    let minimumTime = 1500;
    let startTime = Date.now();
    setResponseUi(true);
    animateLoad(minimumTime);
    
    $.ajax({
        url: "/medicalku/diagnosis",
        type: "post",
        data: formData,
        processData: false, 
        contentType: false,
        timeout: 10000,  
        success: function(response) {

            let adjustmentTime = setResponseTime(startTime, minimumTime);

            setTimeout(function() {showResponse(response);}, adjustmentTime);
            /* csr */
            /*
            let str = "";
            str += "<div class='disease item'><div class='disease-result'>";
            str += "<div class='disease-name'><span>" + result.diseaseName + "</span></div>";
            str += "<div class='disease-probability'><span>" + result.probability + "% </span><span class='material-symbols-outlined icon'>vital_signs</span></div></div>";
            str += "<div class='disease-content'>" + result.diseaseContent + "</div></div>";
            str += " <div class='treatment item'><div class='treatment-title'><span>치료법</span><span class='material-symbols-outlined icon'>health_and_safety</span></div>";
            str += "<div class='treatment-content'>" + result.treatmentMethod + "</div></div>";
            $(".content").append(str); 
            */
        },
        error: function() {
            alert("결과받기 실패");
            console.log("결과받기 실패");
        }
    });
}

function submitImg() {
    $(".next").on("click", function(){

        var formData = new FormData();
        if(cropped) {
            /* alert("크롭이미지 존재"); */
            croppedCanvas.toBlob(function(blob) {
                let file = new File([blob], "croppedImage.png", {type: "image/png"});
                console.log(file);
                formData.append('upfile', file);
                ajaxDiagnosis(formData);
            });
        } else {
            /* alert("크롭이미지 없음"); */
            let file = $('.inputFile')[0].files[0];
            console.log(file);
            formData.append('upfile', file);
            ajaxDiagnosis(formData); 
        }
    });
}

function animateLoad(minimumTime) {
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

function setResponseUi (isLoading) {
    if(isLoading) {
        $(".load").show();
    }
    $(".progress-container").toggle();
    $(".pre-img-container").toggleClass("back-img");
}

function setResponseTime(startTime, minimumTime) {
    let responseInterval = Date.now() - startTime;
    let adjustmentTime = responseInterval - minimumTime;

    /* console.log(responseInterval); */
    if(adjustmentTime > 0) {
        return 0;
    } else {
        return -adjustmentTime;
    }
}

function showResponse(response) {
    console.log(response);
    $(".load").hide();
    $(".tip").toggle();
    $(".content").append(response);
    $(".probability").text(roundStringValue(".probability"));
    if($(".fail").length === 0) {
        $(".content").toggleClass("result-container");
        $(".pre-img-container").removeClass("item");
        $(".pre-img-container").toggleClass("result-item");
        $(".title-text").text("진단결과");
        $(".title").css("margin-bottom", "5%");
        appendElement(".pre-img-container", ".chart-container");
        appendElement(".pre-img-container", ".result-desease-container");
        appendElement(".pre-img-container", ".result-info");
        appendElement(".pre-img-container", ".specialist");
        $(".pre-img, .cropedImg").toggleClass("result-preview");
        $(".pre-img-container").toggleClass("result-preview-container");
        isNormalSkin();
    }
}  
/* let observer;
let isCallbackRunning = false;

function showResponse(response) {
    $(".load").hide();
    $(".content").append(response);
    $(".probability").text(roundStringValue(".probability"));

    observer = new MutationObserver(function(mutations) {
        if(isCallbackRunning) {
            return;
        }
        isCallbackRunning = true;
        mutations.forEach(function(mutation) {
            console.log("변화감지");

            if($(".fail").length === 0) {
                console.log("fail감지");
                $(".content").toggleClass("result-container");
                $(".pre-img-container").removeClass("item");
                $(".pre-img-container").toggleClass("result-item");
                $(".title-text").text("진단결과");
                $(".title").css("margin-bottom", "5%");
                appendElement(".pre-img-container", ".chart-container");
                appendElement(".pre-img-container", ".result-desease-container");
                appendElement(".pre-img-container", ".result-info");
                appendElement(".pre-img-container", ".specialist");
                $(".pre-img, .cropedImg").toggleClass("result-preview");
                $(".pre-img-container").toggleClass("result-preview-container");
                isNormalSkin();
                observer.disconnect();  
            }
        });
        isCallbackRunning = false;
    });

    observer.observe($(".content")[0], {
        childList: true,
        subtree: true
    });
} 
 */
/* function disconnectObserver() {
    observer.disconnect(); 
} */

function appendElement(position, element) {
    let newElement = $(element).detach();
    $(position).append(newElement);
}

export {submitImg, setResponseUi};