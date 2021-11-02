window.addEventListener('load', function (){
    let appiUrl = 'https://ctd-todo-api.herokuapp.com/v1';
    let form = document.querySelector('form');
    let inputName = document.querySelector('#name');
    let inputLastName = document.querySelector('#lastName');
    let inputEmail = document.querySelector('#email');
    let inputPassword = document.querySelector('#password');
    let inputRepeatPass = document.querySelector('#repeatPass');
    let buttonSubmit = document.querySelector('button');
    const loader = document.querySelector('.loader');

    form.addEventListener('submit', function(e){
        e.preventDefault();
        buttonLogin.classList.add('ocult');
        loader.classList.remove('ocult');

        setTimeout(()=>{
            let payload = normalizeDataSignup(inputName.value, inputLastName.value, inputEmail.value, inputPassword.value);
            const settings = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            };

            fetch(`${appiUrl}/users`, settings)
            .then(response => response.json())
            .then(data =>{
                if(data.jwt){
                    localStorage.setItem('token', data.jwt);
                    location.href = '/mis-tareas.html';
                }else{
                    warning.classList.remove('ocult');
                }
            });
        }, 2500);
    });

    form.addEventListener('change', function(){
        let resConfirm = notEmpty(inputName.value) && notEmpty(inputLastName.value) && notEmpty(inputEmail.value) && notEmpty(inputPassword.value) && notEmpty(inputRepeatPass.value);
        if(resConfirm){
            buttonSubmit.removeAttribute('disabled');
            buttonSubmit.classList.remove('disabled');
        }
        if(!resConfirm){
            buttonSubmit.setAttribute('disabled', '');
            buttonSubmit.classList.add('disabled');
        }
    });

    inputPassword.addEventListener('change', () =>{
        if(validatePass(inputPassword.value)){
            inputPassword.classList.remove('inputError');
            inputPassword.classList.add('inputOK');
        }else{
            inputPassword.classList.remove('inputOK');
            inputPassword.classList.add('inputError');
        }
    });

    inputRepeatPass.addEventListener('change', ()=>{
        if(validatePass(inputRepeatPass.value) && (matchPass(inputPassword.value, inputRepeatPass.value))){
            inputRepeatPass.classList.remove('inputError');
            inputRepeatPass.classList.add('inputOK');
        }else{
            inputRepeatPass.classList.remove('inputOK');
            inputRepeatPass.classList.add('inputError');
        }
    });

});