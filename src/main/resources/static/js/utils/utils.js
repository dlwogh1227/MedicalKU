function roundStringValue(selector) {
    let str = $(selector).text();
    let roundVal = Math.round(parseFloat(str));
    if (!isNaN(roundVal)) {
        return roundVal;
    } else {
        console.log(selector + "부적절한 확률값");
        return ""; 
    }
}

function createObject(selector, icon, text, newClass) {
    return { selector, icon, text, newClass };
}

function appendElement(position, element) {
    let newElement = $(element).detach();
    $(position).append(newElement);
}

export {createObject, roundStringValue, appendElement};