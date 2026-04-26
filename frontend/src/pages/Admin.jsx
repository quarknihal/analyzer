import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Admin() {
  const [tasks, setTasks] = useState([]);
  const [submissions, setSubmissions] = useState([]);

  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");

  // Load data
  useEffect(() => {
    loadTasks();
    loadSubmissions();
  }, []);

  const loadTasks = () => {
    axios.get("http://localhost:8000/tasks")
      .then(res => setTasks(res.data));
  };

  const loadSubmissions = () => {
    axios.get("http://localhost:8000/submissions")
      .then(res => setSubmissions(res.data));
  };

  // Create task
  const createTask = async () => {
    await axios.post("http://localhost:8000/create-task", null, {
      params: { title, description: desc }
    });

    alert("Task created");
    loadTasks();
  };

  // Delete task
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:8000/delete-task/${id}`);
    loadTasks();
  };

  // Override AI
  const updateStatus = async (id, status) => {
    await axios.put(`http://localhost:8000/update-submission/${id}`, null, {
      params: { status }
    });

    loadSubmissions();
  };

return (
  <div className="min-h-screen bg-gray-100 p-6">

    <Navbar />
    <h1 className="text-3xl font-bold text-center mb-6">
      Admin Panel
    </h1>

    {/* CREATE TASK */}
    <div className="bg-white p-4 rounded-xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-3">Create Task</h2>

      <input
        className="border p-2 mr-2 rounded"
        placeholder="Title"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        className="border p-2 mr-2 rounded"
        placeholder="Description"
        onChange={(e) => setDesc(e.target.value)}
      />

      <button
        onClick={createTask}
        className="bg-green-500 text-white px-4 py-2 rounded hover:scale-105 transition"
      >
        Create
      </button>
    </div>

    {/* TASKS */}
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-2">Tasks</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {tasks.map(t => (
          <div key={t.id} className="bg-white p-4 rounded-xl shadow">
            <p className="font-bold">{t.title}</p>
            <p className="text-gray-600">{t.description}</p>

            <button
              onClick={() => deleteTask(t.id)}
              className="bg-red-500 text-white px-3 py-1 rounded mt-2 hover:scale-105 transition"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>

    {/* SUBMISSIONS */}
    <div>
      <h2 className="text-xl font-semibold mb-2">Submissions</h2>

      <div className="grid md:grid-cols-2 gap-4">
        {submissions.map(s => (
          <div key={s.id} className="bg-white p-4 rounded-xl shadow">

            <p className="font-semibold">{s.user_email}</p>
            <p>Task ID: {s.task_id}</p>
            <p>Status: {s.status}</p>

            {/* IMAGE */}
            <img
              src={`http://localhost:8000/${s.image_path}`}
              alt="submission"
              className="w-full h-40 object-cover rounded mt-2"
            />

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => updateStatus(s.id, "YES")}
                className="bg-green-500 text-white px-3 py-1 rounded hover:scale-105 transition"
              >
                YES
              </button>

              <button
                onClick={() => updateStatus(s.id, "NO")}
                className="bg-red-500 text-white px-3 py-1 rounded hover:scale-105 transition"
              >
                NO
              </button>
            </div>

          </div>
        ))}
      </div>
    </div>

  </div>
);
}

export default Admin;