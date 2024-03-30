const slider = document.querySelector("#passwordLengthSlider");
const lengthOfPassword = document.querySelector("#lengthOfPassword");
const passwordField = document.querySelector("#passwordfield");
const copyButton = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const upperCase = document.querySelector("#upperCase");
const lowerCase = document.querySelector("#lowerCase");
const numbers = document.querySelector("#numbers");
const symbols = document.querySelector("#symbols");
const passwordStrength = document.querySelector("#strength");
const generatePassword = document.querySelector(".generateButton");
const allCheckboxes = document.querySelectorAll("input[type=checkbox]");
const symbolString = "!@#$%^&*()_-+=`~{}[];:,.<>?/";

let password = "";
let checkCount = 0;
let passwordlength = 10;

handleSlider();

function handleSlider() {
  passwordlength = slider.value;
  lengthOfPassword.innerText = passwordlength;

  const min = slider.min
  const max = slider.max 
  slider.style.backgroundSize = ((passwordlength - min)*100/(max-min))+"% 100%"
}

function setPasswordStrength(strength, color) {
  passwordStrength.textContent = strength;
  passwordStrength.style.color = color;
}

function getRandomInteger(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function getNumber() {
  return getRandomInteger(0, 9);
}

function getUpperCase() {
  return String.fromCharCode(getRandomInteger(65, 90));
}

function getLowerCase() {
  return String.fromCharCode(getRandomInteger(97, 122));
}

function getSymbol() {
  return symbolString.charAt(getRandomInteger(0, symbolString.length));
}

slider.addEventListener("input", (e) => {
  slider.value = e.target.value;
  handleSlider();
});

function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNumber = false;
  let hasSymbol = false;

  if (upperCase.checked) hasUpper = true;
  if (lowerCase.checked) hasLower = true;
  if (numbers.checked) hasNumber = true;
  if (symbols.checked) hasSymbol = true;
  if (hasUpper && hasLower && (hasNumber || hasSymbol) && passwordlength >= 8) {
    setPasswordStrength("Strong", "#2DFE54");
  } else if (
    hasUpper &&
    hasLower &&
    hasNumber &&
    passwordlength >= 6 &&
    passwordlength < 8
  ) {
    setPasswordStrength("Medium", "#FFFDAF");
  } else {
    setPasswordStrength("Low", "#FF474C");
  }
}

async function copyContent() {
  try {
    await navigator.clipboard.writeText(passwordField.value);
    copyMsg.textContent = "Copied";
  } catch (error) {
    copyMsg.textContent = "Failed ";
  }
  copyMsg.classList.add("active");
  setTimeout(() => {
    copyMsg.classList.remove("active");
  }, 3000);
}

function checkboxCheck() {
  checkCount = 0;
  // if(upperCase.checked){
  //     checkCount++
  // }
  // if(lowerCase.checked){
  //     checkCount++
  // }
  // if(numbers.checked){
  //     checkCount++
  // }
  // if(symbols.checked){
  //     checkCount++
  // }

  allCheckboxes.forEach((checkbox) => {
    if (checkbox.checked) {
      checkCount++;
    }
  });
  if (passwordlength < checkCount) {
    slider.value = checkCount;
    handleSlider();
  }
}
function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

allCheckboxes.forEach((checkbox) => {
  checkbox.addEventListener("change", checkboxCheck);
});
copyButton.addEventListener("click", () => {
  if (passwordField.value) copyContent();
});

generatePassword.addEventListener("click", () => {
  if (checkCount == 0) return;

  if (passwordlength < checkCount) {
    slider.value = checkCount;
    handleSlider();
  }

  password = "";

  // if(upperCase.checked){
  //     password=password + getUpperCase()

  // }

  // if(lowerCase.checked){
  //     password+=getLowerCase()
  // }

  // if(numbers.checked){
  //     password+=getNumber()
  // }

  // if(symbols.checked){
  //     password+=getSymbol()
  // }

  let funcArray = [];
  if (upperCase.checked) {
    funcArray.push(getUpperCase);
  }
  if (lowerCase.checked) {
    funcArray.push(getLowerCase);
  }
  if (numbers.checked) {
    funcArray.push(getNumber);
  }
  if (symbols.checked) {
    funcArray.push(getSymbol);
  }

  for (let i = 0; i < funcArray.length; i++) {
    password += funcArray[i]();
  }

  for (let i = 0; i < passwordlength - funcArray.length; i++) {
    let randomNumber = getRandomInteger(0, funcArray.length);
    password += funcArray[randomNumber]();
  }

  password = shufflePassword(Array.from(password));

  passwordField.value = password;
  calcStrength();
});
