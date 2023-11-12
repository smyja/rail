'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useActivationMutation } from '../../../../redux/features/authApiSlice';
import { notifications } from '@mantine/notifications';
import classes from "../../../../hooks/Error.module.css"

interface Props {
	params: {
		uid: string;
		token: string;
	};
}

export default function Page({ params }: Props) {
	const router = useRouter();
	const [activation] = useActivationMutation();

	useEffect(() => {
		const { uid, token } = params;

		activation({ uid, token })
			.unwrap()
			.then(() => {
				notifications.show({
					title: "Successful",
					message: 'Logging in to your account',
					color: 'teal',
					radius:"md",
					loading: true,
				  });
			})
			.catch(() => {
				notifications.show({
					title: "Error",
					message: 'Failed to activate account',
					color: 'red',
					radius:"md",
					classNames:classes
			   
				  });
			})
			.finally(() => {
				router.push('/login');
			});
	}, []);

	return (
		<div className='flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8'>
			<div className='sm:mx-auto sm:w-full sm:max-w-sm'>
				<h1 className='mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900'>
					Activating your account...
				</h1>
			</div>
		</div>
	);
}
