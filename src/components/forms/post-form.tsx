'use client';

import { Button } from '@/components/ui/button';
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { useUserContext } from '@/context/AuthContext';
import { useCreatePost, useUpdatePost } from '@/lib/react-query/queries';
import { PostValidation } from '@/lib/validation';
import { zodResolver } from '@hookform/resolvers/zod';
import { Models } from 'appwrite';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import * as z from 'zod';
import FileUploader from '../shared/file-uploader';
import { Input } from '../ui/input';
import { useToast } from '../ui/use-toast';

type PostFormProps = {
	post?: Models.Document;
	action: 'Create' | 'Update';
};

export default function PostForm({ post, action }: PostFormProps) {
	const { user } = useUserContext();
	const { toast } = useToast();
	const navigate = useNavigate();

	// 1. Define your form.
	const form = useForm<z.infer<typeof PostValidation>>({
		resolver: zodResolver(PostValidation),
		defaultValues: {
			caption: post ? post?.caption : '',
			file: [],
			location: post ? post.location : '',
			tags: post ? post.tags.join(',') : '',
		},
	});

	// Query
	const { mutateAsync: createPost, isPending: isLoadingCreate } =
		useCreatePost();
	const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
		useUpdatePost();

	// 2. Define a submit handler.
	async function handlerSubmit(values: z.infer<typeof PostValidation>) {
		if (post && action === 'Update') {
			const updatedPost = await updatePost({
				...values,
				postId: post.$id,
				imageId: post.imageId,
				imageUrl: post.imageUrl,
			});

			if (!updatedPost) {
				toast({ title: 'Please try again!' });
			}

			return navigate(`/post/${post.$id}`);
		}

		const newPost = await createPost({
			...values,
			userId: user.id,
		});

		if (!newPost) {
			toast({
				title: 'Please try again!',
			});
		}
		navigate('/');
	}

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(handlerSubmit)}
				className='flex flex-col w-full max-w-5xl gap-9'
			>
				<FormField
					control={form.control}
					name='caption'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='shad-form_label'>
								Caption
							</FormLabel>
							<FormControl>
								<Textarea
									className='shad-textarea custom-scrollbar'
									{...field}
								/>
							</FormControl>
							<FormMessage className='shad-form_message' />
						</FormItem>
					)}
				/>
				<FormField
					control={form.control}
					name='file'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='shad-form_label'>
								Add Photos
							</FormLabel>
							<FormControl>
								<FileUploader
									fieldChange={field.onChange}
									mediaUrl={post?.imageUrl}
								/>
							</FormControl>
							<FormMessage className='shad-form_message' />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='location'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='shad-form_label'>
								Add Location
							</FormLabel>
							<FormControl>
								<Input
									type='text'
									className='shad-input'
									{...field}
								/>
							</FormControl>
							<FormMessage className='shad-form_message' />
						</FormItem>
					)}
				/>

				<FormField
					control={form.control}
					name='tags'
					render={({ field }) => (
						<FormItem>
							<FormLabel className='shad-form_label'>
								Add Tags (separated by comma " , ")
							</FormLabel>
							<FormControl>
								<Input
									placeholder='JS, React, NextJS'
									type='text'
									className='shad-input'
									{...field}
								/>
							</FormControl>
							<FormMessage className='shad-form_message' />
						</FormItem>
					)}
				/>
				<div className='flex items-center justify-end gap-4'>
					<Button type='button' className='shad-button_dark_4'>
						Cancel
					</Button>
					<Button
						type='submit'
						className='shad-button_primary whitespace-nowrap'
						disabled={isLoadingCreate || isLoadingUpdate}
					>
						{isLoadingCreate || (isLoadingUpdate && 'Loading...')}
						{action} Post
					</Button>
				</div>
			</form>
		</Form>
	);
}
