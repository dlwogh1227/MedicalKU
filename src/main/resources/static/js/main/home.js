import { checkNetworkStatus } from '../utils/validationErrorHandler.js';
import { createObject} from '../utils/utils.js';
import { btnEvents, changePage, showPreview, showReadError, setResponseUi, updateBtn } from '../ui/uiHandlers.js';
import { FileInputChangeHandler, setImgUploadBtn } from '../imageProcess/fileUploadHandler.js';
import { setCrop } from '../imageProcess/cropHandler.js';
import { submitAction } from '../api/ajaxDiagnosis.js';



$(function() {
    btnEvents();
    setImgUploadBtn();
    FileInputChangeHandler(".inputFile", changePage, showPreview, showReadError,)
    setCrop(".pre-img", updateBtn);
    
    submitAction(setResponseUi);
    checkNetworkStatus();
})