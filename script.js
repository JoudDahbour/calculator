let display = "0";
let firstOperand = null;
let currentOperator = null;
let waiting = false;
let previousOperation = "";

const resultDisplay = document.querySelector(".display-result");
const expressionDisplay = document.querySelector(".display-expression");
const previousDisplay = document.querySelector(".display-previous");
const numberButtons = document.querySelectorAll(".key-number");
const operatorButtons = document.querySelectorAll(".key-operator");
const equalsButton = document.querySelector(".key-equals");
const clearButton = document.querySelector(".key-clear");
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
        return null;
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
    waiting = true;
}

function undo(){
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
    currentOperator = null;
    previousOperation = "";
    display = "0";
    waiting = false;
}

function showDivideByZeroError(){
    const messages = ["Nice try. Can't divide by zero.", "Division by zero? Bold move.", "That would break the universe", "Zero said no. Try again."];
    const index = Math.floor(Math.random() * messages.length);
    display = messages[index];
    firstOperand = null;
    currentOperator = null;
    previousOperation = "";
    waiting = true;
}

function updateDisplay(){
    resultDisplay.textContent = display;
    resultDisplay.scrollLeft = resultDisplay.scrollWidth;
    if (isNaN(parseFloat(display))) {
        resultDisplay.classList.add("message");
    } else {
        resultDisplay.classList.remove("message");
    }
    previousDisplay.textContent = previousOperation;

    if (currentOperator !== null && firstOperand !== null) {
        expressionDisplay.textContent = firstOperand + " " + operatorSymbol(currentOperator);
    } else {
        expressionDisplay.textContent = "";
    }
    decimalButton.disabled = display.includes(".");

    operatorButtons.forEach(function (button){
        button.classList.remove("active");
        if (button.dataset.operator === currentOperator && waiting) {
            button.classList.add("active");
        }
    });
}

numberButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        inputDigit(button.textContent);
        updateDisplay();
    });
});

operatorButtons.forEach(function (button) {
  button.addEventListener("click", function () {
    handleOperator(button.dataset.operator);
    updateDisplay();
  });
});

equalsButton.addEventListener("click", function () {
  handleEqual();
  updateDisplay();
});

clearButton.addEventListener("click", function () {
  clearAll();
  updateDisplay();
});

decimalButton.addEventListener("click", function () {
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
    inputDigit(key);
    updateDisplay();
    return;
  }
  if (key === "+" || key === "-" || key === "*" || key === "/") {
    handleOperator(key);
    updateDisplay();
    return;
  }
  if (key === "Enter" || key === "=") {
    handleEqual();
    updateDisplay();
    return;
  }
  if (key === "Backspace") {
    undo();
    updateDisplay();
    return;
  }
  if (key === "Escape") {
    clearAll();
    updateDisplay();
    return;
  }
  if (key === ".") {
    inputDecimal();
    updateDisplay();
    return;
  }
  if (key === "ArrowLeft") {
    resultDisplay.scrollLeft -= 20;
    return;
  }
  if (key === "ArrowRight") {
    resultDisplay.scrollLeft += 20;
    return;
  }
});

updateDisplay();