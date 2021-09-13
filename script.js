class Calculator { // classe da calculadora, todas funções dela estão aqui
    constructor(previousTextElement, currentTextElement) { // inicia setando as váriaveis baiscas e limpando os campos
        this._previousTextElement = previousTextElement; // valor atual (linha de baixo)
        this._currentTextElement = currentTextElement; // valor anterior (linha de cima)
        this.clear()
        this._equals = true; // verificador do igual
    }

    clear() { // limpa os operadores, os campos de texto e verificador '='
        this._currentText = '0';
        this._previousText = '';
        this._operation = undefined;
        this._equals = true;
        this.updateDisplay();
    }

    delete() { // remove o último digito
        this._currentText = this._currentText.toString().slice(0, -1);
    }   
    
    appendNumber(number) { // adiciona um número ou ponto
        if (this._equals) {
            this.clear();
            this._currentText = '';
            this._equals = false;
        }
        if (number === '.' && this._currentText.includes('.')) {return} // verifica se já existe um ponto
        this._currentText = this._currentText.toString() + number.toString(); // adiciona o valor ao final da linha
    }

    chooseOperator(operation) { // adiciona o operador e chama a função para a conta
        this._equals = false;
        if (this._currentText === '') {return} // ignora caso campo atual esteja vazio
        if (this._previousText !== '') { // caso tenha sido inserido um operador anteriormente
            this.compute()
        }
        this._operation = operation; // define um valor para o operador
        this._previousText = this._currentText + operation.toString(); // atualiza o valor anterior com o operador
        this._currentText = '';
    }

    compute() { // ponto principal do programa, onde ocorre a conta
        // variaveis para o calculo
        let computation
        const prev = parseFloat(this._previousText)
        const current = parseFloat(this._currentText)
        
        if (isNaN(prev) || isNaN(current)) {return}

        switch (this._operation) { // calculo a partir do operador definido
            case '+':
                computation = prev + current;
                break;
            case '-':
                computation = prev - current;
                break;
            case '*':
                computation = prev * current;
                break;
            case '÷':
                computation = prev / current;
                break;
            default:
                return
        }

        // atualiza os campos
        this._currentText = computation;
        this._operation = undefined;
        this._previousText = '';
    }

    equals() { // apenas quando '=' é apertado
        if (this._currentText === '' || !this._operation) {return}
        this.compute();
        this.updateDisplay();
        this._equals = true;
    }

    refactorNumber(number) { // refatora o numero para o padrão brasileiro
        const stringNumber = number.toString();
        const integerDigits = parseFloat(stringNumber.split('.')[0]);
        const decimalDigits = stringNumber.split('.')[1];
        let integerDisplay;

        if (isNaN(integerDigits)) {
            integerDisplay = ''
        }
        else {
            integerDisplay = integerDigits.toLocaleString('br', {maximumFractionDigits: 0})
        }
        if (decimalDigits != null) {
            return `${integerDisplay},${decimalDigits}`
        }
        else {
            return integerDisplay
        }
    }

    updateDisplay() { // atualiza os campos de texto
        this._currentTextElement.innerText = this.refactorNumber(this._currentText);
        this._previousTextElement.innerText = this._previousText;
    }
}

// variaveis referentes ao html
const numberButtons = document.querySelectorAll('[data-number]');
const operationButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-equals]');
const delButton = document.querySelector('[data-del]');
const clearButton = document.querySelector('[data-clear]');
const previousTextElement = document.querySelector('[data-previous]');
const currentTextElement = document.querySelector('[data-current]');

const calculator = new Calculator(previousTextElement, currentTextElement) // cria uma nova instancia da classe

numberButtons.forEach(button => { // evento para os numeros e ponto
    button.addEventListener('click', () => {
        calculator.appendNumber(button.innerText);
        calculator.updateDisplay();
    })
})

operationButtons.forEach(button => { // evento para os operadores
    button.addEventListener('click', () => {
        calculator.chooseOperator(button.innerText);
        calculator.updateDisplay();
    })
})

equalsButton.addEventListener('click', () => { // evento para o '='
    calculator.equals();
})

clearButton.addEventListener('click', () => { // evento para o clear
    calculator.clear();
    calculator.updateDisplay();
})

delButton.addEventListener('click', () => { // evento para o del
    calculator.delete();
    calculator.updateDisplay();
}) 