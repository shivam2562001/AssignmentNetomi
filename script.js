
let countries = [];
let states = [];
let countrySelect = document.getElementById("country");
let stateSelect = document.getElementById("state");
stateSelect.style.display = "none";
let result = {};


let validations = []


if (window.addEventListener) {
    // For standards-compliant web browsers
    window.addEventListener("message", displayMessage, false);
} else {
    window.attachEvent("onmessage", displayMessage);
}



function displayMessage(evt) {
    if (evt.origin !== "http://127.0.0.1:5500") {
        return false;
    } else {
        validations = evt.data.validators;
    }
}

axios
    .get(
        "https://raw.githubusercontent.com/stefanbinder/countries-states/master/countries.json"
    )
    .then(function (response) {
        console.log(response.data);
        countries = response.data;
        countries.forEach((country) => {
            let option = document.createElement("option");
            option.value = country.code3;
            option.text = country.name;
            countrySelect.appendChild(option);
        });
    })
    .catch(function (error) {
        console.log(error, "Error loading countries!");
    });

countrySelect.addEventListener("change", function () {
    let selectedCountry = this.value;
    states = [];
    countries.forEach(function (country) {
        if (country.code3 === selectedCountry) {
            states = country.states;
            return false;
        }
    });

    stateSelect.style.display = "block";
    stateSelect.innerHTML = "";
    let option = document.createElement("option");
    option.value = "";
    option.text = "Select a state";
    states.forEach(function (state) {
        let option = document.createElement("option");
        option.value = state.code;
        option.text = state.name;
        stateSelect.appendChild(option);
    });
});

function formValidation(name, email, contactNumber, country, state) {
    let error = false;
    validations.find((info) => {
        switch (info.field) {
            case "name":
                if (info.validator[0] && name.length < info.validator[0].minlength) {
                    result["Name"] = { error: "Name should be between 4-10 characters." };
                    error = true;

                }
                if (info.validator[0] && name.length > info.validator[0].maxlength) {
                    result["Name"] = { error: "Name should be between 4-10 characters." };
                    error = true;
                }
                break;

            case "email":
                if (info.validator[0] && info.validator[0].required) {
                    if (!validateEmail(email)) {
                        result["Email"] = { error: "Enter Valid Email address." };
                        error = true;
                    }
                }

                break;
            case "contact":
                if (info.validator[0] && info.validator[0].required) {
                    if (!validateContactNumber(contactNumber)) {
                        result["Contact"] = { error: "Mobile number should be of 10 digits." };
                        error = true;
                    }
                }
                break;
            case "country":
                if (info.validator[0] && info.validator[0].required) {
                    if (country === "") {
                        result["Country"] = { error: "Please select a country." };
                        error = true;
                    }
                }
                break;
            case "state":
                if (info.validator[0] && info.validator[0].required) {
                    if (state === "") {
                        result["State"] = { error: "Please select a state." };
                        error = true;
                    }

                }
                break;
            default:
                break;
        }

    })

    return error;
}

let form  = document.getElementById("info-form");
    form.addEventListener("submit", (e) => {
        // on form submission, prevent default
        e.preventDefault();
        let name = document.getElementById("name").value;
        let email = document.getElementById("email").value;
        let contactNumber = document.getElementById("contact-number").value;
        let country = document.getElementById("country").value;
        let state = document.getElementById("state").value;
        
        let isError = formValidation(name, email, contactNumber, country, state);
    
        if(!isError){           
            result = { Success: "All fields are valid." };
            form.reset();
            stateSelect.style.display = "none";
         }

   
    
        window.parent.postMessage(result, "*");
        return true;
    })
    
function validateForm() {
  
}

function validateEmail(email) {
    let regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validateContactNumber(contactNumber) {
    let regex = /^\d{10}$/;
    return regex.test(contactNumber);
}
