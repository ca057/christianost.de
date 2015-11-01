var UXSTUFF = (function () {
    return {
        setUp: function() {
            // do all setup here, e.g. search for all elements and so on
        },
        init: function() {
            // register event handler and these kind of things
        }
    };
})();

var IMPROVE = (function () {
    var allElements, factors;
    var initFontSizeAdaption = function (className) {
        allElements = document.getElementsByClassName(className);
        factors = [];
        for (var i = 0; i < allElements.length; i++) {
            var computedFontSize = window.getComputedStyle(allElements[i]).fontSize;
            factors[i] = parseFloat(computedFontSize.substring(0, computedFontSize.length-2)) / (allElements[i].offsetWidth / allElements[i].textContent.length);
        }
    };

    var computeAndSetFontSize = function () {
        for (var i = 0; i < allElements.length; i++) {
            allElements[i].style.fontSize = ((allElements[i].parentNode.offsetWidth / allElements[i].textContent.length) * factors[i]) + "px";
        }
    }

    return {
        setLanguage: function() {
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
        },
        adaptFontSizeToFullWidth: function(className) {
            if (typeof className !== "string" || className === undefined) {
                throw "No class name passed for setting the font size of the full width text.";
            }
            initFontSizeAdaption(className);
            computeAndSetFontSize();
            window.addEventListener("resize", computeAndSetFontSize);
        }
    };
})();

try {
    document.addEventListener("DOMContentLoaded", function(event) {
        IMPROVE.setLanguage();
        UXSTUFF.setUp();
        UXSTUFF.init();
        document.removeEventListener("DOMContentLoaded");
    });
    window.addEventListener("load", function(event) {
        IMPROVE.adaptFontSizeToFullWidth("full-width-text");
        window.removeEventListener("load");
    });
} catch (error) {
    console.error(error);
}