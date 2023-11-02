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
import {
	useCreateUserAccount,
	useLoginAccount,
} from '@/lib/react-query/queries';
import { SignupValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { z } from 'zod';

const SignupForm = () => {
	const { toast } = useToast();
	const { checkAuthUser, isLoading: isUserLoading } = useUserContext();
	const navigate = useNavigate();
	const { mutateAsync: createUserAccount, isPending: isCreatingAccount } =
		useCreateUserAccount();
	const { mutateAsync: logInAccount, isPending: isLogingIn } =
		useLoginAccount();

	const form = useForm<z.infer<typeof SignupValidation>>({
		resolver: zodResolver(SignupValidation),
		defaultValues: {
			name: '',
			username: '',
			email: '',
			password: '',
		},
	});

	async function onSubmit(values: z.infer<typeof SignupValidation>) {
		const newUser = await createUserAccount(values);

		if (!newUser) {
			return toast({ title: 'Sign up failed. Please try again.' });
		}

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
						Sign up new account
					</h2>
					<p className='mt-2 text-light-3 small-medium md:base-regular'>
						To use Medigram photos and video your friends
					</p>
				</div>

				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className='flex flex-col w-full gap-5 mt-4'
				>
					<FormField
						control={form.control}
						name='name'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input
										type='text'
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
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input
										type='text'
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
						{isCreatingAccount ? (
							<div className='gap-2 flex-center'>
								<Loader /> Loading...
							</div>
						) : (
							'Sign Up'
						)}
					</Button>

					<p className='mt-2 text-center text-small-regular text-light-2'>
						Already have an account?
						<Link
							to='/login'
							className='ml-1 text-primary-500 text-small-semibold'
						>
							Log in
						</Link>
					</p>
				</form>
			</Form>
		</div>
	);
};

export default SignupForm;
