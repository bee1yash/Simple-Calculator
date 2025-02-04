let display = document.getElementById("display");
let isResultDisplayed = false;

function append(value) {
  if (isResultDisplayed) {
    clearDisplay();
    isResultDisplayed = false;
  }

  if (display.value === "" && /[.+*/]/.test(value)) {
    return;
  }

  display.value += value;
}

function appendDot() {
  if (isResultDisplayed) {
    clearDisplay();
    isResultDisplayed = false;
  }

  if (display.value === "" || /[+\-*/]$/.test(display.value)) {
    return;
  }

  const lastNumber = display.value.split(/[^0-9.]+/).pop();
  if (!lastNumber.includes(".")) {
    display.value += ".";
  }
}

function appendRoot() {
  if (isResultDisplayed) {
    clearDisplay();
    isResultDisplayed = false;
  }
  display.value += "Math.sqrt(";
}

function appendFactorial() {
  if (isResultDisplayed) {
    clearDisplay();
    isResultDisplayed = false;
  }
  display.value += "factorial(";
}

function appendSquare() {
  if (isResultDisplayed) {
    clearDisplay();
    isResultDisplayed = false;
  }
  display.value = "Math.pow(" + display.value + ",2)";
}

function operate(operator) {
  isResultDisplayed = false;

  if (operator.includes("Math.")) {
    display.value += operator + "(";
  } else {
    if (display.value === "" && operator !== "-") return;
    if (/[+\-*/]$/.test(display.value)) return;
    display.value += operator;
  }
}

function factorial(n) {
  if (n < 0) return NaN;
  return n === 0 ? 1 : n * factorial(n - 1);
}

function calculate() {
  try {
    let expression = display.value;

    const openParentheses = (expression.match(/\(/g) || []).length;
    const closeParentheses = (expression.match(/\)/g) || []).length;
    expression += ")".repeat(openParentheses - closeParentheses);

    let result = eval(expression);
    display.value = result !== undefined ? result : "";
    isResultDisplayed = true;
  } catch {
    display.value = "Error";
  }
}

function clearDisplay() {
  display.value = "";
}

function backspace() {
  display.value = display.value.slice(0, -1);
}

display.addEventListener("input", function (event) {
  if (/^[.+*/]/.test(display.value)) {
    display.value = "";
  }
});
