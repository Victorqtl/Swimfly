import type { Metadata } from 'next';
import './globals.css';
import { Lexend } from 'next/font/google';
import Navbar from '../components/Navbar';
import { Toaster } from '../components/ui/sonner';

const lexend = Lexend({ subsets: ['latin'] });

export const metadata: Metadata = {
	title: 'Swimfly',
	description: 'Easily manage your daily tasks',
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
			<body className={`flex flex-col ${lexend.className} antialiased  text-sm font-medium`}>
				<header className='z-50'>
					<Navbar />
				</header>
				<main className='flex flex-col'>{children}</main>
				<Toaster />
			</body>
		</html>
	);
}
