import type { Metadata } from 'next';
import './globals.css';
import { Lexend } from 'next/font/google';
import Navbar from '@/components/Navbar';

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
			<body className={`flex flex-col gap-8 ${lexend.className} antialiased font-medium`}>
				<Navbar />
				{children}
			</body>
		</html>
	);
}
