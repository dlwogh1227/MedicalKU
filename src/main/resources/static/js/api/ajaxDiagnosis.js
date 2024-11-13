/* ajaxDiagnosis.js */
import { setResponseUi, showResponse } from '../ui/uiHandlers.js';
import { getCropped, getCroppedCanvas } from '../imageProcess/cropHandler.js';
import { responseErrorHandler } from '../utils/validationErrorHandler.js';

/* @통신 */

/* 최소 응답시간 */
let minimumResponseTime = 1500;
/* 응답시간(조정) 계산 */
function setResponseTime(startTime) {
    let responseTime = Date.now() - startTime;
    let adjustmentTime = responseTime - minimumResponseTime;

    if(adjustmentTime > 0) {
        return 0;
    } else {
        return -adjustmentTime;
    }
}
/* 파일 제출 액션 */
function submitAction(setUi) {
    $(".next").on("click", function(){
        createFormData();
        setUi(minimumResponseTime);
        $(".scan-effect").toggle();
        $(".scan-effect").css('animation', 'scan-move 1.5s linear infinite');
    });
}
/* form 데이터 생성 */
function createFormData() {
    var formData = new FormData();

    if(getCropped()) {
        /* alert("크롭이미지 존재"); */
        getCroppedCanvas().toBlob(function(blob) {
            let file = new File([blob], "croppedImage.png", {type: "image/png"});
            console.log("크롭:");
            console.log(file);
            formData.append('upfile', file);
            ajaxDiagnosis(formData, showResponse, responseErrorHandler);
        });
    } else {
        /* alert("크롭이미지 없음"); */
        let file = $('.inputFile')[0].files[0];
        console.log("원본:");
        console.log(file);
        formData.append('upfile', file);

        ajaxDiagnosis(formData, showResponse, responseErrorHandler);
    }
}
/* 통신 구현 */
function ajaxDiagnosis(formData, onSuccess, onError) {
    let startTime = Date.now();
    
    $.ajax({
        url: "/medicalku/diagnosis",
        /* url: "/medicalku/diagnosi",  */
        type: "post",
        data: formData,
        processData: false, 
        contentType: false,
        timeout: 10000,  
        success: function(response) {

            let adjustmentTime = setResponseTime(startTime);

            setTimeout(function() {onSuccess(response);}, adjustmentTime);
        },
        error: function(xhr, textStatus, errorThrown) {
            onError(xhr, textStatus, errorThrown);
            console.log("응답 실패");
        }
    });
}

export {createFormData, setResponseUi, submitAction};