import { checkNetworkStatus } from '../utils/validationErrorHandler.js';
import { createBtnParams } from '../utils/utils.js';
import { btnEvents, changePage, showPreview, showReadError, setResponseUi } from '../ui/uiHandlers.js';
import { FileInputChangeHandler, setImgUploadBtn } from '../imageProcess/fileUploadHandler.js';
import { setCrop } from '../imageProcess/cropHandler.js';
import { submitAction } from '../api/ajaxDiagnosis.js';



$(function() {
    btnEvents();
    setImgUploadBtn();
    FileInputChangeHandler(".inputFile", changePage, showPreview, showReadError,)
    setCrop(".pre-img", {
        controller: { 
            changeBtnParam: createBtnParams(".crop", "content_cut", "잘라내기", "cut button"),
            enableBtnParam: "reUpload", 
            disableBtnParam: "re-crop"
        },
        action: { 
            changeBtnParam: createBtnParams(".cut", "close", "되돌리기", "re-crop button"),
            enableBtnParam: "upload", 
            disableBtnParam: "cancel"
        },
        cancel: { 
            changeBtnParam: createBtnParams(".re-crop", "crop", "크롭", "crop button"),
            enableBtnParam: "save", 
            disableBtnParam: "cancel"
        }
    });
    
    submitAction(setResponseUi);
    checkNetworkStatus();
})