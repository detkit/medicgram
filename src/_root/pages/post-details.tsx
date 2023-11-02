import GridPostList from '@/components/shared/GridPostList';
import Loader from '@/components/shared/Loader';
import PostStats from '@/components/shared/post-stats';
import { Button } from '@/components/ui/button';
import { useUserContext } from '@/context/AuthContext';
import {
	useDeletePost,
	useGetPostById,
	useGetUserPosts,
} from '@/lib/react-query/queries';
import { multiFormatDateString } from '@/lib/utils';
import { Link, useNavigate, useParams } from 'react-router-dom';

const PostDetails = () => {
	const { user } = useUserContext();
	const navigate = useNavigate();
	const { id } = useParams();
	const { data: post, isPending } = useGetPostById(id);
	const { data: userPosts, isPending: isUserPostLoading } = useGetUserPosts();

	const { mutate: deletePost } = useDeletePost();

	const relatedPosts = userPosts?.documents.filter(
		(userPost) => userPost.$id !== id
	);

	const handleDeletePost = () => {
		deletePost({ postId: id, imageId: post?.imageId });
		navigate(-1);
	};

	return (
		<div className='post_details-container'>
			{isPending || !post ? (
				<Loader />
			) : (
				<div className='post_details-card'>
					<img
						src={post?.imageUrl}
						alt='post'
						className='post_details-img'
					/>

					<div className='post_details-info'>
						<div className='flex-between w-full'>
							<Link
								to={`/profile/${post?.creator.$id}`}
								className='flex items-center gap-3'
							>
								<img
									src={
										post?.creator?.imageUrl ||
										'/assets/icons/profile-placeholder.svg'
									}
									alt='creator'
									className='w-8 rounded-full h-8 lg:w-12 lg:h-12'
								/>
								<div className='flex flex-col'>
									<p className='base-medium lg:body-bold text-light-1'>
										{post?.creator.name}
									</p>
									<div className='gap-2 flex-center text-light-3'>
										<p className='subtle-semibold lg:small-regular '>
											{multiFormatDateString(
												post?.$createdAt
											)}
										</p>
										•
										<p className='subtle-semibold lg:small-regular'>
											{post?.location}
										</p>
									</div>
								</div>
							</Link>

							<div className='flex-center gap-4'>
								<Link
									to={`/update-post/${post?.$id}`}
									className={`${
										user.id !== post?.creator.$id &&
										'hidden'
									}`}
								>
									<img
										src='/assets/icons/edit.svg'
										alt='edit post'
										width={24}
										height={24}
									/>
								</Link>

								<Button
									onClick={handleDeletePost}
									variant='ghost'
									className={`ost_details-delete_btn ${
										user.id !== post?.creator.$id &&
										'hidden'
									}`}
								>
									<img
										src={'/assets/icons/delete.svg'}
										alt='delete'
										width={24}
										height={24}
									/>
								</Button>
							</div>
						</div>

						<hr className='border w-full border-dark-4/80' />

						<div className='flex flex-col flex-1 w-full small-medium lg:base-regular'>
							<p>{post?.caption}</p>
							<ul className='flex gap-1 mt-2'>
								{post?.tags.map(
									(tag: string, index: string) => (
										<li
											key={`${tag}${index}`}
											className='text-light-3 small-regular'
										>
											#{tag}
										</li>
									)
								)}
							</ul>
						</div>

						<div className='w-full'>
							<PostStats post={post} userId={user.id} />
						</div>
					</div>
				</div>
			)}

			<div className='w-full max-w-5xl'>
				<hr className='border w-full border-dark-4/80' />

				<h3 className='body-bold md:h3-bold w-full my-10'>
					More Related Posts
				</h3>
				{isUserPostLoading || !relatedPosts ? (
					<Loader />
				) : (
					<GridPostList posts={relatedPosts} />
				)}
			</div>
		</div>
	);
};

export default PostDetails;