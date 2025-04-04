let storedVariables = JSON.parse(localStorage.getItem("storedVariables")) || {}; // Завантаження змінних

function saveVariable(name) {
  if (display.value.trim() === "") return;
  storedVariables[name] = display.value;
  localStorage.setItem("storedVariables", JSON.stringify(storedVariables));
  updateVariableDisplay();
}

function useVariable(name) {
  if (storedVariables[name] !== undefined) {
    // Перевірка, чи є змінна числовою
    let value = storedVariables[name];
    // Перетворення в число, якщо це можливо
    if (!isNaN(value)) {
      append(Number(value));
    } else {
      append(value); // Якщо це не число, додаємо як текст
    }
  }
}

function updateVariableDisplay() {
  let variableContainer = document.getElementById("variables-list");
  if (!variableContainer) return;
  variableContainer.innerHTML = "";
  for (let key in storedVariables) {
    let btn = document.createElement("button");
    btn.innerText = key + " = " + storedVariables[key];
    btn.onclick = () => useVariable(key);
    variableContainer.appendChild(btn);
  }
}

function clearVariables() {
  storedVariables = {};
  localStorage.removeItem("storedVariables");
  updateVariableDisplay();
}

document.addEventListener("DOMContentLoaded", updateVariableDisplay);
