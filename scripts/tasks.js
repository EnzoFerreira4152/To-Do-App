if(!localStorage.getItem('token')){
    location.replace('/');
}
window.addEventListener('load', () =>{
    const apiUrl = 'https://ctd-todo-api.herokuapp.com/v1';
    const myToken = localStorage.getItem('token');
    const formTaskInput = document.querySelector('.nueva-tarea');
    const btnClose = document.querySelector('#closeApp');

/* -------------------------------------------------------------------------- */
/*                             Lógica App                                     */
/* -------------------------------------------------------------------------- */
    getUserInfo(apiUrl, myToken);
    getTasks(`${apiUrl}/tasks`, myToken);
    formTaskInput.addEventListener('submit', (event) =>{
        event.preventDefault();
        createNewTask(apiUrl, myToken);
        setTimeout(() =>{
            formTaskInput.reset()
        }, 700);
    });
    btnClose.addEventListener('click', ()=>{
        logOut();
    })

/* -------------------------------------------------------------------------- */
/*                           funciones a usar                                 */
/* -------------------------------------------------------------------------- */
    function getUserInfo(url, token){
        const userName = document.querySelector('.user-info p');
        const settings = {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        };
        fetch(`${url}/users/getMe`, settings)
        .then(response => response.json())
        .then(data =>{
            userName.innerText = `¡Hola, ${data.lastName} ${data.firstName}!`
        });
    };

    function createNewTask(url, token){
        let inputTask = document.querySelector('#nuevaTarea');
        const payload = {
            description: inputTask.value,
            completed: false
        };
        const settings = {
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
            getTasks(`${apiUrl}/tasks`, myToken);
        })
    };

    function getTasks(url, token){
        const settings = {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        };
        fetch(url, settings)
        .then(response => response.json())
        .then(tasks =>{
            renderTasks(tasks)
        });
    };

    function changeTaskState() {
        const btnStateChange = document.querySelectorAll('.change');
        btnStateChange.forEach(button => {
            //a cada boton le asignamos una funcionalidad
            button.addEventListener('click', function (event) {
            const id = event.target.id;
            const urlFetch = `${apiUrl}/tasks/${id}`
            const payload = {};
            //segun el tipo de boton que fue clickeado, cambiamos el estado de la tarea
            if (event.target.classList.contains('fa-undo-alt')) {
                payload.completed = false;
            } else {
                payload.completed = true;
            }
            const settings = {
                method: 'PUT',
                headers: {
                "Authorization": myToken,
                "Content-type": "application/json"
                },
                body: JSON.stringify(payload)
            }
            fetch(urlFetch, settings)
                .then(response => {
                    getTasks(`${apiUrl}/tasks`, myToken);
                });
            });
        });
    }

    function deleteTask() {
        const btnDelete = document.querySelectorAll('.fa-trash-alt');
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
        const payload = JSON.parse(getOneTask(url, token, taskId));
        const settings = {
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

    function renderTasks(array){
        const containerFinishedTasks = document.querySelector('.tareas-terminadas');
        const containerUnfinishedTasks = document.querySelector('.tareas-pendientes');
        containerFinishedTasks.innerHTML = "";
        containerUnfinishedTasks.innerHTML = "";
        
        array.forEach(task => {
            if(task.completed){
                containerFinishedTasks.innerHTML+=`
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
                containerUnfinishedTasks.innerHTML+=`
                <li class="tarea">
                    <div class="not-done change" id="${task.id}">
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