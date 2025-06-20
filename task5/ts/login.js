var userLoginData = {
    radioType: "district",
    state: "",
    username: "",
    password: "",
    rememberMe: true
};
var states = ["Alabama", "Alabama1", "Alabama", "Alabama3"];
var districts = [
    "Alabama School District",
    "Alabama School District1",
];
var schools = ["Alabama School", "Alabama School"];
var stateSelect = document.getElementById("stateSelect");
var rememberMeButton = document.getElementById("checkBoxButton");
var rememberMeImage = document.getElementById("checkBoxButtonImage");
var passwordInput = document.getElementById("password");
var previewImage = document.getElementById("previewImage");
states.forEach(function (state) {
    var option = document.createElement("option");
    option.value = state.toLowerCase();
    option.textContent = state;
    stateSelect.appendChild(option);
});
var districtSchoolSelect = document.getElementById("districtSchoolSelect");
districts.forEach(function (district) {
    var option = document.createElement("option");
    option.value = district.toLowerCase();
    option.textContent = district;
    districtSchoolSelect.appendChild(option);
});
var districtButton = document.getElementById("districtButton");
var schoolButton = document.getElementById("schoolButton");
var districtRadio = document.getElementById("districtRadio");
var schoolRadio = document.getElementById("schoolRadio");
var districtSchoolText = document.getElementById("districtSchoolText");
var stateSelectButton = document.getElementById("stateSelectButton");
var districtSelectButton = document.getElementById("districtSelectButton");
districtSelectButton.addEventListener("click", function () {
    districtSchoolSelect.dispatchEvent(new MouseEvent("mousedown", { bubbles: true }));
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
    districts.forEach(function (district) {
        var option = document.createElement("option");
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
    schools.forEach(function (school) {
        var option = document.createElement("option");
        option.value = school.toLowerCase();
        option.textContent = school;
        districtSchoolSelect.appendChild(option);
    });
});
rememberMeButton.addEventListener("click", function () {
    if (userLoginData.rememberMe) {
        rememberMeImage.src = "images/checkbox-unchecked.svg";
        userLoginData.rememberMe = false;
    }
    else {
        rememberMeImage.src = "images/checkbox-checked.svg";
        userLoginData.rememberMe = true;
    }
});
previewImage.addEventListener("click", function () {
    var isPasswordVisible = passwordInput.type == "text";
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
