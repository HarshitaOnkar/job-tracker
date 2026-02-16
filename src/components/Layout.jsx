import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';

export default function Layout() {
  return (
    <div className="kn-app">
      <Navbar />
      <main className="kn-page">
        <Outlet />
      </main>
    </div>
  );
}
