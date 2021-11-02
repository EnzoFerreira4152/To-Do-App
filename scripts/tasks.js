if(!localStorage.getItem('token')){
    location.replace('/');
}
window.addEventListener('load', () =>{
    const apiUrl='https://ctd-todo-api.herokuapp.com/v1';
    const myToken=localStorage.getItem('token');
    const formTask=document.querySelector('.nueva-tarea');
    const btnChangeNotDone=document.querySelectorAll('.not-done button');
    const btnClose= document.querySelector('#closeApp');
/* -------------------------------------------------------------------------- */
/*                             Lógica App                                     */
/* -------------------------------------------------------------------------- */
    getUserInfo(apiUrl, myToken);
    getTasks(apiUrl, myToken);
    formTask.addEventListener('submit', (event) =>{
        event.preventDefault();
        createNewTask(apiUrl, myToken);
        getTasks(apiUrl, myToken);
        setInterval(() =>{
            formTask.reset()
        }, 500);
    });
    btnChangeNotDone.forEach(button =>{
        button.addEventListener('click', () =>{
            modifyTask(apiUrl, myToken, button.id)
            getTasks(apiUrl, myToken);
        });
    });
    btnClose.addEventListener('click', ()=>{
        logOut();
    })
/* -------------------------------------------------------------------------- */
/*                           funciones a usar                                 */
/* -------------------------------------------------------------------------- */
    function getUserInfo(url, token){
        const userName=document.querySelector('.user-info p');
        const settings={
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        };
        fetch(`${url}/users/getMe`, settings)
        .then(response => response.json())
        .then(data =>{
            userName.innerText = `¡Hola, ${data.firstName}!`
        });
    };

    function createNewTask(url, token){
        let inputTask=document.querySelector('#nuevaTarea');
        const payload={
            description: inputTask.value,
            completed: false
        };
        const settings={
            method: 'POST',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        };
        fetch(`${url}/tasks`, settings)
        .then(response => response.json())
        .then(task =>{
            console.log(task)
        })
    };

    function getTasks(url, token){
        const settings={
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        };
        fetch(`${url}/tasks`, settings)
        .then(response => response.json())
        .then(tasks =>{
            renderTasks(tasks)
        });
    };

    function getOneTask(url, token, taskId){
        const settings={
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        };
        fetch(`${url}/tasks/${taskId}`, settings)
        .then(response => response.json())
        .then(task => {
            return task;
        });
    }

    function changeTaskState() {
        const btnStateChange = document.querySelectorAll('.change');
        btnStateChange.forEach(button => {
            //a cada boton le asignamos una funcionalidad
            button.addEventListener('click', function (event) {
            const id = event.target.id;
            const url = `${apiUrl}/tasks/${id}`
            const payload = {};
            //segun el tipo de boton que fue clickeado, cambiamos el estado de la tarea
            if (event.target.classList.contains('fa-undo-alt')) {
                payload.completed = false;
            } else {
                payload.completed = true;
            }
            const settingsCambio = {
                method: 'PUT',
                headers: {
                "Authorization": myToken,
                "Content-type": "application/json"
                },
                body: JSON.stringify(payload)
            }
            fetch(url, settingsCambio)
                .then(response => {
                console.log(response.status);
                getTasks(`${apiUrl}/tasks`, myToken);
                });
            });
        });
    }

    function deleteTask() {
        const btnDelete=document.querySelectorAll('.tarea button:nth-child(2)');
        btnDelete.forEach(button => {
            button.addEventListener('click', event => {
                const id = event.target.id;
                const url = `${apiUrl}/tasks/${id}`
                const settings = {
                    method: 'DELETE',
                    headers: {
                    "Authorization": myToken,
                    }
                };
                fetch(url, settings)
                .then(response => {
                    getTasks(`${apiUrl}/tasks`, myToken);
                });
            });
        });
    }

    function modifyTask(url, token, taskId){
        const payload=JSON.parse(getOneTask(url, token, taskId));
        const settings={
            method: 'PUT',
            headers: {
                'Authorization': token,
                'Conten-Type': 'application/json'
            },
            body: payload += payload.completed = true
        };
        fetch(`${url}/tasks/${taskId}`, settings)
        .then(response => response.json())
        .then(response => {
            console.log(response);
        });
    };

    function renderTasks(arrayTasks){
        const boxFinishedTasks=document.querySelector('.tareas-terminadas');
        const boxUnfinishedTasks=document.querySelector('.tareas-pendientes');
        const skeleton=document.querySelector('#skeleton')
        skeleton.innerHTML="";
        arrayTasks.forEach(task => {
            if(task.completed){
                boxFinishedTasks.innerHTML+=`
                    <li class="tarea">
                        <div class="done"></div>
                        <div class="descripcion">
                            <p class="nombre">${task.description}</p>
                            <div>
                                <button><i id="${task.id}" class="fas fa-undo-alt change"></i></button>
                                <button><i id="${task.id}" class="far fa-trash-alt"></i></button>
                            </div>
                        </div>
                    </li>`
            }else{
                boxUnfinishedTasks.innerHTML+=`
                <li class="tarea">
                    <div class="not-done change" id="${task.id}">
                    <button></button>
                    </div>
                    <div class="descripcion">
                        <p class="nombre">${task.description}</p>
                        <p class="timestamp"><i class="farfa-calendar-alt"></i> ${task.createdAt}</p>
                    </div>
                </li>`
            }
        });
        changeTaskState();
        deleteTask();
    };

    function logOut(){
        if(location.origin == "https://enzoferreira4152.github.io"){
            location.href = '/To-Do-App';
        }else{
            location.href = '/index.html'
        }
        localStorage.clear();
    };








});