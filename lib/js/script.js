var OPTIONS = {
    classForFullWidthText: "full-width-text"
};

function setTextToFullWidth() {
    if (typeof OPTIONS.classForFullWidthText !== "string" || OPTIONS.classForFullWidthText === undefined) {
        throw "No class name set in options for setting the font size of the full width text.";
    }
    var className = OPTIONS.classForFullWidthText,
        allElements = document.getElementsByClassName(className);

    var computeFontSize = function (elem) {
        if (typeof elem !== "object" || elem.children.length === 0) {
            throw "The parameter is not of type object or one of the passed elements with class " + className + " has no children.";
        }
        var computedFontSize = window.getComputedStyle(elem.children[0]).fontSize;
        var factor =  parseFloat(computedFontSize.substring(0, computedFontSize.length-2)) / elem.children[0].offsetWidth;

        var pW = elem.parentNode.offsetWidth / elem.children.length;

        console.log(computedFontSize);
        console.log(elem.parentNode.offsetWidth);
        console.log(elem.children.length);
        console.log();

        return pW * factor;
    };
    
    var setFontSize = function (fontSize, elem) {
        if (typeof fontSize !== "number" || fontSize <= 0 || typeof elem !== "object" || elem.children.length === 0) {
            throw "Either the passed font size is no number, less than 0, the passed element is not of type object or has no children.";
        }

        for (var j = 0; j < elem.children.length; j++) {
            elem.children[j].style.fontSize = fontSize + "px";
        }
    };


    for(var i = 0; i < allElements.length; i++) {
        setFontSize(computeFontSize(allElements[i]), allElements[i]);
    }

    window.addEventListener("resize", setTextToFullWidth);
}

// execute all this shit
try {
    setTextToFullWidth();
} catch (error) {
    console.error(error);
}