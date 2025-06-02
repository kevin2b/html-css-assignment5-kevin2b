const billAmountInput = document.querySelector("#js-bill-amount");
const billTipRadioGroup = [...document.querySelectorAll(".js-bill-tip")];
const billTipCustomInput = document.querySelector("#js-bill-tip-custom");
const peopleErrorZero = document.querySelector("#js-people-error");
const peopleInput = document.querySelector("#js-bill-people");
const inputPeopleWrapper = document.querySelector("#js-input-people-wrapper");
const resetButton = document.querySelector("#js-result-reset");

//Reset values on page load
window.addEventListener("pageshow", () => {
  resetInputs();
});

resetButton.addEventListener("click", () => {
  //Only reset if button is enabled
  if (resetButton.classList.contains("js-result__reset--enable")) {
    resetInputs();
  }
  return;
});

billAmountInput.addEventListener("input", () => {
  controlResetAvailability();
  updateResult();
});

billTipRadioGroup.forEach((billTipRadio) => {
  billTipRadio.addEventListener("change", (e) => {
    controlResetAvailability();
    updateResult();
  });
});

peopleInput.addEventListener("input", () => {
  peopleErrorZero.classList.add("js-hidden");
  inputPeopleWrapper.classList.remove("js-error-border");
  controlResetAvailability();
  if (peopleInput.value === "0") {
    peopleErrorZero.classList.remove("js-hidden");
    inputPeopleWrapper.classList.add("js-error-border");
  }
  updateResult();
});

billTipCustomInput.addEventListener("input", () => {
  updateResult();
});

//Update Result.
//Sets Result to zero if any input is invalid
function updateResult() {
  setResultTipDOM("$0.00");
  setResultTotalDOM("$0.00");
  if (checkInputValid()) {
    const amount = billAmountInput.value;
    const numOfPeople = peopleInput.value;
    const billTipRadioSelected = document.querySelector(".js-bill-tip:checked");
    var tipAmount;
    if (billTipRadioSelected.value != "js-custom") {
      tipAmount = billTipRadioSelected.value;
    } else {
      tipAmount = billTipCustomInput.value;
    }
    //Convert to decimal
    tipAmount *= 0.01;
    const [tipPerPerson, totalPerPerson] = calculateResult(
      +amount,
      +numOfPeople,
      tipAmount
    );
    setResultTipDOM("$" + tipPerPerson);
    setResultTotalDOM("$" + totalPerPerson);
  }
}

function checkInputValid() {
  var valid = true;

  valid &= billAmountInput.validity.valid;
  valid &= peopleInput.validity.valid;

  valid &= billTipRadioGroup.some((billTipRadio) => {
    if (billTipRadio.checked && billTipRadio.value != "js-custom") {
      return true;
    }
    if (
      billTipRadio.checked &&
      billTipRadio.value == "js-custom" &&
      billTipCustomInput.validity.valid
    ) {
      return true;
    }
    return false;
  });
  return valid;
}

//Reset form
function resetInputs() {
  peopleErrorZero.classList.add("js-hidden");
  inputPeopleWrapper.classList.remove("js-error-border");
  billAmountInput.value = "";
  billTipCustomInput.value = "";
  billTipRadioGroup.forEach((billTipRadio) => {
    billTipRadio.checked = false;
  });
  peopleInput.value = "";
  setResultTipDOM("$0.00");
  setResultTotalDOM("$0.00");

  //Disable reset button
  resetButton.classList.remove("js-result__reset--enable");
}

//Enable/disable reset button in DOM based on whether any inputs are different from default
function controlResetAvailability() {
  //If amount,people input has value or radio button selected enable reset.
  if (
    billAmountInput.value.length > 0 ||
    billAmountInput.validity.badInput ||
    peopleInput.value.length > 0 ||
    peopleInput.validity.badInput ||
    billTipRadioGroup.some((billTipRadio) => billTipRadio.checked)
  ) {
    resetButton.classList.add("js-result__reset--enable");
    return;
  }

  //Disable reset otherwise
  resetButton.classList.remove("js-result__reset--enable");
}

function setResultTipDOM(message) {
  const resultTip = document.querySelector("#js-result-tip");
  resultTip.textContent = message;
}

function setResultTotalDOM(message) {
  const resultTotal = document.querySelector("#js-result-total");
  resultTotal.textContent = message;
}

/**
 * Calulate tip and total per person
 * @param {number} amount total amount to be paid
 * @param {number} numOfPeople number of people
 * @param {number} tipDecimal tip in decimal
 * @returns an array containing tip per person and total per person rounded to 2 decimal places
 */
function calculateResult(amount, numOfPeople, tipDecimal) {
  amount = +amount;
  numOfPeople = +numOfPeople;
  tipDecimal = +tipDecimal;
  const tip = amount * tipDecimal;
  const total = amount + tip;
  return [
    (Math.floor((tip / numOfPeople) * 100) / 100).toFixed(2),
    (total / numOfPeople).toFixed(2),
  ];
}
