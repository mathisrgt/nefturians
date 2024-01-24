'use client';

import React from 'react';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';
import { redirect } from 'next/navigation';

function isConnected(address: string) {
	localStorage.setItem("userAddress", address);
	redirect('/dashboard');
}

export default function Home() {
	const { address, isDisconnected } = useAccount();

	useEffect(() => {
		if (!isDisconnected && address) {
			isConnected(address);
		}
	}, [isDisconnected, address]);

	return (
		<main className="flex min-h-screen flex-col items-center justify-between p-24">
			<h1 className="text-lg font-bold text-primary">Meet your Nefturian</h1>
			<w3m-connect-button />
		</main>
	)
}
