import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";

function Leaderboard() {
  const [data, setData] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:8000/leaderboard")
      .then(res => setData(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">

      <Navbar />

      <div className="p-6">

        <h1 className="text-3xl font-bold text-center mb-6">
          Leaderboard
        </h1>

        <div className="bg-white rounded-xl shadow p-4 max-w-md mx-auto">

          {data.map((user, index) => (
            <div
              key={index}
              className="flex justify-between p-2 border-b"
            >
              <span>{index + 1}. {user[0]}</span>
              <span className="font-bold">{user[1]}</span>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default Leaderboard;