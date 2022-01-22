// Auxiliar functions
add =       (a, b) => (a + b);
subtract =  (a, b) => (a - b);
multiply =  (a, b) => (a * b);
divide =    (a, b) => (a / b);

isDigit =   (ch) => /\d/.test(ch);
isPoint =   (ch) => ch === '.';
isOperator = (ch) => /\+|-|\*|\//.test(ch)

function Token(type, value) {
    this.type = type;
    this.value = value;
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
function parseOperations (operations) {
    let tokens = [];
    let stack = [];
    let numberBuffer = [];
    operations = operations.split('');
    operations.forEach(ch => {
        console.log(numberBuffer);
        if (isDigit(ch) || isPoint(ch)) {
            numberBuffer.push(ch);
        } else if (isOperator(ch)) {
            if (numberBuffer.length !== 0) {
                let numberToken = new Token("number", numberBuffer.join(""));
                stack.push(numberToken);
                numberBuffer = [];
            }
            let operatorToken = new Token("operator", ch);
            stack.push(operatorToken);
        }
    });
    if (numberBuffer.length !== 0) {
        let numberToken = new Token("number", numberBuffer.join(""));
        stack.push(numberToken);
        numberBuffer = [];
    }

    return stack;
};

let operationsDisplay = document.querySelector("#operations");
operations = operationsDisplay.textContent;

const equal = document.querySelector("#equal");
equal.addEventListener('click', {
    // TODO
});