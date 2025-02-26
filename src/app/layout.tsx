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
			<body className={`flex flex-col ${lexend.className} antialiased font-medium`}>
				<main className='flex flex-col'>
					<Navbar />
					{children}
				</main>
				<Toaster />
			</body>
		</html>
	);
}
