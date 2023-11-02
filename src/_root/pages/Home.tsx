import Loader from '@/components/shared/Loader';
import PostCard from '@/components/shared/post-card';
import { useGetRecentPosts } from '@/lib/react-query/queries';
import { Models } from 'appwrite';

const Home = () => {
	const {
		data: posts,
		isPending: isPostLoading,
		isError: isErrorPosts,
	} = useGetRecentPosts();

	return (
		<div className='flex flex-1'>
			<div className='home-container'>
				<div className='home-posts'>
					<h2 className='w-full text-left h3-bold md:h2-bold'>
						Home Feed
					</h2>
					{isPostLoading && !posts ? (
						<Loader />
					) : (
						<ul className='flex flex-col flex-1 w-full gap-9'>
							{posts?.documents.map((post: Models.Document) => (
								<li
									key={post.$id}
									className='flex justify-center w-full'
								>
									<PostCard post={post} />
								</li>
							))}
						</ul>
					)}
				</div>
			</div>
		</div>
	);
};

export default Home;
