import { updateTask,deleteTask,getTasks } from "./database.js";
// Function to create task elements
export function createTask(task) {
    const taskDiv = document.createElement("div");
    // right div
    const rightDiv = document.createElement("div");
    rightDiv.classList.add("row")
    // checkbox
    const label = document.createElement("label");
    label.classList.add("custom-checkbox");
    
    const taskCheckBox = document.createElement("input");
    taskCheckBox.type="checkbox";
    taskCheckBox.classList.add("taskCheckbox");
    taskCheckBox.setAttribute("id",`taskCheckbox-${task?.id}`);
    
    const checkmark = document.createElement("span");
    checkmark.classList.add("checkmark");

    label.appendChild(taskCheckBox);
    label.appendChild(checkmark);
    // left section
    const leftDiv = document.createElement("div");
    leftDiv.classList.add("col");
    // title 
    const taskTitle = document.createElement("p");
    taskTitle.textContent = task?.name;
    // timeline
    const taskTimeline = document.createElement("span");
    taskTimeline.textContent = task?.date;
    taskTimeline.classList.add("text-sm");

    leftDiv.appendChild(taskTitle)
    leftDiv.appendChild(taskTimeline)

    // priority tags
    const priorityBadge = document.createElement("p");
    priorityBadge.classList.add("task-card-badge");
    priorityBadge.classList.add("text-sm");
    priorityBadge.classList.add(`task-card-${task?.priority}`);
    priorityBadge.textContent=task?.priority
    // completed badge
    const completedTextBadge = document.createElement("p");
    completedTextBadge.classList.add("completedTextBadge");
    completedTextBadge.classList.add("task-card-badge");
    completedTextBadge.classList.add("text-sm");
    completedTextBadge.classList.add("hidden");
    completedTextBadge.textContent='completed'
    // delete icon
    const deleteSpan = document.createElement('span');
    deleteSpan.innerHTML='<i class="fa-solid fa-trash"></i>'
    // appends
    rightDiv.appendChild(priorityBadge);
    rightDiv.appendChild(completedTextBadge);
    rightDiv.appendChild(label);
    rightDiv.appendChild(deleteSpan);

    taskDiv.appendChild(leftDiv)
    taskDiv.appendChild(rightDiv);
    // parent Css
    taskDiv.classList.add("task-card");
    statusTaskUiChange(task?.status);
    taskDiv.classList.add("row");
    function statusTaskUiChange(status){
        if (status) {
            taskTitle.style.textDecoration = "line-through";
            taskTimeline.style.textDecoration = "line-through";
            taskTitle.style.opacity = "0.5";
            taskTimeline.style.opacity = "0.5";
            taskDiv.classList.add("task-card-completed");
            completedTextBadge.classList.toggle('hidden');
            taskCheckBox.checked = status
        } else {
            taskTitle.style.textDecoration = "none";
            taskTimeline.style.textDecoration = "none";
            taskTitle.style.opacity = "1";
            taskTimeline.style.opacity = "1";
            taskDiv.classList.remove("task-card-completed");
        }
    }
    // Handle checkbox change event
    taskCheckBox.addEventListener("change", function () {
        completedTextBadge.classList.toggle('hidden');
        if (this.checked) {
            taskTitle.style.textDecoration = "line-through";
            taskTimeline.style.textDecoration = "line-through";
            taskTitle.style.opacity = "0.5";
            taskTimeline.style.opacity = "0.5";
            taskDiv.classList.add("task-card-completed");
            updateTask(task?.id, { status: true })
            .then(loadTasks())
            .catch(console.error);
        } else {
            taskTitle.style.textDecoration = "none";
            taskTimeline.style.textDecoration = "none";
            taskTitle.style.opacity = "1";
            taskTimeline.style.opacity = "1";
            taskDiv.classList.remove("task-card-completed");
            updateTask(task?.id, { status: false })
            .then(loadTasks('','all'))
            .catch(console.error);
        }
    });
    // Handle task delete event
    deleteSpan.addEventListener("click",async()=>{
        deleteTask(task?.id).then(console.log).catch(console.error);
        loadTasks()
    });

    return taskDiv;
};

export function loadTasks(searchQuery='',filterQuery='all'){
    const taskContainer = document.querySelector(".task-list-container");
    
    taskContainer.innerHTML=``
    getTasks().then((data)=>{
        let taskResults = data;
        if(searchQuery !== ''){
            taskResults = searchTasks(data,searchQuery)
        }
        if(filterQuery !== 'all'){
            taskResults = filterTasks(taskResults,filterQuery,"status")
        }
        if(taskResults?.length > 0){
            taskContainer.classList.remove("center-div");
            taskResults.map((task)=>{
                const taskElement = createTask(task);
                taskContainer.appendChild(taskElement);
            });
            document.getElementById("analyticsAllTasks").textContent=data?.length;
            document.getElementById("analyticsCompletedTasks").textContent=filterTasks(data,true,"status")?.length;
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
};

function searchTasks(data,query=""){
    console.log(data,query)
    return data.filter(task => 
        task?.name?.toLowerCase().includes(query?.toLowerCase())
    );
}
function filterTasks(data,filterQuery,filterKey){
    console.log(data,filterQuery,filterKey);
    if(filterQuery === 'all') return data
    return data.filter(task => 
        task[filterKey] === filterQuery
    );
}