import { useEffect, useState } from 'react';

export default function TodoApp() {
  const [todos, setTodos] = useState([]);
  const [task, setTask] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('Medium');

const [editingId, setEditingId] = useState(null);
const [editTask, setEditTask] = useState('');
const [editDesc, setEditDesc] = useState('');

const startEdit = (todo) => {
  setEditingId(todo.id);
  setEditTask(todo.name);
  setEditDesc(todo.desc);
};

const cancelEdit = () => {
  setEditingId(null);
  setEditTask('');
  setEditDesc('');
};


const saveEdit = async (id) => {
  const updated = {
    name: editTask,
    desc: editDesc,
    completed: false
  };
  console.log(id);
  
console.log(JSON.stringify(updated));

  await fetch(`http://localhost:8000/updatetodo/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updated),
  });

  setEditingId(null);
  setEditTask('');
  setEditDesc('');
  fetchTodos();
};


  const fetchTodos = async () => {
    const res = await fetch('http://localhost:8000/todos');
    const data = await res.json();
    setTodos(data);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const addTodo = async () => {
    if (task.trim() === '') return;

    const newTodo = {
      name: task,
      description: desc,
      priority,
      completed: false, 
    };

    const res = await fetch('http://localhost:8000/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTodo),
    });

    const savedTodo = await res.json();
    setTodos([...todos, savedTodo]);

    setTask('');
    setDesc('');
    setPriority('Medium');
  };

  const toggleTodo = async (todoId) => {
    let todo;
    for(let i=0;i<todos.length;i++)
      if(todos[i].id == todoId)
         todo = todos[i]


    
    await fetch(`http://localhost:8000/updatetodo/${todoId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ completed: !todo.completed }),
    });

    fetchTodos(); // refresh list from backend
  };

  const deleteTodo = async (id) => {
    await fetch(`http://localhost:8000/deltodo/${id}`, {
      method: 'DELETE',
    });
    fetchTodos();
  };

  const sortByPriority = async () => {
    const res = await fetch('http://localhost:8000/todos?sort=priority');
    const sortedTodos = await res.json();
    setTodos(sortedTodos);
  };



  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-5xl bg-gray-800 p-6 rounded-2xl shadow-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center">React Todo App</h1>

        {/* Input Section */}
        <div className="flex flex-wrap gap-3 mb-6 items-center">
          <input
            className="flex-1 min-w-[150px] p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
            type="text"
            placeholder="Task name"
            value={task || ''}
            onChange={(e) => setTask(e.target.value)}
          />
          <input
            className="flex-1 min-w-[200px] p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
            type="text"
            placeholder="Description"
            value={desc || ''}
            onChange={(e) => setDesc(e.target.value)}
          />
          <select
            className="p-2 rounded bg-gray-700 text-white border border-gray-600 focus:outline-none"
            value={priority || 'Medium'}
            onChange={(e) => setPriority(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            onClick={addTodo}
          >
            Add Task
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded"
            onClick={sortByPriority}
          >
            Sort by Priority
          </button>
        </div>

        {/* Todo List */}
<ul className="space-y-4">
  {todos.map((todo) => (
    <li key={todo.id} className="bg-gray-700 p-4 rounded-lg space-y-1">
      {editingId === todo.id ? (
        // 📝 Edit mode
        <div className="space-y-2">
          <input
            type="text"
            value={editTask}
            onChange={(e) => setEditTask(e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white"
          />
          <input
            type="text"
            value={editDesc}
            onChange={(e) => setEditDesc(e.target.value)}
            className="w-full p-2 rounded bg-gray-600 text-white"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => saveEdit(todo.id)}
              className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
            >
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // ✅ Normal view mode
        <>
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="accent-blue-500 w-4 h-4"
              />
              <span className={todo.completed ? 'line-through opacity-50' : ''}>
                <strong>{todo.name}</strong>
              </span>
            </label>
            <div className="flex items-center gap-2">
              <span
                className={`text-xs px-2 py-1 rounded ${
                  todo.priority === 'High'
                    ? 'bg-red-500'
                    : todo.priority === 'Medium'
                    ? 'bg-yellow-500'
                    : 'bg-green-500'
                }`}
              >
                {todo.priority}
              </span>
              <button
                onClick={() => startEdit(todo)}
                className="bg-blue-600 hover:bg-blue-700 text-sm px-2 py-1 rounded"
              >
                Edit
              </button>
              <button
                onClick={() => deleteTodo(todo.id)}
                className="bg-red-600 hover:bg-red-700 text-sm px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </div>
          {todo.description && (
            <p className="text-sm text-gray-300">{todo.description}</p>
          )}
        </>
      )}
    </li>
  ))}
</ul>

      </div>
    </div>
  );
}
