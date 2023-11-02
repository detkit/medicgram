'use client';

import Loader from '@/components/shared/Loader';
import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { useUserContext } from '@/context/AuthContext';
import { useLoginAccount } from '@/lib/react-query/queries';
import { LoginValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const LoginForm = () => {
	const { toast } = useToast();
	const navigate = useNavigate();
	const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
	// Query
	const { mutateAsync: logInAccount, isLoading } = useLoginAccount();

	const form = useForm<z.infer<typeof LoginValidation>>({
		resolver: zodResolver(LoginValidation),
		defaultValues: {
			email: '',
			password: '',
		},
	});

	async function onSubmit(values: z.infer<typeof LoginValidation>) {
		const session = await logInAccount({
			email: values.email,
			password: values.password,
		});

		if (!session) {
			return toast({ title: 'Log In failed. Please try again.' });
		}

		const isLoggedIn = await checkAuthUser();

		if (isLoggedIn) {
			form.reset();

			navigate('/');
		} else {
			return toast({ title: 'Sign up faile. Please try again' });
		}
	}

	return (
		<div>
			<Form {...form}>
				<div className='flex-col sm:w-420 flex-center'>
					<img src='/assets/images/logo.svg' />

					<h2 className='pt-5 h3-bold md:h2-bold sm:pt-12'>
						Log in to your account
					</h2>
					<p className='mt-2 text-light-3 small-medium md:base-regular'>
						Welcome back! Please enter your details
					</p>
				</div>

				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='flex flex-col w-full gap-5 mt-4'
				>
					<FormField
						control={form.control}
						name='email'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Email</FormLabel>
								<FormControl>
									<Input
										type='email'
										className='shad-input'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						control={form.control}
						name='password'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Password</FormLabel>
								<FormControl>
									<Input
										type='password'
										className='shad-input'
										{...field}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type='submit' className='shad-button_primary'>
						{isLoading || isUserLoading ? (
							<div className='gap-2 flex-center'>
								<Loader /> Loading...
							</div>
						) : (
							'Log in'
						)}
					</Button>

					<p className='mt-2 text-center text-small-regular text-light-2'>
						Don't have an account?
						<Link
							to='/sign-up'
							className='ml-1 text-primary-500 text-small-semibold'
						>
							Sign up
						</Link>
					</p>
				</form>
			</Form>
		</div>
	);
};

export default LoginForm;
