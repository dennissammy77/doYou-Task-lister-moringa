# To-Do List Mini Project: doYou

## Description
This is a simple task management application that allows users to add, delete, edit, and sort tasks with priority levels. The application dynamically updates the DOM to reflect user inputs and modifications.

## Features.
### Task Input & Submission
- Users can type a task into an input field.
- A submit button allows users to add the task to the list.
- Once submitted, the task appears in the DOM.
### Delete Tasks
Users can remove tasks from the list with a delete button next to each task.

### Priority Levels with Color Coding
Users can select a priority level (High, Medium, Low) from a dropdown.
Tasks are displayed with different colors based on priority:
    - Red → High Priority
    - Yellow → Medium Priority
    - Green → Low Priority
### Sorting by Priority
Users can sort tasks in ascending or descending order based on priority.
### Edit Tasks
Users can edit existing tasks to update their information.
### Edit Tasks

## Technologies Used
- HTML
- CSS
- JavaScript
- IndexedDB (Database)

## IndexedDB
IndexedDB is an asynchronous, NoSQL database built into modern browsers. It allows you to store key-value pairs and structured objects, making it suitable for offline storage of tasks.

### Why IndexedDB
IndexedDB is particularly useful for web applications that need to work offline or have significant data storage requirements.It offers features such as data indexing, transactions, and cursor-based navigation, making it a powerful choice for managing data in web applications.

### Key Concepts
- Database (IDBDatabase): The main storage for your data.
- Object Store (IDBObjectStore): Similar to a table in SQL, but stores JavaScript objects.
- Transactions (IDBTransaction): Used to read/write data safely.
- Indexes (IDBIndex): Help in searching for specific data.
- Requests (IDBRequest): Asynchronous calls to interact with the database.
- Cursors (IDBCursor): Used for iterating over multiple records.

### Setting up
1. Creating a DB
To create a database in IndexedDB, you need to open a connection to it.
```Js
const indexedDB = window.indexedDb || window.mozIndexedDb || window.webkitIndexedDb || window.msIndexedDb || window.shimIndexedDb;
```
`indexedDB` gets the db api based on the browser you are using;
```Js
function openDatabase(){
    return new Promise((resolve, reject)=>{
        const request = indexedDB.open("doYOuDB", 1); // Params include the name and the version of your DB.
    
        // handle errors
        request.onerror = function(event) {
            console.error("Error in locating and setting up indexedDb",event);
            reject("Error in locating and setting up indexedDb: " + event.target.error);
        };
    
        // runs the first time the db is created or version is updated
        // describes how the shape of db is going to look like
        request.onupgradeneeded = function(event) { 
            let db = event.target.result;
            const store = db.createObjectStore("tasks", { keyPath: "id", autoIncrement: true }); // similar to tables // collections
            // keyPath unique id
            store.createIndex("taskName", "name", { unique: false });
            store.createIndex("taskStatus", "status", { unique: false });
            store.createIndex("taskDate", "date", { unique: false });
            //Indexes in IndexedDB allow efficient querying of data based on specific properties.
        };
        
        request.onsuccess = function(event) {
            let db = event.target.result;
            const transaction = db.transaction("tasks", "readwrite"); 
            /* transactions are operations to the db and they ensure data consistency
            * They provide a way to perform multiple database operations as a single logical unit of work.
            **/
            const store = db.createObjectStore("tasks");
            const nameIndex = store.index("taskName")
            const statusIndex = store.index("taskStatus")
            const dateIndex = store.index("taskDate")
            resolve(event.target.result);
        };
    })
}
```
```Js
export async function addTask(task) {
    const db = await openDatabase();
    const transaction = db.transaction("tasks", "readwrite");
    const store = transaction.objectStore("tasks");

    return new Promise((resolve, reject) => {
        const request = store.add(task);
        request.onsuccess = () => resolve("Task added successfully!");
        request.onerror = () => reject("Failed to add task.");
    });
}
```
```Js
export async function getTasks() {
    const db = await openDatabase();
    const transaction = db.transaction("tasks", "readonly");
    const store = transaction.objectStore("tasks");
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Failed to fetch tasks.");
    });
}
```
```Js

export async function updateTask(id, updates) {
    const db = await openDatabase();
    const transaction = db.transaction("tasks", "readwrite");
    const store = transaction.objectStore("tasks");

    return new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => {
            const task = request.result;
            if (!task) return reject("Task not found.");

            Object.assign(task, updates); // Merge updates
            const updateRequest = store.put(task);

            updateRequest.onsuccess = () => resolve("Task updated!");
            updateRequest.onerror = () => reject("Failed to update task.");
        };
        request.onerror = () => reject("Failed to find task.");
    });
};
```
```Js
export async function deleteTask(id) {
    const db = await openDatabase();
    const transaction = db.transaction("tasks", "readwrite");
    const store = transaction.objectStore("tasks");

    return new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve("Task deleted!");
        request.onerror = () => reject("Failed to delete task.");
    });
};
```
