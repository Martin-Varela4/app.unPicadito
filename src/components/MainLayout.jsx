import { Outlet } from 'react-router-dom';
import NavBar from './Navbar';

export default function MainLayout() {
    return (
        <div className="min-h-screen bg-slate-50 flex flex-col">
            <NavBar />
            <div id="app-content" className="pt-[70px] max-w-[1400px] w-full mx-auto flex-1">
                <Outlet />
            </div>
        </div>
    );
}