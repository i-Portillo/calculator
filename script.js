// Auxiliar functions
add =       (a, b) => (a + b);
subtract =  (a, b) => (a - b);
multiply =  (a, b) => (a * b);
divide =    (a, b) => (a / b);

isDigit =   (ch) => /\d/.test(ch);
isPoint =   (ch) => ch === '.';
isOperator = (ch) => /\+|-|\*|\//.test(ch)

class Token {
    constructor(type, value) {
        this.type = type;
        this.value = value;
    }
}

function operate (operator, a, b) {
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
validateNumber = (number) => /^-?\d+(\.\d+)?$/.test(number);

/*  Validates the operations, including collapsing minus signs and allowing
    negative numbers.
    Follows the idea that any expression is formed from an expression,
    an operator, and another expression, or a number. It must start with a
    number and then cycle between operator and number until it reaches the end.
*/
function validateOperations (operations) {
    let expected = "number";
    for (let index = 0; index < operations.length; index++) {
        let token = operations[index];
        if (token.type === "number") {
            if (!validateNumber(token.value)) {
                console.log(token.value + " " + "Error, number not valid.");
                return false;
            }
        }
        if (token.type === expected) {
            expected = (token.type === "number" ? "operator" : "number");
            continue;
        } else {
            if (token.value === '-' && operations[index+1].type === "number") {
                operations[index+1].value = 
                        (-1 * operations[index+1].value).toString();
                operations.splice(index, 1);
                index = index - 1;
                continue;
            }
            if (token.value === '-' && operations[index+1].value === "-") {
                operations.splice(index, 2);
                index = index - 1;
                continue;
            }
            return false;
        }
    }
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
    console.log(operations);
    while (operations.length > 0) {
        let item = operations.shift();
        if (item.type === "number") {
            operands.push(parseFloat(item.value));
        } else {
            let b = operands.pop();
            let a = operands.pop();
            if (item.value === '/' && b === 0)
                return "Trying to divide by 0!";
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