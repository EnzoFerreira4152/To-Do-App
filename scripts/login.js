window.addEventListener('load', function(){
    let appiUrl = 'https://ctd-todo-api.herokuapp.com/v1';
    const form = document.forms[0];
    const inputEmailLogin = document.querySelector('#inputEmail');
    const inputPassword = document.querySelector('#inputPassword');
    const buttonLogin = document.querySelector('button[type="submit"]');
    const warning = document.querySelector('.wrong-user');
    const passEyeToggle = document.querySelector('#passwordToggle')
    const loader = document.querySelector('.loader');
    
    form.addEventListener('submit', function(event){
        event.preventDefault();
        buttonLogin.classList.add('ocult');
        loader.classList.remove('ocult');

        setTimeout(()=>{
            let payload = normalizeDataLogin(inputEmailLogin.value, inputPassword.value);
            const settings = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload)
            };

            fetch(`${appiUrl}/users/login`, settings)
            .then(response => response.json())
            .then(data =>{
                if(data.jwt){
                    localStorage.setItem('token', data.jwt)
                    location.href = '/mis-tareas.html';
                }
                else{
                    warning.classList.remove('ocult');
                    inputEmailLogin.classList.remove('inputOk');
                    inputPassword.classList.remove('inputOK');
                    inputEmailLogin.classList.add('inputError');
                    inputPassword.classList.add('inputError');
                    loader.classList.add('ocult');
                    buttonLogin.classList.remove('ocult')
                    setTimeout(() =>{
                        warning.classList.add('ocult');
                    }, 4000)
                }
            });
        }, 2500)
    });

    passEyeToggle.addEventListener('click', () =>{
        if(passEyeToggle.innerHTML === `<i class="far fa-eye"></i>`){
            passEyeToggle.innerHTML = `<i class="far fa-eye-slash"></i>`;
            toggleShowPass();
        }else{
            passEyeToggle.innerHTML = `<i class="far fa-eye"></i>`;
            toggleShowPass();
        }
    });

    /* -------------------------------------------------------------------------- */
    /*                           validaciones de campos                           */
    /* -------------------------------------------------------------------------- */
    form.addEventListener('change', () =>{
        let resConfirm = notEmpty(inputEmailLogin.value) && notEmpty(inputPassword.value);
        if(resConfirm){
            buttonLogin.removeAttribute('disabled');
            buttonLogin.classList.remove('disabled');
        }else{
            buttonLogin.setAttribute('disabled', '');
            buttonLogin.classList.add('disabled');
        }
    });

    inputEmailLogin.addEventListener('blur', () =>{
        if(inputEmailLogin.value.includes('@')){
            inputEmailLogin.classList.remove('inputError');
            inputEmailLogin.classList.add('inputOK');
        }else{
            inputEmailLogin.classList.remove('inputOK');
            inputEmailLogin.classList.add('inputError');
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






});