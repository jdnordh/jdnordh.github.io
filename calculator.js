"use strict";

// Load button functions
(function () {
    let dbg = (message) => {
        console.log(message);
    };

    // State machine variables
    let lastAnswer = 0;
    let lastInputIsUsable = false;
    let lastInputWasEquals = false;
    let lastInputWasOperator = false;
    let errorFlag = false;
    let lastInput = "";

    function addToCurrentText(symbol, isOperator) {
        let textSymbol = symbol + "";
        // Clear error on new input
        if (errorFlag) {
            clearAll();
        }
        if (isOperator) {
            // Use last answer
            if (lastInputIsUsable && lastInputWasEquals) {
                $("#current-text").html(lastAnswer);
            }
            if (lastInputWasOperator) {
                // Replace operator
                let text = $("#current-text").text();
                $("#current-text").html(text.substring(0, text.length - 3));
            }
        }
        else {
            // Last answer is not being used
            if (lastInputWasEquals) {
                $("#current-text").html("");
            }
            if (lastInput) {
                // Assume times if no other operator specified
                if (!lastInputWasOperator && textSymbol.trim() === "(") {
                    events.times();
                }
                else if (!isOperator && lastInput.trim() === ")") {
                    events.times();
                }
            }
        }
        $("#current-text").append(symbol);
        lastInputIsUsable = false;
        lastInputWasEquals = false;
        lastInputWasOperator = isOperator;
        lastInput = textSymbol;
    }
    function clearAll() {
        $("#current-text").html("");
        $("#last-text").html("");
        lastAnswer = 0;
        lastInputIsUsable = false;
        lastInputWasEquals = false;
        errorFlag = false;
        lastInputWasOperator = false;
        lastInput = "";
    }
    function clearEntry() {
        $("#current-text").html("");
        lastInputIsUsable = true;
        lastInputWasOperator = false;
        lastInputWasEquals = false;
        lastInput = "";
    }

    function removeLeadingZeros(equation) {
        return equation.replace(/((?<=\s)|^)0+(?=[1-9]/gm, "");
    }

    function equals() {
        if (errorFlag) {
            clearAll();
            return;
        }
        // Set the equation text
        let equation = removeLeadingZeros($("#current-text").text());
        $("#last-text").html(equation + " =");
		dbg("Solving: " + equation);
        try {
            // Evaluate
            eval("lastAnswer = " + equation);
            dbg("Solved: " + lastAnswer);
            $("#current-text").html(lastAnswer);
        }
        catch (e){
            // Show error
            dbg("Error: " + e.message);
            lastAnswer = 0;
            $("#current-text").html("Error");
            errorFlag = true;
        }
        finally {
            lastInputIsUsable = true;
            lastInputWasOperator = false;
            lastInputWasEquals = true;
            lastInput = "";
        }
    }

    let events = {
        zero: () => {
            addToCurrentText(0, false);
        },
        one: () => {
            addToCurrentText(1, false);
        },
        two: () => {
            addToCurrentText(2, false);
        },
        three: () => {
            addToCurrentText(3, false);
        },
        four: () => {
            addToCurrentText(4, false);
        },
        five: () => {
            addToCurrentText(5, false);
        },
        six: () => {
            addToCurrentText(6, false);
        },
        seven: () => {
            addToCurrentText(7, false);
        },
        eight: () => {
            addToCurrentText(8, false);
        },
        nine: () => {
            addToCurrentText(9, false);
        },
        plus: () => {
            addToCurrentText(" + ", true);
        },
        minus: () => {
            addToCurrentText(" - ", true);
        },
        times: () => {
            addToCurrentText(" * ", true);
        },
        divide: () => {
            addToCurrentText(" / ", true);
        },
        equals: () => {
            equals();
        },
        leftBracket: () => {
            addToCurrentText(" (", false);
        },
        rightBracket: () => {
            addToCurrentText(") ", false);
        },
        decimal: () => {
            addToCurrentText(".", false);
        }
    };

    $(document).keypress((e) => {
        let keyCode = e.keyCode;
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

    $(document).ready(() => {
        $("#0").click(() => {
            events.zero();
        });
        $("#1").click(() => {
            events.one();
        });
        $("#2").click(() => {
            events.two();
        });
        $("#3").click(() => {
            events.three();
        });
        $("#4").click(() => {
            events.four();
        });
        $("#5").click(() => {
            events.five();
        });
        $("#6").click(() => {
            events.six();
        });
        $("#7").click(() => {
            events.seven();
        });
        $("#8").click(() => {
            events.eight();
        });
        $("#9").click(() => {
            events.nine();
        });

        $("#clear").click(() => {
            clearAll();
        });

        $("#plus").click(() => {
            events.plus();
        });
        $("#minus").click(() => {
            events.minus();
        });
        $("#times").click(() => {
            events.times();
        });
        $("#divide").click(() => {
            events.divide();
        });
        $("#leftBracket").click(() => {
            events.leftBracket();
        });
        $("#rightBracket").click(() => {
            events.rightBracket();
        });
        $("#clearEntry").click(() => {
            clearEntry();
        });
        $("#equals").click(() => {
            equals();
        });
    });
} )();