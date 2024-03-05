// taskApi.js

const URL_API = "http://localhost:3001/tasks";

const getTasks = async () => {
    try {
        const response = await fetch(URL_API);
        if (!response.ok) {
            throw new Error('Error al obtener las tareas.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error.message);
    }
};

const createTask = async (task) => {
    try {
        const response = await fetch(URL_API, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        if (!response.ok) {
            throw new Error('Error al crear la tarea.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error.message);
    }
};

const updateTask = async (taskId, task) => {
    try {
        const response = await fetch(`${URL_API}/${taskId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
        if (!response.ok) {
            throw new Error('Error al actualizar la tarea.');
        }
        return await response.json();
    } catch (error) {
        console.error('Error:', error.message);
    }
};

const deleteTask = async (taskId) => {
    try {
        const response = await fetch(`${URL_API}/${taskId}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            throw new Error('Error al eliminar la tarea.');
        }
        return true;
    } catch (error) {
        console.error('Error:', error.message);
        return false;
    }
};

export { getTasks, createTask, updateTask, deleteTask };
