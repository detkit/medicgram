import Bottombar from '@/components/shared/bottom-bar';
import Sidebar from '@/components/shared/sidebar';
import Topbar from '@/components/shared/top-bar';
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
	return (
		<div className='w-full md:flex'>
			<Topbar />
			<Sidebar />

			<section className='flex flex-1 h-full'>
				<Outlet />
			</section>

			<Bottombar />
		</div>
	);
}
