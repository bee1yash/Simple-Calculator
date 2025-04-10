let display = document.getElementById("display");
let isResultDisplayed = false;

display.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    event.preventDefault();
    let input = display.value.trim();

    let match = input.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
    if (match) {
      let varName = match[1];
      let varValue = match[2];

      try {
        let evaluatedValue = eval(varValue);
        saveVariable(varName, evaluatedValue);
        display.value = evaluatedValue;
      } catch (error) {
        console.error("Eval Error:", error.message);
        display.value = "Error";
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
  display.value += "√(";
}

function appendFactorial() {
  if (isResultDisplayed) {
    clearDisplay();
    isResultDisplayed = false;
  }

  if (display.value.trim() === "" || /[+\-*/]$/.test(display.value)) {
    Swal.fire({
      title: "Помилка!",
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
      title: "Помилка!",
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

  if (["Math.sin(", "Math.cos(", "Math.tan("].includes(operator)) {
    display.value += operator.replace("Math.", "");
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
      title: "Помилка!",
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
      /\b([a-zA-Z_][a-zA-Z0-9_]*)\b/g,
      (match, varName) => {
        if (storedVariables[varName] !== undefined) {
          let value = storedVariables[varName];
          if (!isNaN(value)) {
            return Number(value);
          } else {
            return value;
          }
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

    let result = eval(expression);
    display.value = result !== undefined ? result : "";
    isResultDisplayed = true;
  } catch (error) {
    console.error("Calculation Error:", error.message);
    clearDisplay();

    Swal.fire({
      icon: "error",
      title: "Помилка обчислення!",
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
