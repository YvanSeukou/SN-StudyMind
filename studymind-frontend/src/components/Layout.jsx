import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

export default function Layout() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Sidebar />
      <div className="lg:pl-60">
        <Navbar />
        <main className="mx-auto max-w-6xl p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
