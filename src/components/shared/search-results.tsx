import GridPostList from './GridPostList';
import Loader from './Loader';

type SearchResultProps = {
	isSearchFetching: boolean;
	searchedPosts: any;
};

export default function SearchResults({
	isSearchFetching,
	searchedPosts,
}: SearchResultProps) {
	if (isSearchFetching) return <Loader />;

	if (searchedPosts && searchedPosts.documents.length > 0) {
		return <GridPostList posts={searchedPosts.documents} />;
	}

	return (
		<p className='text-light-4 mt-10 text-center w-full'>No result found</p>
	);
}
