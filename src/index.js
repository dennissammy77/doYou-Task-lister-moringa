document.addEventListener("DOMContentLoaded", function () {
    const taskContainer = document.querySelector(".task-list-container");
    let taskCount = 0; // Keep track of the number of tasks loaded
    const totalTasks = 50; // Example: limit total tasks
    const tasksPerLoad = 10; // Number of tasks to load each time

    const priorities = ["overdue", "high", "medium", "low"];
    function getRandomPriority() {
        return priorities[Math.floor(Math.random() * priorities.length)];
    }

    // Function to create task elements
    function createTask(taskNumber,priority) {
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
        taskCheckBox.setAttribute("id",`taskCheckbox-${taskNumber}`);
        
        const checkmark = document.createElement("span");
        checkmark.classList.add("checkmark");

        label.appendChild(taskCheckBox);
        label.appendChild(checkmark);
        // left section
        const leftDiv = document.createElement("div");
        leftDiv.classList.add("col");
        // title 
        const taskTitle = document.createElement("p");
        taskTitle.textContent = `Task ${taskNumber}`;
        // timeline
        const taskTimeline = document.createElement("span");
        taskTimeline.textContent = `Today`;
        taskTimeline.classList.add("text-sm");

        leftDiv.appendChild(taskTitle)
        leftDiv.appendChild(taskTimeline)

        // priority tags
        const priorityBadge = document.createElement("p");
        priorityBadge.classList.add("task-card-badge");
        priorityBadge.classList.add("text-sm");
        priorityBadge.classList.add(`task-card-${priority}`);
        priorityBadge.textContent=priority
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
        taskDiv.classList.add("row");
        // Handle checkbox change event
        taskCheckBox.addEventListener("change", function () {
            completedTextBadge.classList.toggle('hidden');
            if (this.checked) {
                taskTitle.style.textDecoration = "line-through";
                taskTimeline.style.textDecoration = "line-through";
                taskTitle.style.opacity = "0.5";
                taskTimeline.style.opacity = "0.5";
                taskDiv.classList.add("task-card-completed");
            } else {
                taskTitle.style.textDecoration = "none";
                taskTimeline.style.textDecoration = "none";
                taskTitle.style.opacity = "1";
                taskTimeline.style.opacity = "1";
                taskDiv.classList.remove("task-card-completed");
            }
        });
        // return

        return taskDiv;
    }

    // Function to load more tasks
    function loadMoreTasks() {
        if (taskCount >= totalTasks) return; // Stop if all tasks are loaded

        for (let i = 0; i < tasksPerLoad; i++) {
            if (taskCount >= totalTasks) break; // Prevent adding extra tasks
            const priority = getRandomPriority();
            const task = createTask(++taskCount,priority);
            taskContainer.appendChild(task);
        }
    }

    // Initial Load
    loadMoreTasks();

    // Infinite Scroll Detection
    window.addEventListener("scroll", function () {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 10) {
            loadMoreTasks();
        }
    });
});