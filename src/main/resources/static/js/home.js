import {FileInputChangeHandler, setImgUploadBtn} from './imageHandler.js'
import {btnEvents, submitBtn} from './uiHandlers.js';


$(function() {
    btnEvents();
    setImgUploadBtn();
    FileInputChangeHandler();
    submitBtn();
})