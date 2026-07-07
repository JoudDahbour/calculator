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

