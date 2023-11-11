'use client';

import { redirect } from 'next/navigation';
import { useAppSelector } from '../../redux/hooks';

interface Props {
	children: React.ReactNode;
}
export default function RequireAuth({ children }: Props) {
	const { isLoading, isAuthenticated } = useAppSelector(state => state.auth);



	if (!isAuthenticated) {
		redirect('/login');
	}

	return <>{children}</>;
}