function setLanguage() {
    var lang = navigator.browserLanguage || navigator.language;
    if(lang !== undefined) {
        var deElems = document.querySelectorAll("[data-lang='de']");
        var enElems = document.querySelectorAll("[data-lang='en']");
        if (lang !== "de") {
            for (var i = 0; i < deElems.length; i++) {
                deElems[i].style.display = "none";
                enElems[i].style.display = "inline-block";
            };
        }
    }
}

function adaptFontSizeToFullWidth(className) {
    if (typeof className !== "string" || className === undefined) {
        throw "No class name passed for setting the font size of the full width text.";
    }

    var allElements = document.getElementsByClassName(className);
    var factors = [];

    for (var i = 0; i < allElements.length; i++) {
        var computedFontSize = window.getComputedStyle(allElements[i]).fontSize;
        factors[i] = parseFloat(computedFontSize.substring(0, computedFontSize.length-2)) / (allElements[i].offsetWidth / allElements[i].textContent.length);
    }

    function computeAndSetFontSize () {
        for (var i = 0; i < allElements.length; i++) {
            allElements[i].style.fontSize = ((allElements[i].parentNode.offsetWidth / allElements[i].textContent.length) * factors[i]) + "px";
        }
    }
    computeAndSetFontSize();
    window.addEventListener("resize", computeAndSetFontSize);
}

try {
    window.addEventListener("load", function(event) {
        setLanguage();
        adaptFontSizeToFullWidth("full-width-text");
    });
} catch (error) {
    console.error(error);
}