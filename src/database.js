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
            const store = transaction.objectStore("tasks");
            const nameIndex = store.index("taskName")
            const statusIndex = store.index("taskStatus")
            const dateIndex = store.index("taskDate")
            resolve(event.target.result);
        };
    })
}
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

export async function getTasks(search="",filter="",date="today") {
    const db = await openDatabase();
    const transaction = db.transaction("tasks", "readonly");
    const store = transaction.objectStore("tasks");

    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject("Failed to fetch tasks.");
    });
}

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
