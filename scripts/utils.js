function standardData(data){
    return (data.toLowerCase().trim());
}

function normalizeDataLogin(userEmail, userPassword){
    const userData={
        email: standardData(userEmail),
        password: userPassword
    }
    return userData;
}

function normalizeDataSignup(userName, userLastname, userEmail, userPass){
    const userRegistry={
        firstName: standardData(userName),
        lastName: standardData(userLastname),
        email: standardData(userEmail),
        password: userPass.trim()
    }
    return userRegistry;
}

function notEmpty(inputValue){
    let isValid = false
    if(inputValue != ""){
        isValid = true;
    }
    return isValid;
}

function validatePass(userPassword){
    let isValid=true;
    if(userPassword.length < 6 || userPassword > 25){
        isValid=false;
        return isValid
    }
    for (let i=0; isValid && (i < userPassword.length); i++) {
        if(userPassword.charAt(i) == " "){
            isValid=false;
        }
    }
    return isValid
}

function matchPass(userPass, repeatpass){
    let isValid=false;
    if(userPass == repeatpass){
        isValid = true;
    }
    return isValid
}

function toggleShowPass(){
    let typeInput = document.getElementById("inputPassword");
    if(typeInput.type == "password"){
        typeInput.type = "text";
    }else{
        typeInput.type = "password";
    }
}