function uiControls() {
    $(".back-home>span, header>span").on("click", function() {
        window.location.href = '/medicalku/home'; 
    });

    $(".info-btn").on("click", function() {
        $(".info").toggle();
    });

    $(".close-btn").on("click", function() {
        $(".info").hide();
    });

    $(document).on("click", ".retry", function(){
        $(".progress-container").show();
        $(".pre-img-container").addClass("back-img");
        $(".fail, .retry").remove();
        $(".progress-bar").css("width", "0%");
    });
}


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

export {changeBtn, disableBtn, enableBtn, uiControls};


