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
        var computedFontSizeAsNumber = parseFloat(computedFontSize.substring(0, computedFontSize.length-2));
            console.log("OLD: computed font size: " + computedFontSize);

        var computedWidth = window.getComputedStyle(elem).width;
        var computedWidthAsNumber = parseFloat(computedWidth.substring(0, computedWidth.length-2));

        var factor =  computedFontSizeAsNumber / (computedWidthAsNumber / elem.textContent.length);
            console.log("OLD: offsetWidth: " + elem.offsetWidth);
            console.log("OLD: calculated factor: " + factor);
        var pW = elem.parentNode.offsetWidth / elem.textContent.length;
            // console.log("OLD: possible width: " + pW)
        elem.style.fontSize = (pW * factor) + "px";
            console.log("OLD: fontSize: " + (pW * factor) + "px");
            console.log("--- FINISHED ---")
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
        // console.log("Factors: " + factors);

    function computeAndSetFontSize () {
        for (var i = 0; i < allElements.length; i++) {
            // console.log("fontSize--before: " + allElements[i].style.fontSize)
            allElements[i].style.fontSize = ((allElements[i].parentNode.offsetWidth / allElements[i].textContent.length) * factors[i]) + "px";
            // console.log("fontSize--after: " + allElements[i].style.fontSize)
        }
    }
    computeAndSetFontSize();
    window.addEventListener("resize", computeAndSetFontSize);
}

// execute all this shit
try {
    // delete all the old shit in the console
    console.clear();
    setTextToFullWidth("full-width-text");
    // setFontSizeForFullWidth("full-width-text");
} catch (error) {
    console.error(error);
}