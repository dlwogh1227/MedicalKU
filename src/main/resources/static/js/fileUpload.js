import {clearCropPreview, changeCroppedValue} from './crop.js';
import {changeBtn} from './btn.js';

function fileUpload() {
    let lastSelectedFile;

    $(".upload-file").on("click", function() {
        $(".inputFile").click();
    });

    $(".reUpload").on("click", function() {
        $(".inputFile").click();
        changeBtn("crop", "크롭", "#crop", "crop button");
        clearCropPreview();
        changeCroppedValue(false);
    });

    $(document).on("change", ".inputFile", function() {
        /* 파일이 새로첨부될때, 파일이 변경될때 */
        if (this.files.length == 1) {
            /* console.log("파일변경") */;
            lastSelectedFile = this.files[0];

            let reader = new FileReader();
                reader.readAsDataURL(this.files[0]);
                reader.onload = function (e) {
                    $(".pre-img").css("width", "");
                    $(".pre-img").css("height", "");
                    $(".pre-img").attr("src", e.target.result);
                    $(".pre-img").on('load', function() {
                        let width = $(".pre-img").width();
                        let height = $(".pre-img").height();
                        if(width > height) {
                            $(".pre-img").css("width", "100%");
                        } else {
                            $(".pre-img").css("height", "100%");
                        }
                    })
            }
            changePage();
        } else { /* 파일을 제거할때 */
            /* console.log("파일원본유지"); */
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(lastSelectedFile);
            this.files = dataTransfer.files;
        }
    });

}

function changePage() {
    $(".back-home, .pre-img-container, .progress-container").show();
    $(".tip, .help, .upload-file").hide();
    changePage = function() {
    };
}

export {fileUpload};