import { Toaster } from '@/components/ui/toaster';
import { Route, Routes } from 'react-router-dom';
import AuthLayout from './_auth/AuthLayout';
import LoginForm from './_auth/forms/LoginForm';
import SignupForm from './_auth/forms/SignupForm';
import RootLayout from './_root/RootLayout';
import {
	AllUsers,
	CreatePost,
	EditPost,
	Explore,
	Home,
	PostDetails,
	Profile,
	Saved,
	UpdateProfile,
} from './_root/pages';
import './globals.css';

export default function App() {
	return (
		<main className='flex h-screen'>
			<Routes>
				{/* public routes */}
				<Route element={<AuthLayout />}>
					<Route path='/login' element={<LoginForm />} />
					<Route path='/sign-up' element={<SignupForm />} />
				</Route>

				{/* private routes */}
				<Route element={<RootLayout />}>
					<Route index element={<Home />} />
					<Route path='/explore' element={<Explore />} />
					<Route path='/saved' element={<Saved />} />
					<Route path='/all-users' element={<AllUsers />} />
					<Route path='/create-post' element={<CreatePost />} />
					<Route path='/update-post/:id' element={<EditPost />} />
					<Route path='/post/:id' element={<PostDetails />} />
					<Route path='/profile/:id/*' element={<Profile />} />
					<Route
						path='/update-profile/:id'
						element={<UpdateProfile />}
					/>
				</Route>
			</Routes>

			<Toaster />
		</main>
	);
}