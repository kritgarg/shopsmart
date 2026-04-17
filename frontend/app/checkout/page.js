"use client"

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@clerk/nextjs';
import axios from 'axios';

export default function CheckoutPage() {
    const { isLoaded, userId, getToken } = useAuth();
    const [processing, setProcessing] = useState(false);
    const [paid, setPaid] = useState(false);
    const [productId, setProductId] = useState(null);

    useEffect(() => {
        const storedId = localStorage.getItem('last_cart_id');
        if (storedId) setProductId(storedId);
    }, []);

    if (!isLoaded) return <div className="p-8 text-center">Loading...</div>;
    if (!userId) return <div className="p-8 text-center">Please log in to checkout.</div>;

    const handlePayment = async (e) => {
        e.preventDefault();
        setProcessing(true);
        
        try {
            const token = await getToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            
            if (!productId) {
                alert("No product selected in cart!");
                setProcessing(false);
                return;
            }

            // Perform the actual backend purchase
            await axios.post(`${apiUrl}/api/purchase`, { productId }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Mock payment delay for "Wow" factor
            setTimeout(() => {
                setProcessing(false);
                setPaid(true);
                localStorage.removeItem('last_cart_id'); // Clear after success
            }, 1500);
            
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || "Payment failed");
            setProcessing(false);
        }
    };

    if (paid) {
        return (
            <main className="max-w-2xl mx-auto w-full p-8 mt-20 text-center bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-2xl">
                <div className="mb-6 inline-flex items-center justify-center w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full">
                    <svg className="w-10 h-10 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                    </svg>
                </div>
                <h1 className="text-4xl font-extrabold mb-4 tracking-tight">Purchase Complete!</h1>
                <p className="text-zinc-500 mb-8">The product has been added to your dashboard.</p>
                <Link href="/dashboard" className="px-8 py-3 bg-indigo-600 text-white rounded-full font-bold hover:bg-indigo-700 transition shadow-lg">
                    Go to My Dashboard
                </Link>
            </main>
        );
    }

    return (
        <main className="max-w-4xl mx-auto w-full p-8 mt-12 grid grid-cols-1 md:grid-cols-2 gap-12">
            <div>
                <h1 className="text-4xl font-extrabold mb-8 tracking-tight">Checkout</h1>
                {!productId && (
                    <div className="p-4 mb-6 bg-amber-50 text-amber-700 border border-amber-200 rounded-xl text-sm">
                        ⚠️ Warning: You haven't selected a product from the home page yet.
                    </div>
                )}
                <form onSubmit={handlePayment} className="space-y-6">
                    <div className="grid grid-cols-1 gap-4">
                        <label className="block sm:col-span-2">
                            <span className="text-sm font-semibold uppercase tracking-wider text-zinc-500">Shipping Details</span>
                            <input required type="text" placeholder="Full Name" className="mt-1 block w-full p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900" />
                        </label>
                    </div>

                    <div className="pt-6">
                        <h2 className="text-xl font-bold mb-4">Mock Payment</h2>
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 rounded-xl flex items-center gap-4">
                            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white">💳</div>
                            <span className="font-medium">Direct Checkout (Mock)</span>
                        </div>
                    </div>

                    <button 
                        disabled={processing || !productId}
                        type="submit" 
                        className="w-full py-4 bg-black dark:bg-white text-white dark:text-black font-extrabold rounded-2xl hover:opacity-90 transition text-xl shadow-xl disabled:opacity-50"
                    >
                        {processing ? 'Processing...' : 'Pay ₹99.99 Now'}
                    </button>
                    <p className="text-center text-xs text-zinc-500 pt-4 font-medium uppercase tracking-widest">
                        Secure SSL Encryption • Mock Transaction
                    </p>
                </form>
            </div>

            <div className="bg-zinc-50 dark:bg-zinc-900 p-8 rounded-3xl h-fit border border-zinc-200 dark:border-zinc-800 sticky top-12">
                <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
                <div className="space-y-4 mb-8">
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Subtotal</span>
                        <span className="font-bold">₹99.99</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-zinc-500">Shipping</span>
                        <span className="font-bold text-green-600">FREE</span>
                    </div>
                </div>
                <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 flex justify-between items-center text-2xl font-black">
                    <span>Total</span>
                    <span>PAID</span>
                </div>
            </div>
        </main>
    );
}
