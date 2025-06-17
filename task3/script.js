function getFactorial(n) {
  if (n === 0 || n === 1) return "1";

  const base = 100000;
  let result = [1];

  for (let i = 2; i <= n; i++) {
    let carry = 0;

    for (let j = result.length - 1; j >= 0; j--) {
      let num = result[j]*i+carry;
      result[j]=num%base;
      carry = Math.floor(num/base);
    }

    while (carry > 0) {
      result.unshift(carry%base);
      carry = Math.floor(carry/base);
    }
  }

  return result.map((num, idx) => idx === 0 ? num.toString() : num.toString().padStart(5, '0')).join('');
}


document
  .getElementById("numberForm")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const input = document.getElementById("inputNum").value;
    const number = parseInt(input);
    const resultDiv = document.getElementById("result");

    if (isNaN(number) || number < 0) {
      resultDiv.innerHTML = `Result: Enter a valid number (Integer)`;
    } else {
      resultDiv.innerHTML = `Result: factorial of ${number} is ${getFactorial(
        number
      )}`;
    }
  });
