import { UpdateBtn, switchCroppedPreview, switchOriginalPreview } from '../ui/uiHandlers.js';

/*@ 크롭 상태, 이벤트, 액션 관리 */

let cropObj;
let croppedCanvas
let cropped = false;
/* 변수 get */
function getCroppedCanvas() {
    return croppedCanvas;
}
function getCropped() {
    return cropped;
}
/* 변수 조작 */
function setCropObj(selector){
    let preImg = $(selector)[0];
    clearCrop();
    
    cropObj = new Cropper(preImg, {
        aspectRatio: 1,
        viewMode: 3,
        dragMode: 'move'
    })
}
function changeCroppedValue(boolean) {
    cropped = boolean;
}
function clearCrop() {
    if(cropObj) {
        /* alert("크롭객체비움"); */
        cropObj.destroy();
        cropObj = null;
    }
}
function clearCroppedCanvas() {
    /* alert("크롭캔버스비움"); */
    croppedCanvas = null;
}

/* 크롭인터페이스 */
function setCrop(selector, paramObj) {
    setCropController(selector, paramObj.controller);
    setCropAction(paramObj.action);
    setCropCancel(paramObj.cancel);
}
/* 크롭세팅 */
function setCropController(selector, paramObj) {
    $(document).on("click", ".crop", function() {
        setCropObj(selector)
        let {changeBtnParam, enableBtnParam, disableBtnParam} = paramObj;
        UpdateBtn(changeBtnParam, enableBtnParam, disableBtnParam);
    });
}
/* 자르기 */
function setCropAction(paramObj) {
    $(document).on("click", ".cut", function() {
        croppedCanvas = cropObj.getCroppedCanvas();

        croppedCanvas.toBlob(function(blob) {
            console.log(`크롭 사이즈: ${blob.size} bytes`);
        }); 

        switchCroppedPreview(croppedCanvas.toDataURL());
        let {changeBtnParam, enableBtnParam, disableBtnParam} = paramObj;
        UpdateBtn(changeBtnParam, enableBtnParam, disableBtnParam);

        clearCrop();
        changeCroppedValue(true);
    });
}
/* 자르기 취소 */
function setCropCancel(paramObj) {
    $(document).on("click", ".re-crop", function() {
        let {changeBtnParam, enableBtnParam, disableBtnParam} = paramObj;
        UpdateBtn(changeBtnParam, enableBtnParam, disableBtnParam);

        clearCroppedCanvas();
        switchOriginalPreview();

        changeCroppedValue(false);
    }); 
}

export {getCropped, getCroppedCanvas, clearCrop, clearCroppedCanvas, changeCroppedValue, setCrop};