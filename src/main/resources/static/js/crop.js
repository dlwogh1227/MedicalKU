import {enableBtn, disableBtn, changeBtn} from './uiHandlers.js'

let cropImg;
let preImg;
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

function clearCropPreview() {
    /* alert("크롭미리보기비움"); */
    $(".cropedImg").attr("src", "");
    $(".cropedImg").hide();
    croppedCanvas = null;
    $(".pre-img").show();
}

function setCropInterface () {
    /* 크롭 불러오기 */
    $(document).on("click", ".crop", function() {
        preImg = $(".pre-img")[0];
        if (cropImg) {
            cropImg.destroy(); // 이전 인스턴스를 제거
        }
        cropImg = new Cropper(preImg, {
            aspectRatio: 1,
            viewMode: 3,
            dragMode: 'move'
        });
        changeBtn("content_cut", "잘라내기", ".crop", "btn-crop button");
        disableBtn(".next");
        disableBtn(".reUpload");
    });
    /* 크롭 */
    $(document).on("click", ".btn-crop", function() {
        croppedCanvas = cropImg.getCroppedCanvas();
        /* console.log(`크롭된 이미지 크기: ${croppedCanvas.width} x ${croppedCanvas.height}`);
        croppedCanvas.toBlob(function(blob) {
            console.log(`크롭 사이즈: ${blob.size} bytes`);
        }); */
        /* console.log(croppedCanvas.toDataURL()); */
        $(".cropedImg").attr("src", croppedCanvas.toDataURL()).show();
        $(".pre-img").hide();
        changeBtn("close", "되돌리기", ".btn-crop", "re-crop button");

        clearCrop();

        enableBtn(".next");
        enableBtn(".reUpload");
        
        changeCroppedValue(true);
    });
    /* 크롭취소 */
    $(document).on("click", ".re-crop", function() {
        changeBtn("crop", "크롭", ".re-crop", "crop button");
        clearCropPreview();

        changeCroppedValue(false);
    }); 

}

export {cropped, croppedCanvas,changeCroppedValue, setCropInterface, clearCrop, clearCropPreview};
