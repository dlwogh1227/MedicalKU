import {enableBtn, disableBtn, changeBtn,  switchCroppedPreview, switchOriginalPreview} from './uiHandlers.js'

let cropImg;
let croppedCanvas
let cropped = false;

function changeCroppedValue(boolean) {
    cropped = boolean;
}

function clearCrop() {
    if(cropImg) {
        /* alert("크롭객체비움"); */
        cropImg.destroy();
        cropImg = null;
    }
}

function clearCroppedCanvas() {
    /* alert("크롭캔버스비움"); */
    croppedCanvas = null;
}

function setCropInterface () {
    /* 크롭 불러오기 */
    $(document).on("click", ".crop", function() {
        let preImg = $(".pre-img")[0];
        clearCrop();
        
        cropImg = new Cropper(preImg, {
            aspectRatio: 1,
            viewMode: 3,
            dragMode: 'move'
        });
        changeBtn(".crop", "content_cut", "잘라내기", "cut button");
        disableBtn(".next");
        disableBtn(".reUpload");
    });
    /* 잘라내기 */
    $(document).on("click", ".cut", function() {
        croppedCanvas = cropImg.getCroppedCanvas();
        /* console.log(`크롭된 이미지 크기: ${croppedCanvas.width} x ${croppedCanvas.height}`);
        croppedCanvas.toBlob(function(blob) {
            console.log(`크롭 사이즈: ${blob.size} bytes`);
        }); */
        /* console.log(croppedCanvas.toDataURL()); */
        switchCroppedPreview(croppedCanvas.toDataURL());
        changeBtn(".cut", "close", "되돌리기", "re-crop button");
        enableBtn(".next");
        enableBtn(".reUpload");

        clearCrop();

        changeCroppedValue(true);
    });
    /* 크롭취소 */
    $(document).on("click", ".re-crop", function() {
        changeBtn(".re-crop", "crop", "크롭", "crop button");
        clearCroppedCanvas();
        switchOriginalPreview();

        changeCroppedValue(false);
    }); 

}


