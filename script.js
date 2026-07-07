let display = "0";
let firstOperand = null;
let secondOperand = null;
let currentOperator = null;
let waiting = false;
let previousOperation = "";
let historyStack = [];

const resultDisplay = document.querySelector(".display-result");
const expressionDisplay = document.querySelector(".display-expression");
const previousDisplay = document.querySelector(".display-previous");
const numberButtons = document.querySelectorAll(".key-number");
const operatorButtons = document.querySelectorAll(".key-operator");
const equalsButton = document.querySelector(".key-equals");
const clearButton = document.querySelector(".key-clear");
const deleteButton = document.querySelector(".key-delete");
const decimalButton = document.querySelector(".key-decimal");
const undoButton = document.querySelector(".key-undo");

function add(a, b){
    return a + b;
}

function subtract(a, b){
    return a - b;
}

function multiply(a, b){
    return a * b;
}

function divide(a, b){
    if (b === 0) {
        return "Error: you can't divide by zero";
    }
    return a / b;
}

function operate(operator, a, b){
    if (operator === "+") {
        return add(a, b);
    }
    if (operator === "-") {
        return subtract(a, b);
    }
    if (operator === "*") {
        return multiply(a, b);
    }
    if (operator === "/") {
        return divide(a, b);
    }
}

function roundDisplay(number){
    return Math.round(number * 10000) / 10000;
}

function operatorSymbol(operator){
    if (operator === "+") {
        return "+";
    }
    if (operator === "-") {
        return "-";
    }
    if (operator === "*") {
        return "×";
    }
    if (operator === "/") {
        return "÷";
    }
    return "";
}

function saveState(){
    historyStack.push({
        firstOperand: firstOperand,
        secondOperand: secondOperand,
        operator: currentOperator,
        display: display,
        waiting: waiting,
        previousOperation: previousOperation
    });
}

function undo(){
    if (historyStack.length === 0) {
        return;
    }
    const lastState = historyStack.pop();
    firstOperand = lastState.firstOperand;
    secondOperand = lastState.secondOperand;
    currentOperator = lastState.operator;
    previousOperation = lastState.previousOperation;
    display = lastState.display;
    waiting = lastState.waiting;
}

function inputDigit(digit){
    if (waiting){
        display = digit;
        waiting = false;
    } else if (display === "0") {
        display = digit;
    } else {
        display = display + digit;
    }
}

function inputDecimal (){
    if (waiting) {
        display = "0.";
        waiting = false;
        return;
    }
    if (!display.includes(".")) {
        display += ".";
    }
}

function handleOperator(nextOperator){
    if (isNaN(parseFloat(display))) {
        return;
    }
    const inputValue = parseFloat(display);

    if (firstOperand !== null && waiting){
        currentOperator = nextOperator;
        return;
    }

    if (firstOperand === null) {
        firstOperand = inputValue;
    } else if (currentOperator !== null) {
        const result = operate(currentOperator, firstOperand, inputValue);
        if (result === null){
            showDivideByZeroError();
            return;
        }
        display = String(roundDisplay(result));
        firstOperand = roundDisplay(result);
    }

    waiting = true;
    currentOperator = nextOperator;
}

function handleEqual(){
    if (currentOperator === null || waiting) {
        return;
    }
    const inputValue = parseFloat(display);
    const result = operate(currentOperator, firstOperand, inputValue);
    if (result === null) {
        showDivideByZeroError();
        return;
    }
    const rounded = roundDisplay(result);
    previousOperation = firstOperand + " " + operatorSymbol(currentOperator) + " " + inputValue + " = " + rounded;
    display = String(rounded);
    firstOperand = null;
    secondOperand = null;
    waiting = true;
}

function deleteNum(){
    if (waiting) {
        return;
    }
    display = display.slice(0, -1);
    if (display === "") {
        display = "0";
    }
}

function clearAll(){
    firstOperand = null;
    secondOperand = null;
    currentOperator = null;
    previousOperation = "";
    display = "0";
    waiting = false;
}

function showDivideByZeroError(){
    const messages = ["Nice try. Can't divide by zero.", "Division by zero? Bold move.", "That would break the universe", "Zero said no. Try again."];
    const index = Math.floor(Math.random() * messages.length);
    display = messages[index];
    waiting = true;
    firstOperand = null;
    secondOperand = null;
}

function updateDisplay(){
    resultDisplay.textContent = display;
    previousDisplay.textContent = previousOperation;

    if (currentOperator !== null && firstOperand !== null) {
        expressionDisplay.textContent = firstOperand + " " + operatorSymbol(currentOperator);
    } else {
        expressionDisplay.textContent = "";
    }
    decimalButton.disabled = display.includes(".");
    undoButton.disabled = historyStack.length === 0;

    operatorButtons.forEach(function (button){
        button.classList.remove("active");
        if (button.dataset.operator === currentOperator && waiting) {
            button.classList.add("active");
        }
    });
}

numberButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        saveState();
        inputDigit(button.textContent);
        updateDisplay();
    });
});

operatorButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    saveState();
    handleOperator(button.dataset.operator);
    updateDisplay();
  });
});

equalsButton.addEventListener("click", function () {
  saveState();
  handleEqual();
  updateDisplay();
});

clearButton.addEventListener("click", function () {
  saveState();
  clearAll();
  updateDisplay();
});

deleteButton.addEventListener("click", function () {
  saveState();
  deleteNum();
  updateDisplay();
});

decimalButton.addEventListener("click", function () {
  saveState();
  inputDecimal();
  updateDisplay();
});

undoButton.addEventListener("click", function () {
  undo();
  updateDisplay();
});

document.addEventListener("keydown", function (event) {
  const key = event.key;
  if (key >= "0" && key <= "9") {
    saveState();
    inputDigit(key);
    updateDisplay();
    return;
  }
  if (key === "+" || key === "-" || key === "*" || key === "/") {
    saveState();
    handleOperator(key);
    updateDisplay();
    return;
  }
  if (key === "Enter" || key === "=") {
    saveState();
    handleEqual();
    updateDisplay();
    return;
  }
  if (key === "Backspace") {
    saveState();
    deleteNum();
    updateDisplay();
    return;
  }
  if (key === "Escape") {
    saveState();
    clearAll();
    updateDisplay();
    return;
  }
  if (key === ".") {
    saveState();
    inputDecimal();
    updateDisplay();
    return;
  }
  if (key === "z" || key === "Z") {
    undo();
    updateDisplay();
    return;
  }
});

updateDisplay();