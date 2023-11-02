import { convertFileToUrl } from '@/lib/utils';
import { useCallback, useState } from 'react';
import { FileWithPath, useDropzone } from 'react-dropzone';

type ProfileUploaderProps = {
	fieldChange: (files: File[]) => void;
	mediaUrl: string;
};

export default function ProfileUploader({
	fieldChange,
	mediaUrl,
}: ProfileUploaderProps) {
	const [file, setFile] = useState<File[]>([]);
	const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

	const onDrop = useCallback(
		(acceptedFiles: FileWithPath[]) => {
			setFile(acceptedFiles);
			fieldChange(acceptedFiles);
			setFileUrl(convertFileToUrl(acceptedFiles[0]));
		},
		[file]
	);

	const { getRootProps, getInputProps } = useDropzone({
		onDrop,
		accept: {
			'image/*': ['.png', '.jpeg', '.jpg', '.svg'],
		},
	});

	return (
		<div {...getRootProps()}>
			<div className='gap-4 cuursor-pointer flex-center'>
				<input {...getInputProps()} className='cursor-pointer' />
				<img
					src={fileUrl || '/assets/icons/profile-placeholder.svg'}
					alt='cover image'
					className='object-cover object-top w-24 h-24 rounded-full'
				/>
				<p className='text-primary-500 small-regular md:base-semibold'>
					Change Profile Photo
				</p>
			</div>
		</div>
	);
}
