let storedVariables = JSON.parse(localStorage.getItem("storedVariables")) || {};

function saveVariable(name, value) {
  storedVariables[name] = value;
  localStorage.setItem("storedVariables", JSON.stringify(storedVariables));
  updateVariableDisplay();
}

function useVariable(name) {
  if (storedVariables[name] !== undefined) {
    let value = storedVariables[name];
    if (!isNaN(value)) {
      append(Number(value));
    } else {
      append(value);
    }
  }
}

function updateVariableDisplay() {
  const variableContainer = document.getElementById("variables-list");
  const containerWrapper = document.querySelector(".variables-container");

  if (!variableContainer || !containerWrapper) return;

  variableContainer.innerHTML = "";

  const keys = Object.keys(storedVariables);
  if (keys.length === 0) {
    containerWrapper.style.display = "none";
    return;
  } else {
    containerWrapper.style.display = "block";
  }

  for (let key of keys) {
    const wrapper = document.createElement("div");
    wrapper.classList.add("variable-wrapper");

    const varBtn = document.createElement("button");
    varBtn.classList.add("variable-button");
    varBtn.innerText = `${key} = ${storedVariables[key]}`;
    varBtn.onclick = () => useVariable(key);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-button");
    deleteBtn.innerText = "✖";
    deleteBtn.title = "Видалити";
    deleteBtn.onclick = () => deleteVariable(key);

    wrapper.appendChild(varBtn);
    wrapper.appendChild(deleteBtn);
    variableContainer.appendChild(wrapper);
  }
}

function deleteVariable(name) {
  delete storedVariables[name];
  localStorage.setItem("storedVariables", JSON.stringify(storedVariables));
  updateVariableDisplay();
}

function clearVariables() {
  storedVariables = {};
  localStorage.removeItem("storedVariables");
  updateVariableDisplay();
}

document.addEventListener("DOMContentLoaded", updateVariableDisplay);
