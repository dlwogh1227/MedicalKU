import { showErrorPage } from './uiHandlers.js';

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
    if (!validImageTypes.includes(file.type)) { /* 배열or문자열 검사, 대소문자 구분, jpg -> jpeg 자동 변환 */
        alert("올바른 이미지 파일 형식이 아닙니다. (허용 형식: JPEG, PNG, WEBP)");
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

/* 통신 에러 */
function ajaxErrorHandler(xhr, textStatus, errorThrown) {
    let str;
    let substr;
    switch (xhr.status) {
        case 400:
            console.error("400 Bad Request: 잘못된 요청입니다.");
            str = "400 Bad Request: 잘못된 요청입니다";
            substr = "잘못된 요청을 보내 서버가 요구를 이해할 수 없습니다.";
            break;
        case 401:
            console.error("401 Unauthorized: 인증이 필요합니다.");
            str = "401 Unauthorized: 인증이 필요합니다.";
            substr = "요청한 리소스는 인증이 필요합니다. 로그인이 필요하거나, 로그인이 실패했을 수 있습니다.";
            break;
        case 403:
            console.error("403 Forbidden: 접근이 거부되었습니다.");
            str = "403 Forbidden: 접근이 거부되었습니다.";
            substr = "요청하신 내용에 접근할 수 있는 권한이 없습니다. 접근 권한이 필요한 경우 관리자에게 문의해주세요.";
            break;
        case 404:
            console.error("404 Not Found: 요청한 경로를 찾을 수 없습니다.");
            str = "404 Not Found: 요청한 경로를 찾을 수 없습니다.";
            substr = "방문하시려는 페이지의 주소가 잘못됐거나, 페이지의 주소가 변경 혹은 삭제되어 찾을 수 없습니다.";
            break;
        case 413:
            console.error("413 Payload Too Large: 요청 데이터가 너무 큽니다.");
            str = "413 Payload Too Large: 요청 데이터가 너무 큽니다.";
            substr = "서버가 요청된 데이터의 크기를 처리할 수 없습니다. 파일의 크기를 줄여보세요.";
            break;
        case 500:
            console.error("500 Internal Server Error: 서버 내부 오류가 발생했습니다.");
            str = "500 Internal Server Error: 서버 내부 오류가 발생했습니다.";
            substr = "서버에서 처리 중 오류가 발생했습니다. 문제가 지속되면 시스템 관리자에게 문의하세요.";
            break;
        case 504:
            console.error("500 Internal Server Error: 서버 내부 오류가 발생했습니다.");
            str = "500 Internal Server Error: 서버 내부 오류가 발생했습니다.";
            substr = "서버가 다른 네트워크 서비스로부터 응답을 받는데 지연되고 있습니다. 나중에 다시 시도해 주세요.";
            break;
        default:
            if(errorThrown == "timeout") {
                console.error("Timeout: 서버 응답 시간이 초과되었습니다.");
                str = "504 Gateway Timeout: 서버 응답 지연.";
                substr = "응답 시간이 지연되고 있습니다. 네트워크 상태를 확인하거나, 나중에 다시 시도해 주세요.";
            } else {
                console.error("Unexpected error: " + xhr.status + " " + errorThrown);
                str = "Unexpected error: " + xhr.status + " " + errorThrown;
            }
    }

    showErrorPage(str, substr);
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

export {validateFile, ajaxErrorHandler};
