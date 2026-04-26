import { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Upload() {
  const [file, setFile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [taskId, setTaskId] = useState("");

  const email = localStorage.getItem("user");

  useEffect(() => {
    axios.get("http://localhost:8000/tasks")
      .then(res => setTasks(res.data));
  }, []);

  const handleUpload = async () => {
    if (!file || !taskId) return alert("Select task and file");

    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await axios.post(
        "http://localhost:8000/upload",
        formData,
        {
          params: {
            email: email,
            task_id: Number(taskId)
          }
        }
      );

      alert("AI Result: " + res.data.result);
    } catch {
      alert("Upload failed");
    }
  };

  return (
  <div className="min-h-screen bg-gray-100">

    <Navbar />

    <div className="flex items-center justify-center p-6">

      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Upload Proof
        </h2>

        {/* Dropdown */}
        <select
          className="w-full p-2 border rounded mb-3"
          onChange={(e) => setTaskId(e.target.value)}
        >
          <option value="">Select Task</option>
          {tasks.map(t => (
            <option key={t.id} value={t.id}>
              {t.title}
            </option>
          ))}
        </select>

        {/* File input */}
        <input
          type="file"
          className="w-full mb-3"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          onClick={handleUpload}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Upload
        </button>
      </div>

    </div>

  </div>
);
}

export default Upload;