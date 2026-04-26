function Navbar() {
  return (
    <div className="bg-white shadow p-4 flex justify-between items-center">

      <h1 className="text-xl font-bold text-blue-600">
        TaskAI
      </h1>

      <div className="flex gap-4">
        <a href="/dashboard" className="hover:text-blue-500">Dashboard</a>
        <a href="/upload" className="hover:text-blue-500">Upload</a>
        <a href="/leaderboard" className="hover:text-blue-500">Leaderboard</a>
        <a href="/admin" className="hover:text-blue-500">Admin</a>
      </div>

    </div>
  );
}

export default Navbar;