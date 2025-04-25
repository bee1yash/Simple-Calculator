let display = document.getElementById("display");
let isResultDisplayed = false;

display.addEventListener("keydown", function (event) {
  const operatorKeys = ["+", "-", "*", "/", "."];
  if (event.key === ",") {
    event.preventDefault();
    return;
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
        confirmButtonColor: "#007bff",
        heightAuto: false,
      });
      return clearDisplay();
    }
    if (event.key === ".") {
      const lastNumber = display.value.split(/[^0-9.]+/).pop();
      if (lastNumber.includes(".")) {
        event.preventDefault();
        Swal.fire({
          icon: "error",
          text: "Не можна вводити більше однієї крапки в числі.",
          confirmButtonColor: "#007bff",
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
  if (isResultDisplayed) {
    clearDisplay();
    isResultDisplayed = false;
  }

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
  display.value += "√(";
}

function appendFactorial() {
  if (isResultDisplayed) {
    clearDisplay();
    isResultDisplayed = false;
  }

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
  if (isResultDisplayed) {
    clearDisplay();
    isResultDisplayed = false;
  }

  if (display.value.trim() === "" || /[+\-*/]$/.test(display.value)) {
    Swal.fire({
      icon: "warning",
      text: "Спочатку введіть число!",
      heightAuto: false,
      confirmButtonColor: "#007bff",
    });
    return;
  }

  display.value = display.value + "²";
}

function appendPi() {
  if (isResultDisplayed) {
    clearDisplay();
    isResultDisplayed = false;
  }
  if (display.value !== "" && !/[+\-*/(]$/.test(display.value)) {
    display.value += "*";
  }
  display.value += "Math.PI";
}

function appendExp() {
  if (isResultDisplayed) {
    clearDisplay();
    isResultDisplayed = false;
  }
  if (display.value !== "" && !/[+\-*/]$/.test(display.value)) {
    display.value += "*";
  }
  display.value += Math.E;
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
  if (isResultDisplayed) {
    clearDisplay();
    isResultDisplayed = false;
  }

  if (display.value !== "" && !/[+\-*/(]$/.test(display.value)) {
    display.value += "*";
  }

  display.value += funcName + "(";
}
function appendPower() {
  if (isResultDisplayed) {
    clearDisplay();
    isResultDisplayed = false;
  }

  if (display.value.trim() === "" || /[+\-*/]$/.test(display.value)) {
    Swal.fire({
      icon: "warning",
      text: "Спочатку введіть число!",
      heightAuto: false,
      confirmButtonColor: "#007bff",
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
        confirmButtonColor: "#007bff",
        heightAuto: false,
      });
      return clearDisplay();
    }

    let result = eval(expression);
    display.value = result !== undefined ? result : "";
    isResultDisplayed = true;
  } catch (error) {
    console.error("Calculation Error:", error.message);
    clearDisplay();

    Swal.fire({
      icon: "error",
      text: error.message.includes("is not defined")
        ? `Змінна ${error.message.split(" ")[0]} не визначена!`
        : error.message,
      confirmButtonColor: "#007bff",
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
