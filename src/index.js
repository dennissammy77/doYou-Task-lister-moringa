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
    const parentBody = document.querySelector(".parentBody");
    const asideContainer = document.querySelector(".aside-container");
    const createTaskBtn = document.getElementById("createTask");

    const asideContainers = document.querySelectorAll(".side-info-container");
    const mainSectionBody = document.querySelector(".main-sectionBody");
    
    if(window.innerWidth < 992){
        // move container to body
        asideContainer.classList.remove('flipping-container');
        parentBody.classList.add('flipping-container');

        asideContainers[0].classList.remove('front-view')
        asideContainers[0].classList.remove('flipping-container-card')
        asideContainers[1].classList.remove('back-view')
        asideContainers[1].classList.remove('flipping-container-card')

        mainSectionBody.classList.add('front-view')
        mainSectionBody.classList.add('flipping-container-card')
        
        asideContainer.classList.add('back-view')
        asideContainer.classList.add('flipping-container-card')
    }

    createTaskBtn.addEventListener("click", function () {
        parentBody.classList.toggle("flipped");
    });
    const closeTaskFormBtn = document.getElementById("closeTaskForm");

    closeTaskFormBtn.addEventListener("click", function () {
        parentBody.classList.toggle("flipped");
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
                    gtag('event', 'task_created', {
                        'event_category': 'Tasks',
                        'event_label': 'New Task Added',
                        'value': 1
                    });
                })
                .catch(console.error);
            // store in local storage or indexD
        } catch (error) {
            console.log(error);
        }
    })
});