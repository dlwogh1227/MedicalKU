import {cropped, croppedCanvas} from './imageHandler.js'
import {animateLoading, setResponseUi, showResponse} from './uiHandlers.js';
import { ajaxErrorHandler } from './validationErrorHandler.js';
/* form 데이터 */
function createFormData() {
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
}
/* 통신 */
function ajaxDiagnosis(formData) {
    let minimumTime = 1500;
    let startTime = Date.now();
    setResponseUi();
    animateLoading(minimumTime);
    
    $.ajax({
        url: "/medicalku/diagnosis", 
        /* url: "/medicalku/diagnosi", */
        type: "post",
        data: formData,
        processData: false, 
        contentType: false,
        timeout: 10000,  
        success: function(response) {

            let adjustmentTime = setResponseTime(startTime, minimumTime);

            setTimeout(function() {showResponse(response);}, adjustmentTime);
        },
        error: function(xhr, textStatus, errorThrown) {
            ajaxErrorHandler(xhr, textStatus, errorThrown);
            console.log("응답 실패");
        }
    });
}
/* 응답시간(조정) 계산 */
function setResponseTime(startTime, minimumTime) {
    let responseInterval = Date.now() - startTime;
    let adjustmentTime = responseInterval - minimumTime;

    if(adjustmentTime > 0) {
        return 0;
    } else {
        return -adjustmentTime;
    }
}

export {createFormData, setResponseUi};