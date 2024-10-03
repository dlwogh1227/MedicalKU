import {fileUpload} from './fileUpload.js'
import {setCropInterface} from './crop.js'
import {submitImg} from './ajaxDiagnosis.js'
import {uiControls} from './btn.js';


$(function() {
    fileUpload();
    setCropInterface();
    submitImg();
    uiControls();
})