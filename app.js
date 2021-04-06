const prompt = require('prompt-sync')({sigint: true});

function processParkingcharge(timein, timeout){
  let cost = calculateCost(timein, timeout);
  let input = prompt(`Your parking charge is £${cost}, please enter payment-in amount, for example "£5" or "£20, £1, 50p, 1p" : `);
  //input is a string i.e "£20, £1, £1, £1, £1, £1, £1, 20p"
  while (!input || input.split('£')[1] < cost || input[0] !== '£' ) {
    console.log('Invalid entry, please try again!');
    input = prompt(`Your parking charge is £${cost}, please enter payment-in amount, for example "£5" or "£20, £1, 50p, 1p" : `);
  }
  //convert input string to an array of numbers i.e [20, 1, 1, 1, 1, 1, 1, 0.2]
  let paymentIn = processInput(input)
  let outputChange = calculateMinChange(cost, paymentIn);
  console.log(`Thank you! Please collect your change.\nOutput Change: ${formatOutputChange(outputChange)}`)

}

function calculateCost(timein, timeout) {
  let timeInArr = timein.split(':');
  let timeOutArr = timeout.split(':');
  let numOfMinsAtEntry = Number((timeInArr[0] * 60)) + Number(timeInArr[1])
  let numOfMinsAtExit = Number((timeOutArr[0] * 60)) + Number(timeOutArr[1])
//if exit time is the following day, add 24 hours to timeout
  if (Number(timeInArr[0]) <= Number(timeOutArr[0])) {
    let numOfMinsInCarPark = numOfMinsAtExit - numOfMinsAtEntry;
    if(numOfMinsInCarPark > 60) {
      let cost = 3 + (numOfMinsInCarPark - 60) / 100;
      return cost
    } else {
      return 3.00;
    }
  } else {
    let numOfMinsInCarPark = (numOfMinsAtExit + (24 * 60)) - numOfMinsAtEntry;
    let cost = 3 + ((numOfMinsInCarPark - 60) / 100);
    return cost;
  }
}

function calculateMinChange(cost, payment) {
  //calculate sum of payment in
  let paymentSum = payment.reduce((a, b) => a + b, 0);
  let change = (paymentSum - cost).toFixed(2)
  let coins = [0.01, 0.02, 0.05, 0.10, 0.20, 0.50, 1, 5, 10, 20]
  let descCoins = coins.sort((a,b) => b-a);
  let outputChangeArray = []
  for (let i = 0; i < descCoins.length; i++) {
      while (descCoins[i] <= change ) {
        outputChangeArray.push(descCoins[i]);
        change = (change - descCoins[i]).toFixed(2)
      }
  }
  return outputChangeArray;
}


function formatOutputChange(outputArray) {
  let formattedOutput = []
  for (let element of outputArray) {
    if (element < 1) {
      formattedOutput.push(element * 100 + 'p')
    } else {
      formattedOutput.push('£' + element)
    }
  }
  return formattedOutput.join(', ');
}

function processInput(input) {
  let inputArray = input.split(', ');
  let processedInputArray = [];
  for (let element of inputArray) {
    if (element[0] === '£') {
      processedInputArray.push(Number(element.slice(1)));
    } else {
      processedInputArray.push(element.match(/\d+/g) / 100);
    }
  }
  return processedInputArray;
}

processParkingcharge('16:14', '19:09')
