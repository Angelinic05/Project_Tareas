// app.js

// Función para crear una nueva tarea
async function crearTarea() {
    const taskName = document.getElementById("taskName").value;
    const startDate = document.getElementById("startDate").value;
    const endDate = document.getElementById("endDate").value;
    const personName = document.getElementById("personName").value;

    if (!taskName || !startDate || !endDate || !personName) {
        alert("Por favor, completa todos los campos.");
        return;
    }

    const task = {
        name: taskName,
        startDate: startDate,
        endDate: endDate,
        person: personName,
        completed: false
    };

    try {
        const response = await fetch('http://localhost:3001/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        
        if (!response.ok) {
            throw new Error('Error al crear la tarea.');
        }

        const createdTask = await response.json();
        const taskElement = crearElementoTarea(createdTask);
        document.getElementById("pendingTasks").appendChild(taskElement);
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Función para obtener todas las tareas y mostrarlas al cargar la página
window.addEventListener('load', async () => {
    try {
        const response = await fetch('http://localhost:3001/tasks');
        if (!response.ok) {
            throw new Error('Error al obtener las tareas.');
        }
        const tasks = await response.json();
        tasks.forEach(task => {
            crearElementoTarea(task); // Llamar a la función para cada tarea
        });
    } catch (error) {
        console.error('Error:', error.message);
    }
});


// Función para crear un elemento HTML para mostrar una tarea
function crearElementoTarea(task) {
    const taskElement = document.createElement("div");
    taskElement.classList.add("task");
    taskElement.dataset.id = task.id;

    const taskStatusClass = task.completed ? "completedTasks" : "pendingTasks";

    taskElement.innerHTML = `
        <p>Nombre de la tarea: ${task.name}</p>
        <p>Fecha de inicio: ${task.startDate} - Fecha final: ${task.endDate}</p>
        <p>Persona asignada: ${task.person}</p>
        ${!task.completed ? `<button class="complete-btn" onclick="moverTarea(this.parentElement, 'completedTasks')">Completada</button>` : ""}
        ${!task.completed ? `<button class="fail-btn" onclick="moverTarea(this.parentElement, 'failedTasks')">No Cumplida</button>` : ""}
        <button class="delete-btn" onclick="eliminarTarea(this.parentElement)">Eliminar</button>
        <button class="edit-btn" onclick="editarTarea(this.parentElement)">Editar</button>
    `;

    document.getElementById(taskStatusClass).appendChild(taskElement);
}






// Función para mover una tarea a la sección de tareas completadas o no cumplidas
// Función para mover una tarea a la sección de tareas completadas o no cumplidas
async function moverTarea(taskElement, targetSectionId) {
    const taskId = taskElement.dataset.id;
    const targetSection = document.getElementById(targetSectionId);
    
    try {
        const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                [targetSectionId === 'completedTasks' ? 'completed' : 'failed']: true
            }),
        });
        
        if (!response.ok) {
            throw new Error('Error al actualizar el estado de la tarea.');
        }

        // Remover la tarea del contenedor actual y agregarla al nuevo contenedor
        taskElement.remove();
        targetSection.appendChild(taskElement);
    } catch (error) {
        console.error('Error:', error.message);
    }
}







// Función para eliminar una tarea
async function eliminarTarea(taskElement) {
    const taskId = taskElement.dataset.id;

    try {
        const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Error al eliminar la tarea.');
        }

        taskElement.remove();
    } catch (error) {
        console.error('Error:', error.message);
    }
}

// Función para editar una tarea
async function editarTarea(taskElement) {
    const taskId = taskElement.dataset.id;
    const newName = prompt("Ingrese el nuevo nombre de la tarea:");

    if (!newName) {
        return;
    }

    try {
        const response = await fetch(`http://localhost:3001/tasks/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newName }),
        });

        if (!response.ok) {
            throw new Error('Error al editar la tarea.');
        }

        const updatedTask = await response.json();
        taskElement.querySelector("p:first-child").textContent = `Nombre de la tarea: ${updatedTask.name}`;
    } catch (error) {
        console.error('Error:', error.message);
    }
}

