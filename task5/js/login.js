
const userLoginData={
    radioType:"district",
    state:"",
    username:"",
    password:"",
    rememberMe:true

};

document.addEventListener("DOMContentLoaded", function () {
const states = ["Alabama","Alabama1","Alabama","Alabama3"];
const districts=["Alabama School District","Alabama School District1"]

const schools=["Alabama School","Alabama School"]
const stateSelect = document.getElementById("stateSelect");

const rememberMeButton=document.getElementById("checkBoxButton");
const rememberMeImage=document.getElementById("checkBoxButtonImage");

const passwordInput = document.getElementById('password');
const previewImage = document.getElementById('previewImage');


states.forEach(state => {
    var option = document.createElement("option");
    option.value = state.toLowerCase();
    option.textContent = state;
    stateSelect.appendChild(option);
});


const districtSchoolSelect = document.getElementById("districtSchoolSelect");

districts.forEach(district => {
    var option = document.createElement("option");
    option.value = district.toLowerCase();
    option.textContent = district;
    districtSchoolSelect.appendChild(option);
});

    const districtButton = document.getElementById('districtButton');
    const schoolButton = document.getElementById('schoolButton');

    const districtRadio = document.getElementById('districtRadio');
    const schoolRadio = document.getElementById('schoolRadio');

    const districtSchoolText=document.getElementById("districtSchoolText");

    const stateSelectButton=document.getElementById("stateSelectButton");
    const districtSelectButton=document.getElementById("districtSelectButton");


    districtSelectButton.addEventListener("click",function(){
    districtSchoolSelect.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
    });

    stateSelectButton.addEventListener("click",function(){
stateSelect.focus();
    });

    districtButton.addEventListener('click', function () {
        districtRadio.src = 'images/radio-button-on.svg';
        schoolRadio.src = 'images/radio-button-off.svg';
        userLoginData.radioType = 'district';
        districtSchoolText.innerText="District*";
        districtSchoolSelect.innerHTML = '';
        districts.forEach(district => {
    var option = document.createElement("option");
    option.value = district.toLowerCase();
    option.textContent = district;
    districtSchoolSelect.appendChild(option);
});


    });

    schoolButton.addEventListener("click",function(){
        districtRadio.src='images/radio-button-off.svg';

        schoolRadio.src='images/radio-button-on.svg';

        userLoginData.radioType="school";
        districtSchoolText.innerText="Independent school*";
        districtSchoolSelect.innerHTML = '';
        schools.forEach(school =>{
            var option = document.createElement("option");
            option.value = school.toLowerCase();
            option.textContent = school;
            districtSchoolSelect.appendChild(option);
        })

    });

    rememberMeButton.addEventListener("click",function(){
        if (userLoginData.rememberMe){
        rememberMeImage.src="images/checkbox-unchecked.svg";
        userLoginData.rememberMe=false;
        }
        else{
        rememberMeImage.src="images/checkbox-checked.svg";
        userLoginData.rememberMe=true;
        }
        }
        
    );

    previewImage.addEventListener("click",function(){

        const isPasswordVisible=passwordInput.type=="text";
        passwordInput.type=isPasswordVisible?"password":"text";
        previewImage.src=isPasswordVisible?'images/preview.svg': "https://cdn-icons-png.flaticon.com/128/10898/10898993.png";

        if(isPasswordVisible){
            previewImage.style.width="24px";
            previewImage.style.height="25px";
        }
    });





});

