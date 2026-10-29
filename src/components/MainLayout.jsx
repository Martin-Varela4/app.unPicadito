import { Outlet } from 'react-router';
import NavBar from './Navbar';

export default function MainLayout() {
    return (
        <div className="min-h-screen flex flex-col bg-[var(--color-background-main)] text-slate-100">
            <NavBar />
            <div id="app-content" className="w-full flex-1 pb-24 pt-16 md:pb-0 md:pt-[70px]">
                <Outlet />
            </div>
        </div>
    );
}