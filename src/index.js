import {addTask} from "./database.js";
import {loadTasks} from './tasks.js';
document.addEventListener("DOMContentLoaded", function () {
    let searchQuery = '';
    let filterQuery = 'all';
    // listen for query changes
    document.getElementById("taskSearchQuery").addEventListener("input",(event)=>{
        searchQuery = event.target.value;
        console.log(searchQuery)
        loadTasks(searchQuery,)
    });
    document.querySelectorAll(".taskFilterQuery").forEach((item)=>{
       item.addEventListener("click",()=>{
            console.log('clicked',item.dataset.status)
            switch(item.dataset.status){
                case 'all':
                    filterQuery = 'all'
                    break
                case 'pending':
                    filterQuery = false
                    break
                case 'completed':
                    filterQuery = true
                    break
                default:
                    filterQuery = 'all'
                    break
            }
            console.log(searchQuery,filterQuery)
            loadTasks('',filterQuery)
       });
    });
    //

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
    // assign the date picker
    const today = new Date().toISOString().split("T")[0];
    document.getElementById("taskDate").setAttribute("min", today);

    const oneWeekLater = new Date();
    oneWeekLater.setDate(new Date().getDate() + 7); // Add 7 days
    const maxDate = oneWeekLater.toISOString().split("T")[0];

    document.getElementById("taskDate").setAttribute("max", maxDate);

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
            // store in local storage or indexD
        } catch (error) {
            console.log(error);
        }
    })
});