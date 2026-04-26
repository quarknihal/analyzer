import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Dashboard() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    axios.get("https://analyzer-vndt.onrender.com/tasks")
      .then(res => setTasks(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="p-6">

        <h1 className="text-3xl font-bold mb-6 text-center">
          Dashboard
        </h1>

        <div className="grid md:grid-cols-2 gap-4">
          {tasks.map(task => (
            <div key={task.id} className="bg-white p-4 rounded-xl shadow-lg">
              <h2 className="text-xl font-semibold">{task.title}</h2>
              <p className="text-gray-600">{task.description}</p>

              <a
                href="/upload"
                className="text-blue-500 mt-2 inline-block hover:underline"
              >
                Upload Proof →
              </a>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
}

export default Dashboard;