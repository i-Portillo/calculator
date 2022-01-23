// Auxiliar functions
add =       (a, b) => (a + b);
subtract =  (a, b) => (a - b);
multiply =  (a, b) => (a * b);
divide =    (a, b) => (a / b);

isDigit =   (ch) => /\d/.test(ch);
isPoint =   (ch) => ch === '.';
isOperator = (ch) => /\+|-|\*|\//.test(ch)

function Token (type, value) {
    this.type = type;
    this.value = value;
}

function operate (operator, a, b) {
    console.log(a + operator + b);  //DEBUG
    switch (operator) {
        case '+':
            return add (a, b);
        case '-':
            return subtract (a, b);
        case '*':
            return multiply (a, b);
        case '/':
            return divide (a, b);
    }
};

/*  Recives a string of operations and returns a
    list of ...
*/ 
function tokenizer (operations) {
    let tokens = [];
    let numberBuffer = [];
    operations = operations.split('');
    operations.forEach(ch => {
        if (isDigit(ch) || isPoint(ch)) {
            numberBuffer.push(ch);
        } else if (isOperator(ch)) {
            if (numberBuffer.length !== 0) {
                let numberToken = new Token("number", numberBuffer.join(""));
                tokens.push(numberToken);
                numberBuffer = [];
            }
            let operatorToken = new Token("operator", ch);
            tokens.push(operatorToken);
        }
    });
    if (numberBuffer.length !== 0) {
        let numberToken = new Token("number", numberBuffer.join(""));
        tokens.push(numberToken);
        numberBuffer = [];
    }
    return tokens;
};

// Validates number tokens making sure no more than one point appears.
validateNumber = (number) => /^\d+(\.\d+)?$/.test(number);

function validateOperations (operations) {
    let expected = "number";
    operations.every(token => {
        if (token.type === "number") {
            if (!validateNumber(token.value)) return false;
        }
        if (token.type === expected) {
            expected = (token.type === "number" ? "operator" : "number");
            return true;
        } else {
            return false;
        }
    });
    if (expected === "number") {    // Last token was operator
        return false;
    }
    return true;
};

// Assigns a priority to each operator as per (* /) > (+ -)
// and returns true if a's priority is higher
function priorityCheck (a, b) {
    let priorityA = (a === '+' || a === '-') ? 1 : 2 ;
    let priorityB = (b === '+' || b === '-') ? 1 : 2 ;
    //console.log(a + " " + priorityA + ", " + b + " " + priorityB);
    return priorityA > priorityB;
}

// Returns a postfix version of the operations
function toPostfix (operations) {
    let stack = [];
    let result = [];
    operations.forEach(token => {
        if (token.type === "number") result.push(token);
        else {
            while (!(stack.length === 0 ||
                priorityCheck(token.value, stack.at(-1).value))) {
                    result.push(stack.pop());    
            }
            stack.push(token);
        }
    });
    while (stack.length > 0) {
        result.push(stack.pop());
    }
    return result;
};

function solve (operations) {
    let operands = [];
    while (operations.length > 0) {
        let item = operations.shift();
        if (item.type === "number") {
            operands.push(parseFloat(item.value));
        } else {
            let b = operands.pop();
            let a = operands.pop();
            operands.push(operate(item.value, a, b));
        }
    }
    return operands[0];
};

function compute (operations) {
    let tokens = tokenizer(operations);
    if (validateOperations(tokens)) {
        console.log(solve(toPostfix(tokens)));
    } else {
        console.log("SYNTAX ERROR");
    }
};

let operationsDisplay = document.querySelector("#operations");
operations = operationsDisplay.textContent;

const equal = document.querySelector("#equal");
equal.addEventListener('click', {
    // TODO
});