import {addTask,getTasks} from "./database.js";
import {createTask} from './tasks.js';
document.addEventListener("DOMContentLoaded", function () {
    const taskContainer = document.querySelector(".task-list-container");

    function loadTasks(){
        taskContainer.innerHTML=``
        getTasks().then((data)=>{
            console.log(data);
            if(data?.length > 0){
                taskContainer.classList.remove("center-div");
                for (let i = 0; i < data?.length; i++) {           
                    const task = createTask(data[i]);
                    taskContainer.appendChild(task);
                }
            }else{
                const noResultFoundUi = document.createElement("div");
                noResultFoundUi.innerHTML=`
                    <i class="fa-regular fa-folder-open text-xl"></i>
                    <span class="my-lg text-lg">No tasks found</span>
                `
                noResultFoundUi.classList.add("col");
                noResultFoundUi.classList.add("justify-center");
                noResultFoundUi.classList.add("align-items");
                noResultFoundUi.classList.add("text-primary");
                taskContainer.classList.add("center-div");
                taskContainer.appendChild(noResultFoundUi);
            }
        }).catch(console.error);
    }
    loadTasks();
    // Flips Card
    const asideContainer = document.querySelector(".aside-container");
    const createTaskBtn = document.getElementById("createTask");

    createTaskBtn.addEventListener("click", function () {
        asideContainer.classList.toggle("flipped");
    });
    const closeTaskFormBtn = document.getElementById("closeTaskForm");

    closeTaskFormBtn.addEventListener("click", function () {
        asideContainer.classList.toggle("flipped");
    });

    // create task Form
    document.getElementById("createTaskForm").addEventListener("submit",async (event)=>{
        event.preventDefault();
        // validate payload
        try {
            const name = document.getElementById("taskName").value;
            const description = document.getElementById("taskDescription").value;
            const priority = document.getElementById("taskPriority").value;
            const date = document.getElementById("taskDate").value;
            if(!name || !description || !priority || !date){
                alert("ensure all inputs are field");
                return
            }
            const data = {name, description, priority,date,status:false};
            await addTask(data)
                .then(()=>{
                    document.getElementById("createTaskForm").reset()
                    console.log
                    loadTasks()
                })
                .catch(console.error);
            // store in local storage or indexDb
        } catch (error) {
            console.log(error);
        }
    })
});