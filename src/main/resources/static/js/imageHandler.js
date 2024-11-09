

/*@ 파일 업로드, 리업로드 */

/* 변수 */
let lastSelectedFile;
/* 파일 input 변화*/
function FileInputChangeHandler(changeUI) {
    /* let {changePageUI, changePageSubUI} = changeUI;
    console.log(typeof changePageUI); // "function"이어야 함
    console.log(typeof changePageSubUI); */
    $(document).on("change", ".inputFile", function() {
        
        /* 파일이 새로첨부될때, 파일이 변경될때 */
        if (this.files.length == 1) {
            uploadFileAction(this, changeUI);
        } else { /* 파일 첨부 취소 */
            restorePreviousFile(this);
        }
    });
}
/* 파일 변경(첨부)시 실행, 유효성검사 및 UI 변경 호출*/
function uploadFileAction(inputElement, {changePageUI, changePageSubUI}) {
    if (!validateFile(inputElement)) {
        inputElement.value = '';
        restorePreviousFile(inputElement);
        return;
    }
    let file = inputElement.files[0];
    lastSelectedFile = file
    /* alert("파일변경"); */
    readFile(file, changePageSubUI);
    changePageUI();
}
/* 첨부 파일 이미지 데이터 읽기 */
function readFile(file, changePreviewUI) {
    let reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = function () {
        changePreviewUI(reader.result);
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

/* 업로드-리업로드 이벤트 */
function setImgUploadBtn() {
    $(".upload-file").on("click", function() {
        $(".inputFile").click();
    });

    $(".reUpload").on("click", function() {
        $(".inputFile").click();

        UpdateBtn(createBtnParams("#crop", "crop", "크롭",  "crop button"), "", "");
        clearCrop();
        clearCroppedCanvas();
        switchOriginalPreview();
        changeCroppedValue(false);
    });

}

/*@ 크롭 이벤트, 액션 설정 */

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
/* 객체 리터럴 생성(데이터)*/
function createBtnParams(selector, icon, text, newClass) {
    return { selector, icon, text, newClass };
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

/* export {FileInputChangeHandler, setImgUploadBtn};
export {getCropped, getCroppedCanvas, createBtnParams, setCrop}; */