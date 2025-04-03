'use client';

import { useEffect, useState, ReactNode } from 'react';
import NotFound from '@/app/not-found';

interface AuthMobileGuardProps {
	children: ReactNode;
}

export default function AuthMobileGuard({ children }: AuthMobileGuardProps) {
	const [isMobile, setIsMobile] = useState(false);
	const [isClient, setIsClient] = useState(false);

	useEffect(() => {
		setIsClient(true);
		setIsMobile(window.innerWidth < 768);

		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};

		window.addEventListener('resize', handleResize);

		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	if (!isClient) return null;

	return isMobile ? <NotFound /> : children;
}
