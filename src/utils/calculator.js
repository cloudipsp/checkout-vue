const operation = {
  '-': (a, b) => a - b,
  '+': (a, b) => a + b,
  '*': (a, b) => a * b,
  '/': (a, b) => a / b,
}

const calculator = (o, a, b) => operation[o](Number(a), Number(b))

export default calculator
