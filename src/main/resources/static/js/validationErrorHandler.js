/* 파일검사 */
function validateFile(input) {
    // 존재유무 검사
    if (!input.files || input.files.length === 0) {
        alert("파일을 선택해 주세요.");
        return false;
    }

    let file = input.files[0];
    
    // 형식 검사 (이미지 파일인지 확인 - MIME 타입)
    let validImageTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validImageTypes.includes(file.type)) {
        alert("올바른 이미지 파일 형식이 아닙니다. (허용 형식: JPEG, PNG, GIF)");
        return false;
    }
    
    // 크기 검사 
    let maxSizeInBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
        alert("파일 크기가 10MB를 초과합니다.");
        return false;
    }

    return true;
}

/* 통신검사 */
function handleAjaxError(xhr, textStatus, errorThrown) {
    switch (xhr.status) {
        case 400:
            console.error("400 Bad Request: 잘못된 요청입니다.");
            alert("400 Bad Request: 잘못된 요청입니다.");
            break;
        case 401:
            console.error("401 Unauthorized: 인증이 필요합니다.");
            alert("401 Unauthorized: 인증이 필요합니다.");
            break;
        case 403:
            console.error("403 Forbidden: 접근이 거부되었습니다.");
            alert("403 Forbidden: 접근이 거부되었습니다.");
            break;
        case 404:
            console.error("404 Not Found: 요청한 경로를 찾을 수 없습니다.");
            alert("404 Not Found: 요청한 경로를 찾을 수 없습니다.");
            break;
        case 413:
            console.error("413 Content Too Large: 요청한 파일의 크기가 부적절합니다.");
            alert("413 Content Too Large: 요청한 파일의 크기가 부적절합니다.");
            break;
        case 500:
            console.error("500 Internal Server Error: 서버 내부 오류가 발생했습니다.");
            alert("500 Internal Server Error: 서버 내부 오류가 발생했습니다.");
            break;
        default:
            if(errorThrown == "timeout") {
                alert("서버 응답이 지연되고 있습니다. 다시 시도해주세요.");
            }
            console.error("Unexpected error: " + xhr.status + " " + errorThrown);
            alert("Unexpected error: " + xhr.status + " " + errorThrown);
    }
}

/* 네트워크 */
function checkNetworkStatus() {
    if (navigator.onLine) {
        console.log("Online: 네트워크 연결이 정상입니다.");
    } else {
        console.log("Offline: 네트워크가 연결 되지 않았습니다.");
    }
}

window.addEventListener('online', function() {
    console.log("네트워크가 연결 됐습니다.");
});

window.addEventListener('offline', function() {
    console.log("네트워크 연결이 끊어졌습니다.");
});



