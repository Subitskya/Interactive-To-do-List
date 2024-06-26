const newTaskInput = document.getElementById('new-task');
const addTaskButton = document.getElementById('add-task');
const todoList = document.getElementById('todo-list');
let currentEditTask = null;

document.addEventListener('DOMContentLoaded', loadTasks);

addTaskButton.addEventListener('click', handleAddOrUpdateTask);

todoList.addEventListener('click', function(event) {
    if (event.target.type === 'checkbox') {
        event.target.parentElement.classList.toggle('completed');
        saveTasks();
    }  else if (event.target.closest('.remove-task')) {
        event.target.closest('li').remove();
        saveTasks();
    } else if (event.target.classList.contains('edit-task')) {
        const listItem = event.target.parentElement.parentElement;
        const text = listItem.childNodes[1].nodeValue.trim();
        newTaskInput.value = text;
        addTaskButton.textContent = 'Update Task';
        addTaskButton.removeEventListener('click', handleAddOrUpdateTask);
        addTaskButton.addEventListener('click', function updateHandler() {
            updateTask(listItem, newTaskInput.value.trim());
            addTaskButton.textContent = 'Add Task';
            addTaskButton.removeEventListener('click', updateHandler);
            addTaskButton.addEventListener('click', handleAddOrUpdateTask);
        });
    }
});

function handleAddOrUpdateTask() {
    const taskText = newTaskInput.value.trim();
    if (taskText) {
        if (currentEditTask) {
            updateTask(currentEditTask, taskText);
            addTaskButton.textContent = 'Add Task';
            currentEditTask = null;
        } else {
            addTask(taskText);
        }
        saveTasks();
        newTaskInput.value = '';
    }
}

function addTask(taskText, isCompleted = false) {
    const newListItem = document.createElement('li');
    newListItem.textContent = taskText;

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    if (isCompleted) {
        checkbox.checked = true;
        newListItem.classList.add('completed');
    }
    newListItem.insertBefore(checkbox, newListItem.firstChild);

    const buttonGroup = document.createElement('div');
    buttonGroup.className = 'button-group';

    // const editButton = document.createElement('button');
    // // editButton.textContent = 'Edit';
    // // editButton.className = 'edit-task';
    // editButton.innerHTML = '<i class="fas fa-edit"></i>'; 
    // buttonGroup.appendChild(editButton);

    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="fas fa-edit"></i>';
    editButton.className = 'edit-task';
    buttonGroup.appendChild(editButton);

    const removeButton = document.createElement('button');
    removeButton.innerHTML = '<i class="fa-solid fa-trash"></i>';
    removeButton.className = 'remove-task';
    buttonGroup.appendChild(removeButton);

    newListItem.appendChild(buttonGroup);

    todoList.appendChild(newListItem);
}

function updateTask(listItem, updatedText) {
    if (updatedText) {
        listItem.childNodes[1].nodeValue = updatedText;
        newTaskInput.value = '';
        saveTasks();
    }
}

function saveTasks() {
    const tasks = [];
    todoList.querySelectorAll('li').forEach(item => {
        tasks.push({
            text: item.childNodes[1].nodeValue.trim(),
            completed: item.classList.contains('completed')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks'));
    if (tasks) {
        tasks.forEach(task => addTask(task.text, task.completed));
    }
}
