let display = "0";
let firstOperand = null;
let secondOperand = null;
let waiting = false;
let previousOperand = "";
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
        operator: previousOperand,
        display: display,
        waiting: waiting,
        previousOperation: previousOperand
    });
}

function undo(){
    if (historyStack.length === 0) {
        return;
    }
    const lastState = historyStack.pop();
    firstOperand = lastState.firstOperand;
    secondOperand = lastState.secondOperand;
    previousOperand = lastState.previousOperation;
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
    if (isNan(parseFloat(display))) {
        return;
    }
    const inputValue = parseFloat(display);

    if (firstOperand !== null && waiting){
        previousOperand = nextOperator;
        return;
    }