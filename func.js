let display = document.getElementById("display");
const historyList = document.getElementById("history-list");
const clearHistoryBtn = document
  .getElementById("clear-history")
  .addEventListener("click", clearHistory);

let isResultDisplayed = false;
function readyInput() {
  if (isResultDisplayed) {
    clearDisplay();
    isResultDisplayed = false;
  }
}

display.addEventListener("keydown", function (event) {
  const operatorKeys = ["+", "-", "*", "/", "."];
  if (event.key === ",") {
    event.preventDefault();
    return;
  }
  if (event.key === "|") {
    const lastChar = display.value.slice(-1);
    if (lastChar === "|") {
      event.preventDefault();
    } else {
      readyInput();
    }
  }
  if (operatorKeys.includes(event.key)) {
    const lastChar = display.value.slice(-1);
    const secondLastChar = display.value.slice(-2, -1);

    if (event.key === "*" && lastChar === "*" && secondLastChar !== "*") {
      return;
    }
    if (operatorKeys.includes(lastChar)) {
      event.preventDefault();
      Swal.fire({
        icon: "error",
        text: "Не можна вводити кілька операторів поспіль.",
        heightAuto: false,
      });
      return;
    }
    if (event.key === ".") {
      const lastNumber = display.value.split(/[^0-9.]+/).pop();
      if (lastNumber.includes(".")) {
        event.preventDefault();
        Swal.fire({
          icon: "error",
          text: "Не можна вводити більше однієї крапки в числі.",
          heightAuto: false,
        });
      }
    }
  }

  if (event.key === "Enter") {
    event.preventDefault();

    if (
      display.value.trim() === "Помилка" ||
      display.value.trim() === "Error"
    ) {
      clearDisplay();
      return;
    }

    let input = display.value.trim();

    let match = input.match(/^([\p{L}_][\p{L}\p{N}_]*)\s*=\s*(.+)$/u);
    if (match) {
      let varName = match[1];
      let varValue = match[2];

      try {
        varValue = varValue.replace(
          /([\p{L}_][\p{L}\p{N}_]*)/gu,
          (match, name) => {
            if (storedVariables[name] !== undefined) {
              let value = storedVariables[name];
              return isNaN(value) ? `"${value}"` : value;
            }
            return match;
          }
        );

        let evaluatedValue = eval(varValue);
        saveVariable(varName, evaluatedValue);
        display.value = evaluatedValue;
      } catch (error) {
        console.error("Eval Error:", error.message);
        display.value = "Помилка";
      }
    } else {
      calculate();
    }
  }
});

function append(value) {
  readyInput();

  const lastChar = display.value.slice(-1);

  if (/[+\-*/]/.test(value)) {
    if (display.value === "") {
      if (value !== "-") return;
    } else if (/[+\-*/]/.test(lastChar)) {
      display.value = display.value.slice(0, -1) + value;
      return;
    }
  }

  display.value += value;
}
function appendDot() {
  readyInput();

  if (display.value === "" || /[+\-*/]$/.test(display.value)) {
    return;
  }

  const lastNumber = display.value.split(/[^0-9.]+/).pop();
  if (!lastNumber.includes(".")) {
    display.value += ".";
  }
}

function appendRoot() {
  readyInput();
  display.value += "√(";
}

function appendFactorial() {
  readyInput();

  if (display.value.trim() === "" || /[+\-*/]$/.test(display.value)) {
    Swal.fire({
      text: "Спочатку введіть число!",
      icon: "warning",
      heightAuto: false,
      customClass: {
        popup: "swal2-popup",
        title: "swal2-title",
      },
    });
    return;
  }

  display.value += "!";
}

function appendSquare() {
  readyInput();

  if (display.value.trim() === "" || /[+\-*/]$/.test(display.value)) {
    Swal.fire({
      icon: "warning",
      text: "Спочатку введіть число!",
      heightAuto: false,
    });
    return;
  }

  display.value = display.value + "²";
}

function appendPi() {
  readyInput();
  if (display.value !== "" && !/[+\-*/(]$/.test(display.value)) {
    display.value += "*";
  }
  display.value += "Math.PI";
}

function appendExp() {
  readyInput();
  if (display.value !== "" && !/[+\-*/]$/.test(display.value)) {
    display.value += "*";
  }
  display.value += Math.E;
}
function appendAbs() {
  readyInput();
  const lastChar = display.value.slice(-1);

  if (lastChar === "|") {
    return;
  }

  if (display.value.includes("|")) {
    display.value += "|";
  } else {
    display.value += "|";
  }
}

function operate(operator) {
  isResultDisplayed = false;

  const trigFunctions = {
    "Math.sin(": "sin(",
    "Math.cos(": "cos(",
    "Math.tan(": "tan(",
  };

  if (operator in trigFunctions) {
    if (display.value !== "" && !/[+\-*/(]$/.test(display.value)) {
      display.value += "*";
    }
    display.value += trigFunctions[operator];
    return;
  }

  const lastChar = display.value.slice(-1);

  if (/[+\-*/]/.test(lastChar)) {
    display.value = display.value.slice(0, -1) + operator;
  } else {
    if (display.value === "" && operator !== "-") return;
    display.value += operator;
  }
}

function factorial(n) {
  if (n < 0) return NaN;
  return n === 0 ? 1 : n * factorial(n - 1);
}
function appendFunction(funcName) {
  readyInput();

  if (display.value !== "" && !/[+\-*/(]$/.test(display.value)) {
    display.value += "*";
  }

  display.value += funcName + "(";
}
function appendPower() {
  readyInput();

  if (display.value.trim() === "" || /[+\-*/]$/.test(display.value)) {
    Swal.fire({
      icon: "warning",
      text: "Спочатку введіть число!",
      heightAuto: false,
    });
    return;
  }

  display.value += "^";
}
function calculate() {
  try {
    let expression = display.value;

    expression = expression.replace(/√/g, "Math.sqrt(");
    expression = expression.replace(/²/g, "**2");

    expression = expression.replace(/\^/g, "**");

    expression = expression.replace(
      /([\p{L}_][\p{L}\p{N}_]*)/gu,
      (match, varName) => {
        if (storedVariables[varName] !== undefined) {
          let value = storedVariables[varName];
          return !isNaN(value) ? Number(value) : `"${value}"`;
        }
        return match;
      }
    );

    expression = expression
      .replace(/sin\(/g, "Math.sin(")
      .replace(/cos\(/g, "Math.cos(")
      .replace(/tan\(/g, "Math.tan(")
      .replace(/log\(/g, "Math.log10(")
      .replace(/ctg\(/g, "(1/Math.tan(")
      .replace(/\|([^|]+)\|/g, "Math.abs($1)")
      .replace(/ln\(/g, "Math.log(");

    expression = expression.replace(/(\d+)!/g, (match, num) =>
      factorial(Number(num))
    );

    const openParentheses = (expression.match(/\(/g) || []).length;
    const closeParentheses = (expression.match(/\)/g) || []).length;
    expression += ")".repeat(openParentheses - closeParentheses);

    if (/\/\s*0(?!\d)/.test(expression)) {
      Swal.fire({
        icon: "error",
        text: "Не можна ділити на 0!",
        heightAuto: false,
      });
      return clearDisplay();
    }

    let result = eval(expression);
    display.value = result !== undefined ? result : "";
    isResultDisplayed = true;
    if (result !== undefined && result !== "") {
      saveToHistory(expression, result);
    }
  } catch (error) {
    console.error("Calculation Error:", error.message);
    clearDisplay();

    Swal.fire({
      icon: "error",
      text: error.message.includes("is not defined")
        ? `Змінна ${error.message.split(" ")[0]} не визначена!`
        : error.message,
      heightAuto: false,
    });
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
    clearDisplay();
  }
});
function saveToHistory(expression, result) {
  let history = JSON.parse(localStorage.getItem("calcHistory")) || [];
  history.unshift({ expression, result });
  history = history.slice(0, 20);
  localStorage.setItem("calcHistory", JSON.stringify(history));
  updateHistoryDisplay();
}

function updateHistoryDisplay() {
  const historyContainer = document.getElementById("history-list");
  const containerWrapper = document.querySelector(".history-panel");

  if (!historyContainer || !containerWrapper) return;

  let history = JSON.parse(localStorage.getItem("calcHistory")) || [];

  if (history.length === 0) {
    containerWrapper.style.display = "none";
    return;
  } else {
    containerWrapper.style.display = "block";
  }

  historyContainer.innerHTML = "";
  history.forEach(({ expression, result }) => {
    const div = document.createElement("div");
    div.classList.add("history-item");

    const expr = document.createElement("span");
    expr.classList.add("history-expression");
    expr.innerText = `${expression} = `;

    const res = document.createElement("span");
    res.classList.add("history-result");
    res.innerText = result;

    div.appendChild(expr);
    div.appendChild(res);

    div.addEventListener("click", () => {
      display.value += result;
    });

    historyContainer.appendChild(div);
  });
}

function clearHistory() {
  localStorage.removeItem("calcHistory");
  updateHistoryDisplay();
}

document.addEventListener("DOMContentLoaded", updateHistoryDisplay);
