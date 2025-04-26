const todoList = document.getElementById('todo-list');
const addForm = document.getElementById('add-todo-form');
const titleInput = document.getElementById('title');
const descriptionInput = document.getElementById('description');
const addErrorDiv = document.getElementById('add-error');
const listErrorDiv = document.getElementById('list-error');

const apiUrl = '/todos'; // Base URL for the API

// --- Helper function to display errors ---
function displayError(element, message) {
    element.textContent = message;
    element.style.display = 'block';
}

function clearError(element) {
    element.textContent = '';
    element.style.display = 'none';
}


// --- Fetch and display todos ---
async function fetchTodos() {
    clearError(listErrorDiv);
    try {
        const response = await fetch(apiUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const todos = await response.json();

        todoList.innerHTML = ''; // Clear existing list
        if (todos.length === 0) {
            todoList.innerHTML = '<li>No todos yet!</li>';
        } else {
            todos.forEach(todo => {
                const li = createTodoElement(todo);
                todoList.appendChild(li);
            });
        }
    } catch (error) {
        console.error('Error fetching todos:', error);
        displayError(listErrorDiv, 'Failed to load todos. Please try again later.');
    }
}

// --- Create HTML element for a single todo ---
function createTodoElement(todo) {
    const li = document.createElement('li');
    li.dataset.id = todo.id; // Store ID for later use
    if (todo.completed) {
        li.classList.add('completed');
    }

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = todo.completed;
    checkbox.addEventListener('change', () => toggleComplete(todo));

    // Content (Title and Description)
    const contentDiv = document.createElement('div');
    contentDiv.classList.add('content');

    const titleSpan = document.createElement('span');
    titleSpan.textContent = todo.title;
    contentDiv.appendChild(titleSpan);

    if (todo.description) {
        const descriptionSpan = document.createElement('div');
        descriptionSpan.classList.add('description');
        descriptionSpan.textContent = todo.description;
        contentDiv.appendChild(descriptionSpan);
    }

    // Action Buttons
    const actionsDiv = document.createElement('div');
    actionsDiv.classList.add('actions');

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('edit-button');
    editButton.addEventListener('click', () => editTodo(todo));

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.classList.add('delete-button');
    deleteButton.addEventListener('click', () => deleteTodo(todo.id));

    actionsDiv.appendChild(editButton);
    actionsDiv.appendChild(deleteButton);

    li.appendChild(checkbox);
    li.appendChild(contentDiv);
    li.appendChild(actionsDiv);

    return li;
}

// --- Add a new todo ---
addForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent default form submission
    clearError(addErrorDiv);

    const title = titleInput.value.trim();
    const description = descriptionInput.value.trim();

    if (!title) {
        displayError(addErrorDiv, 'Title is required.');
        return;
    }

    const newTodo = {
        title: title,
        description: description || null, // Send null if empty
        completed: false
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newTodo),
        });

        if (!response.ok) {
            // Try to get error detail from API response
            let errorDetail = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorDetail = errorData.detail || errorDetail;
            } catch (e) { /* Ignore if response is not JSON */ }
            throw new Error(errorDetail);
        }

        // Clear form and refresh list
        titleInput.value = '';
        descriptionInput.value = '';
        fetchTodos();

    } catch (error) {
        console.error('Error adding todo:', error);
        displayError(addErrorDiv, `Failed to add todo: ${error.message}`);
    }
});

// --- Toggle todo completion status ---
async function toggleComplete(todo) {
    const updatedTodo = {
        ...todo, // Spread existing data
        completed: !todo.completed // Toggle the status
    };

    try {
        const response = await fetch(`${apiUrl}/${todo.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTodo),
        });

        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorDetail = errorData.detail || errorDetail;
            } catch (e) { /* Ignore */ }
            throw new Error(errorDetail);
        }
        fetchTodos(); // Refresh the list to show the change visually
    } catch (error) {
        console.error('Error updating todo:', error);
        // Optionally display an error message near the list item
        alert(`Failed to update todo status: ${error.message}`);
        // Revert checkbox state visually on failure
        fetchTodos(); // Re-fetch to ensure UI consistency
    }
}

// --- Edit a todo ---
async function editTodo(todo) {
    const newTitle = prompt("Enter new title:", todo.title);
    if (newTitle === null) return; // User cancelled

    const newDescription = prompt("Enter new description:", todo.description || "");
    if (newDescription === null) return; // User cancelled


    const updatedTodo = {
        title: newTitle.trim() || todo.title, // Keep old if empty
        description: newDescription.trim() || null,
        completed: todo.completed // Keep existing completed status
    };

    // Prevent sending empty title
    if (!updatedTodo.title) {
        alert("Title cannot be empty.");
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${todo.id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedTodo),
        });

        if (!response.ok) {
            let errorDetail = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorDetail = errorData.detail || errorDetail;
            } catch (e) { /* Ignore */ }
            throw new Error(errorDetail);
        }
        fetchTodos(); // Refresh list
    } catch (error) {
        console.error('Error editing todo:', error);
        alert(`Failed to edit todo: ${error.message}`);
    }
}


// --- Delete a todo ---
async function deleteTodo(id) {
    if (!confirm('Are you sure you want to delete this todo?')) {
        return;
    }

    try {
        const response = await fetch(`${apiUrl}/${id}`, {
            method: 'DELETE',
        });

        if (response.status === 404) {
            throw new Error("Todo not found.");
        } else if (!response.ok && response.status !== 204) { // 204 No Content is OK for DELETE
            let errorDetail = `HTTP error! status: ${response.status}`;
            try {
                const errorData = await response.json();
                errorDetail = errorData.detail || errorDetail;
            } catch (e) { /* Ignore */ }
            throw new Error(errorDetail);
        }

        fetchTodos(); // Refresh list
    } catch (error) {
        console.error('Error deleting todo:', error);
        alert(`Failed to delete todo: ${error.message}`);
    }
}

// --- Initial load ---
document.addEventListener('DOMContentLoaded', fetchTodos);
