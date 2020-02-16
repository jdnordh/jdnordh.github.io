"use strict";

(function () {
    var dbg = function dbg(message) {
        console.log(message);
    };
    // State machine variables
    var lastAnswer = 0;
    var lastInputIsUsable = false;
    var continuationPossible = false;
    var lastInputWasOperator = false;
    var errorFlag = false;
    var lastInput = "";

    // TODO Click to copy answer with tooltip

    function addToCurrentText(symbol, isOperator) {
        var textSymbol = symbol + "";
        // Clear error on new input
        if (errorFlag) {
            clearAll();
        }
        if (isOperator) {
            // Use last answer
            if (lastInputIsUsable && continuationPossible) {
                $("#current-text").html(lastAnswer);
            }
            if (lastInputWasOperator) {
                // Replace operator
                var text = $("#current-text").text();
                $("#current-text").html(text.substring(0, text.length - 3));
            }
        } else {
            // Last answer is not being used
            if (continuationPossible) {
                $("#current-text").html("");
            }

            if (lastInput) {
                // Assume times if no other operator specified
                if (!lastInputWasOperator && textSymbol.trim() === "(") {
                    events.times();
                } else if (!isOperator && lastInput.trim() === ")") {
                    events.times();
                }
            }
        }

        $("#current-text").append(symbol);
        lastInputIsUsable = false;
        continuationPossible = false;
        lastInputWasOperator = isOperator;
        lastInput = textSymbol;
    }

    function clearAll() {
        $("#current-text").html("");
        $("#last-text").html("");
        lastAnswer = 0;
        lastInputIsUsable = false;
        continuationPossible = false;
        errorFlag = false;
        lastInputWasOperator = false;
        lastInput = "";
    }

    function clearEntry() {
        $("#current-text").html("");
        lastInputIsUsable = true;
        lastInputWasOperator = false;
        continuationPossible = true;
        lastInput = "";
    }

    function removeLeadingZeros(equation) {
        return equation.replace(/((?<![0-9])|^)0+(?=[1-9])/gm, "");
    }

    function generateProperDecimals(answer) {
        var stringAnswer = answer + "";
        var matches = stringAnswer.match(/\.[0-9]{7,}?/gm);
        if (matches) {
            return answer.toFixed(6);
        }
        return answer;
    }

    function _equals() {
        if (errorFlag) {
            clearAll();
            return;
        }
        // Set the equation text
        var equation = removeLeadingZeros($("#current-text").text());
        $("#last-text").html(equation + " =");
        dbg("Solving: " + equation);

        try {
            // Evaluate
            eval("lastAnswer = " + equation);
            dbg("Solved: " + lastAnswer);
            $("#current-text").html(generateProperDecimals(lastAnswer));
        } catch (e) {
            // Show error
            dbg("Error: " + e.message);
            lastAnswer = 0;
            $("#current-text").html("Error");
            errorFlag = true;
        } finally {
            lastInputIsUsable = true;
            lastInputWasOperator = false;
            continuationPossible = true;
            lastInput = "";
        }
    }

    // Events that are called in more than one place
    var events = {
        zero: function zero() {
            addToCurrentText(0, false);
        },
        one: function one() {
            addToCurrentText(1, false);
        },
        two: function two() {
            addToCurrentText(2, false);
        },
        three: function three() {
            addToCurrentText(3, false);
        },
        four: function four() {
            addToCurrentText(4, false);
        },
        five: function five() {
            addToCurrentText(5, false);
        },
        six: function six() {
            addToCurrentText(6, false);
        },
        seven: function seven() {
            addToCurrentText(7, false);
        },
        eight: function eight() {
            addToCurrentText(8, false);
        },
        nine: function nine() {
            addToCurrentText(9, false);
        },
        plus: function plus() {
            addToCurrentText(" + ", true);
        },
        minus: function minus() {
            addToCurrentText(" - ", true);
        },
        times: function times() {
            addToCurrentText(" * ", true);
        },
        divide: function divide() {
            addToCurrentText(" / ", true);
        },
        equals: function equals() {
            _equals();
        },
        leftBracket: function leftBracket() {
            addToCurrentText(" (", false);
        },
        rightBracket: function rightBracket() {
            addToCurrentText(") ", false);
        },
        decimal: function decimal() {
            addToCurrentText(".", false);
        }
    };

    // Key presses
    $(document).keypress(function (e) {
        var keyCode = e.keyCode;

        if (keyCode >= 48 && keyCode <= 59) {
            addToCurrentText(keyCode - 48, false);
        }

        switch (keyCode) {
            case 13:
                events.equals();
                break;
            case 40:
                events.leftBracket();
                break;
            case 41:
                events.rightBracket();
                break;
            case 42:
                events.times();
                break;
            case 43:
                events.plus();
                break;
            case 45:
                events.minus();
                break;
            case 46:
                events.decimal();
                break;
            case 47:
                events.divide();
                break;
        }
    });

    // Attached event handlers
    $(document).ready(function () {
        $("#0").click(function () {
            events.zero();
        });
        $("#1").click(function () {
            events.one();
        });
        $("#2").click(function () {
            events.two();
        });
        $("#3").click(function () {
            events.three();
        });
        $("#4").click(function () {
            events.four();
        });
        $("#5").click(function () {
            events.five();
        });
        $("#6").click(function () {
            events.six();
        });
        $("#7").click(function () {
            events.seven();
        });
        $("#8").click(function () {
            events.eight();
        });
        $("#9").click(function () {
            events.nine();
        });
        $("#clear").click(function () {
            clearAll();
        });
        $("#plus").click(function () {
            events.plus();
        });
        $("#minus").click(function () {
            events.minus();
        });
        $("#times").click(function () {
            events.times();
        });
        $("#divide").click(function () {
            events.divide();
        });
        $("#leftBracket").click(function () {
            events.leftBracket();
        });
        $("#rightBracket").click(function () {
            events.rightBracket();
        });
        $("#clearEntry").click(function () {
            clearEntry();
        });
        $("#equals").click(function () {
            _equals();
        });
    });
})();
