$(function(){
    /* 파일 업로드 */
    $(".upload-file").on("click", function() {
        $(".inputFile").click();
    });
    /* 처음으로 */
    $(".back-home>span, header>span").on("click", function() {
        /* ajaxHome(); */
        window.location.href = '/medicalku'; 
    });

    function onceFunction() {
        $(".back-home, .pre-img-container, .progress-container").show();
        $(".tip, .help, .upload-file").hide();
        // 함수를 실행한 후에 함수를 무효화
        onceFunction = function() {
        };
    }

    /* 파일변경 */
    $(document).on("change", ".inputFile", function() {
        /* 파일이 새로첨부될떼, 파일이 변경될때 */
        if (this.files.length == 1) {
            alert("파일변경");
            lastSelectedFile = this.files[0];

            let reader = new FileReader();
                reader.readAsDataURL(this.files[0]);
                reader.onload = function (e) {
                    $(".pre-img").attr("src", e.target.result);
            }
            onceFunction();
        } else { /* 파일을 제거할때 */
            alert("파일원본유지");
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(lastSelectedFile);
            this.files = dataTransfer.files;
        }
    });

     /* 크롭 */

    let cropImg;
    let preImg;
    let croppedCanvas
    let cropped = false;
    /* let status = true; */

    function changeBtn(icon, text, Selector, newClass) {
        $(Selector + ">span").eq(0).text(icon);
        $(Selector + ">span").eq(1).text(text);
        $(Selector).attr("class", newClass);
    }
    function disableBtn(selector) {
        $(selector).css("pointer-events", "none");
        $(selector).css("opacity", "0.5");
    }
    function enableBtn(selector) {
        $(selector).css("pointer-events", "all");
        $(selector).css("opacity", "1");
    }


    function clearCrop() {
        if(cropImg) {
            alert("크롭객체비움");
            cropImg.destroy();
            cropImg = null;
        }
    }
    function clearCropPreview() {
        alert("크롭미리보기비움");
        $(".cropedImg").attr("src", "");
        $(".cropedImg").hide();
        croppedCanvas = null;
        $(".pre-img").show();
    }

    /* 크롭인터페이스 */
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
        changeBtn("content_cut", "잘라내기", ".crop", "btn-crop");
        disableBtn(".next");
        disableBtn(".reUpload");
    });
    /* 크롭 행위 */
    $(document).on("click", ".btn-crop", function() {
        croppedCanvas = cropImg.getCroppedCanvas();
        console.log(`크롭된 이미지 크기: ${croppedCanvas.width} x ${croppedCanvas.height}`);
        /* console.log(croppedCanvas.toDataURL()); */
        $(".cropedImg").attr("src", croppedCanvas.toDataURL()).show();
        $(".pre-img").hide();
        changeBtn("close", "되돌리기", ".btn-crop", "re-crop");

        clearCrop();

        enableBtn(".next");
        enableBtn(".reUpload");
        
        cropped = true;
    });
    /* 크롭취소 */
    $(document).on("click", ".re-crop", function() {
        changeBtn("crop", "크롭", ".re-crop", "crop");
        clearCropPreview();

        cropped = false;
    }); 

    /* 재업로드 */
    $(".reUpload").on("click", function() {
        $(".inputFile").click();
        changeBtn("crop", "크롭", "#crop", "crop");
        clearCropPreview();

        cropped = false;
    });

    /* 제출 */
    function ajaxDiagnosis(formData) {
        $.ajax({
            url: "/medicalku/diagnosis",
            type: "post",
            data: formData,
            processData: false, 
            contentType: false, 
            success: function(result) {
                $(".progress-container").hide();
                let str = "";
                str += "<div class='disease item'><div class='disease-result'>";
                str += "<div class='disease-name'><span>" + result.diseaseName + "</span></div>";
                str += "<div class='disease-probability'><span>" + result.probability + "% </span><span class='material-symbols-outlined icon'>vital_signs</span></div></div>";
                str += "<div class='disease-content'>" + result.diseaseContent + "</div></div>";
                str += " <div class='treatment item'><div class='treatment-title'><span>치료법</span><span class='material-symbols-outlined icon'>health_and_safety</span></div>";
                str += "<div class='treatment-method'>" + result.treatmentMethod + "</div></div>";
                $(".content").append(str);
                alert("결과받기 성공");
            },
            error: function() {
                alert("결과받기 실패");
            }
        });
    }

/*     function ajaxHome() {
        $.ajax({
            url: "/medicalku/home",
            type: "get",
            success: function(result) {
                console.log(result);
                alert("홈이동 성공")
            },
            error: function() {
                alert("홈이동 실패")
            }
        });
    }
 */
    $(".next").on("click", function(){

        var formData = new FormData();
        if(cropped) {
            alert("크롭이미지 존재");
            croppedCanvas.toBlob(function(blob) {
                let file = new File([blob], "croppedImage.png", {type: "image/png"});
                formData.append('upfile', file);
                ajaxDiagnosis(formData);
            });
        } else {
            alert("크롭이미지 없음");
            let file = $('.inputFile')[0].files[0];
            console.log(file);
            formData.append('upfile', file);
            ajaxDiagnosis(formData); 
        }
    });
});