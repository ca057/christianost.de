function setTextToFullWidth(className) {
    "use strict";
    if (typeof className !== "string" || className === undefined) {
        throw "No class name passed for setting the font size of the full width text.";
    }

    var computeAndSetFontSize = function (elem) {
        if (typeof elem !== "object" || elem.textContent.length === 0) {
            throw "The parameter is not of type object or one of the passed elements with class '" + className + "' has no content.";
        }
        var computedFontSize = window.getComputedStyle(elem).fontSize;
        var factor =  parseFloat(computedFontSize.substring(0, computedFontSize.length-2)) / (elem.offsetWidth / elem.textContent.length);
        var pW = elem.parentNode.offsetWidth / elem.textContent.length;
        elem.style.fontSize = (pW * factor) + "px";
    };

    var allElements = document.getElementsByClassName(className);

    for (var i = 0; i < allElements.length; i++) {
        computeAndSetFontSize(allElements[i]);
    }

    window.addEventListener("resize", function () {
        setTextToFullWidth(className);
    });
}

function setFontSizeForFullWidth(className) {
    if (typeof className !== "string" || className === undefined) {
        throw "No class name passed for setting the font size of the full width text.";
    }

    var allElements = document.getElementsByClassName(className);
    var factors = [];

    for (var i = 0; i < allElements.length; i++) {
        factors[i] = parseFloat(window.getComputedStyle(allElements[i]).fontSize.substring(0, window.getComputedStyle(allElements[i]).fontSize.length-2)) / (allElements[i].offsetWidth / allElements[i].textContent.length);
    }

    (function computeAndSetFontSize(){
        for (var i = 0; i < allElements.length; i++) {
            allElements[i].style.fontSize = ((allElements[i].parentNode.offsetWidth / allElements[i].textContent.length) * factors[i]) + "px";
        }

        window.addEventListener("resize", function() {
            computeAndSetFontSize();
        });
    })();
}

// execute all this shit
try {
    // setTextToFullWidth("full-width-text");
    setFontSizeForFullWidth("full-width-text");
} catch (error) {
    console.error(error);
}