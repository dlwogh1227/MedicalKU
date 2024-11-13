import { createObject } from '../utils/utils.js';
import { validateFile } from '../utils/validationErrorHandler.js';
import { switchOriginalPreview, UpdateBtn } from '../ui/uiHandlers.js';
import { clearCrop, clearCroppedCanvas, changeCroppedValue } from '../imageProcess/cropHandler.js';

/* 마지막으로 선택한 파일 */
let lastSelectedFile;
/* 업로드 버튼 이벤트 처리 */
function setImgUploadBtn() {
    $(".upload-file").on("click", function() {
        $(".inputFile").click();
    });

    $(".reUpload").on("click", function() {
        $(".inputFile").click();

        UpdateBtn(createObject("#crop", "crop", "크롭",  "crop button"), "", "");
        clearCrop();
        clearCroppedCanvas();
        switchOriginalPreview();
        changeCroppedValue(false);
    });
}

/* 파일 input 변화*/
function FileInputChangeHandler(inputElement, changeUI, onSuccess, onError) {
    $(document).on("change", inputElement, function() {".inputFile"
        /* 파일이 새로첨부될때, 파일이 변경될때 */
        if (this.files.length == 1) {
            let file = uploadFileAction(this, changeUI);
            if(file) {
                readFile(file, onSuccess, onError);
            }
        } else { /* 파일 첨부 취소 */
            restorePreviousFile(this);
        }
    });
}
/* 파일 변경(첨부)시 실행, 유효성검사 및 UI 변경 호출*/
function uploadFileAction(inputElement, changePageUI) {
    if (!validateFile(inputElement)) {
        inputElement.value = '';
        restorePreviousFile(inputElement);
        return;
    }
    let file = inputElement.files[0];
    lastSelectedFile = file;
    /* alert("파일변경"); */
    changePageUI();

    return file;
}
/* 첨부 파일 이미지 데이터 읽기 */
function readFile(file, onSuccess, onError) {
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
        onSuccess(reader.result);
    }
    reader.onerror = function handleFileReadError() {
        onError();
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

export {FileInputChangeHandler, setImgUploadBtn};