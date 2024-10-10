import {fileUpload} from './fileUpload.js'
import {setCropInterface} from './crop.js'
import {submitImg} from './ajaxDiagnosis.js'
import {btnEvents} from './uiHandlers.js';


$(function() {
    fileUpload();
    setCropInterface();
    submitImg();
    btnEvents();
})