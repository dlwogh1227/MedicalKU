import {changePage, setPreview, changeBtn, disableBtn, enableBtn, switchCroppedPreview, switchOriginalPreview} from './uiHandlers.js';
import { validateFile } from './validationErrorHandler.js';

let lastSelectedFile;
/* 파일 input 변화*/
function FileInputChangeHandler() {
    $(document).on("change", ".inputFile", function() {
        /* 파일이 새로첨부될때, 파일이 변경될때 */
        if (this.files.length == 1) {
            uploadFileAction(this);
        } else { /* 파일 첨부 취소 */
            restorePreviousFile(this);
        }
    });
}
/* 파일 변경(첨부)시 실행, 유효성검사 및 UI 변경 호출*/
function uploadFileAction(inputElement) {
    if (!validateFile(inputElement)) {
        return;
    }
    let file = inputElement.files[0];
    lastSelectedFile = file
    /* alert("파일변경"); */
    readFile(file);
    changePage();
}
/* 파일 읽기, 미리보기 UI 호출 및 에러처리*/
function readFile(file) {
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
        setPreview(reader.result);  
    }
    reader.onerror = function handleFileReadError() {
        alert("파일을 읽는데 실패 했습니다.");
        return;
    }
}
/* 파일 선택 취소시 실행, 파일 복구 */
function restorePreviousFile(inputElement) {
    /* alert("파일복구"); */
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(lastSelectedFile);
    inputElement.files = dataTransfer.files;
    console.log("파일원본유지");
}


/* 크롭 객체,상태 관리 */
let cropObj;
let croppedCanvas
let cropped = false;

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

/* 업로드-리업로드 이벤트 */
function setImgUploadBtn() {
    $(".upload-file").on("click", function() {
        $(".inputFile").click();
    });

    $(".reUpload").on("click", function() {
        $(".inputFile").click();
        changeBtn("#crop", "crop", "크롭",  "crop button");
        clearCrop();
        clearCroppedCanvas();
        switchOriginalPreview();
        changeCroppedValue(false);
    });

}

/* 크롭 이벤트, 액션 설정 */
function setCrop(selector) {
    setCropHandler(selector);
    setCropAction();
    setCropCancel();
}
function setCropHandler(selector) {
    $(document).on("click", ".crop", function() {
        let preImg = $(selector)[0];
        clearCrop();
        
        cropObj = new Cropper(preImg, {
            aspectRatio: 1,
            viewMode: 3,
            dragMode: 'move'
        });
        changeBtn(".crop", "content_cut", "잘라내기", "cut button");
        disableBtn(".next");
        disableBtn(".reUpload");
    });
}
function setCropAction() {
    $(document).on("click", ".cut", function() {
        croppedCanvas = cropObj.getCroppedCanvas();

        croppedCanvas.toBlob(function(blob) {
            console.log(`크롭 사이즈: ${blob.size} bytes`);
        }); 

        switchCroppedPreview(croppedCanvas.toDataURL());
        changeBtn(".cut", "close", "되돌리기", "re-crop button");
        enableBtn(".next");
        enableBtn(".reUpload");

        clearCrop();

        changeCroppedValue(true);
    });
}
function setCropCancel() {
    $(document).on("click", ".re-crop", function() {
        changeBtn(".re-crop", "crop", "크롭", "crop button");
        clearCroppedCanvas();
        switchOriginalPreview();

        changeCroppedValue(false);
    }); 
}

export {FileInputChangeHandler, setImgUploadBtn};
export {cropped, croppedCanvas, changeCroppedValue, clearCrop, clearCroppedCanvas, setCrop};