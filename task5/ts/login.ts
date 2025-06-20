interface UserLoginData {
  radioType: string;
  state: string;
  username: string;
  password: string;
  rememberMe: boolean;
}

const userLoginData: UserLoginData = {
  radioType: "district",
  state: "",
  username: "",
  password: "",
  rememberMe: true
};

const states: Array<string> = ["Alabama", "Alabama1", "Alabama", "Alabama3"];
const districts: Array<string> = [
  "Alabama School District",
  "Alabama School District1",
];
const schools: Array<string> = ["Alabama School", "Alabama School"];

const stateSelect = document.getElementById("stateSelect") as HTMLSelectElement;
const rememberMeButton = document.getElementById(
  "checkBoxButton"
) as HTMLDivElement;
const rememberMeImage = document.getElementById(
  "checkBoxButtonImage"
) as HTMLImageElement;
const passwordInput = document.getElementById("password") as HTMLInputElement;
const previewImage = document.getElementById(
  "previewImage"
) as HTMLImageElement;

states.forEach((state) => {
  let option = document.createElement("option");
  option.value = state.toLowerCase();
  option.textContent = state;
  stateSelect.appendChild(option);
});

const districtSchoolSelect = document.getElementById(
  "districtSchoolSelect"
) as HTMLSelectElement;

districts.forEach((district) => {
  let option = document.createElement("option");
  option.value = district.toLowerCase();
  option.textContent = district;
  districtSchoolSelect.appendChild(option);
});

const districtButton = document.getElementById(
  "districtButton"
) as HTMLDivElement;
const schoolButton = document.getElementById("schoolButton") as HTMLDivElement;

const districtRadio = document.getElementById(
  "districtRadio"
) as HTMLImageElement;
const schoolRadio = document.getElementById("schoolRadio") as HTMLImageElement;

const districtSchoolText = document.getElementById(
  "districtSchoolText"
) as HTMLDivElement;

const stateSelectButton = document.getElementById(
  "stateSelectButton"
) as HTMLImageElement;
const districtSelectButton = document.getElementById(
  "districtSelectButton"
) as HTMLImageElement;

districtSelectButton.addEventListener("click", function () {
  districtSchoolSelect.dispatchEvent(
    new MouseEvent("mousedown", { bubbles: true })
  );
});

stateSelectButton.addEventListener("click", function () {
  stateSelect.focus();
});

districtButton.addEventListener("click", function () {
  districtRadio.src = "images/radio-button-on.svg";
  schoolRadio.src = "images/radio-button-off.svg";
  userLoginData.radioType = "district";
  districtSchoolText.innerText = "District*";
  districtSchoolSelect.innerHTML = "";
  districts.forEach((district) => {
    let option: HTMLOptionElement = document.createElement("option");
    option.value = district.toLowerCase();
    option.textContent = district;
    districtSchoolSelect.appendChild(option);
  });
});

schoolButton.addEventListener("click", function () {
  districtRadio.src = "images/radio-button-off.svg";

  schoolRadio.src = "images/radio-button-on.svg";

  userLoginData.radioType = "school";
  districtSchoolText.innerText = "Independent school*";
  districtSchoolSelect.innerHTML = "";
  schools.forEach((school: string) => {
    let option: HTMLOptionElement = document.createElement("option");
    option.value = school.toLowerCase();
    option.textContent = school;
    districtSchoolSelect.appendChild(option);
  });
});

rememberMeButton.addEventListener("click", function () {
  if (userLoginData.rememberMe) {
    rememberMeImage.src = "images/checkbox-unchecked.svg";
    userLoginData.rememberMe = false;
  } else {
    rememberMeImage.src = "images/checkbox-checked.svg";
    userLoginData.rememberMe = true;
  }
});

previewImage.addEventListener("click", function () {
  const isPasswordVisible = passwordInput.type == "text";
  passwordInput.type = isPasswordVisible ? "password" : "text";
  previewImage.src = isPasswordVisible
    ? "images/preview.svg"
    : "https://cdn-icons-png.flaticon.com/128/10898/10898993.png";

  if (isPasswordVisible) {
    previewImage.style.width = "24px";
    previewImage.style.height = "25px";
  }
});

// export {}
