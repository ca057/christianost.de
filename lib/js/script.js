function setTextToFullWidth(className) {
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

    // actual start of adapting the font size
    var allElements = document.getElementsByClassName(className);
    for(var i = 0; i < allElements.length; i++) {
        computeAndSetFontSize(allElements[i]);
    }

    // call function when resizing the window
    window.addEventListener("resize", function () {
        setTextToFullWidth(className);
    });
}

// execute all this shit
try {
    setTextToFullWidth("full-width-text");
} catch (error) {
    console.error(error);
}