const board = document.getElementById("board");

/* DATA */
let data = JSON.parse(localStorage.getItem("tasks")) || [
  { id: "todo", title: "To Do", tasks: [] },
  { id: "progress", title: "In Progress", tasks: [] },
  { id: "done", title: "Done", tasks: [] }
];

/* SAVE */
function save() {
  localStorage.setItem("tasks", JSON.stringify(data));
}

/* ADD TASK */
function addTask(colId) {
  const text = prompt("Enter task");
  if (!text || text.trim() === "") return;

  const col = data.find(c => c.id === colId);
  col.tasks.push({
    id: Date.now(),
    text
  });

  save();
  render();
}

/* EDIT TASK */
function editTask(colId, taskId) {
  const col = data.find(c => c.id === colId);
  const task = col.tasks.find(t => t.id === taskId);

  const newText = prompt("Edit Task", task.text);

  if (newText && newText.trim() !== "") {
    task.text = newText;
    save();
    render();
  }
}

/* DELETE TASK */
function deleteTask(colId, taskId) {
  const col = data.find(c => c.id === colId);
  col.tasks = col.tasks.filter(t => t.id !== taskId);

  save();
  render();
}

/* RENDER TASK (ONLY ONE VERSION) */
function renderTask(task, colId) {
  return `
    <div class="task" data-id="${task.id}">
      <span>${task.text}</span>

      <div style="display:flex; gap:5px;">
        <button class="btn btn-edit"
          onclick="editTask('${colId}', ${task.id})">✏️</button>

        <button class="btn btn-delete"
          onclick="deleteTask('${colId}', ${task.id})">✖</button>
      </div>
    </div>
  `;
}

/* RENDER COLUMN */
function renderColumn(col) {
  return `
    <div class="column">
      <h3>${col.title}</h3>

      <div class="task-list" data-id="${col.id}">
        ${col.tasks.map(t => renderTask(t, col.id)).join("")}
      </div>

      <button class="btn btn-add" onclick="addTask('${col.id}')">
        + Add Task
      </button>
    </div>
  `;
}

/* RENDER BOARD */
function render() {
  board.innerHTML = data.map(renderColumn).join("");
  dragInit();
}

/* DRAG DROP */
function dragInit() {
  document.querySelectorAll(".task-list").forEach(el => {
    new Sortable(el, {
      group: "board",
      animation: 200,
      ghostClass: "task-ghost",
      chosenClass: "task-chosen",

      onEnd: function (evt) {
        const from = evt.from.dataset.id;
        const to = evt.to.dataset.id;
        const id = Number(evt.item.dataset.id);

        const fromCol = data.find(c => c.id === from);
        const toCol = data.find(c => c.id === to);

        const task = fromCol.tasks.find(t => t.id === id);

        fromCol.tasks = fromCol.tasks.filter(t => t.id !== id);
        toCol.tasks.push(task);

        save();
        render();
      }
    });
  });
}

/* INIT */
render();