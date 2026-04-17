"use client"

import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function CartPage() {
    const { isLoaded, userId } = useAuth();
    
    if (!isLoaded) return <div className="p-8">Loading...</div>;
    
    if (!userId) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[50vh] p-8 text-center">
                <h1 className="text-3xl font-bold mb-4">Your Cart</h1>
                <p className="text-zinc-500 mb-8">Please login to view your cart.</p>
                <Link href="/sign-in" className="px-6 py-3 bg-indigo-600 text-white rounded-full font-medium hover:bg-indigo-700 transition">
                    Login to Shop
                </Link>
            </div>
        );
    }

    return (
        <main className="max-w-3xl mx-auto w-full p-8 mt-12 bg-white dark:bg-black border border-zinc-200 dark:border-zinc-800 rounded-3xl min-h-[50vh] flex flex-col">
            <div className="flex justify-between items-end mb-8 border-b pb-4 border-zinc-200 dark:border-zinc-800">
                <h1 className="text-4xl font-extrabold tracking-tight">Shopping Cart</h1>
                <Link href="/" className="text-indigo-600 font-medium hover:underline">Continue Shopping</Link>
            </div>
            
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <div className="bg-zinc-50 dark:bg-zinc-900 w-full p-8 rounded-2xl border border-zinc-200 dark:border-zinc-800 mb-8">
                    <p className="text-lg text-zinc-600 dark:text-zinc-400">Mock cart is currently active.</p>
                    <p className="text-sm text-zinc-500 mt-2">1x Demo Product - ₹99.99</p>
                </div>
                
                <div className="w-full flex justify-between items-center bg-zinc-100 dark:bg-zinc-900 p-6 rounded-2xl">
                    <span className="text-xl font-bold">Total: ₹99.99</span>
                    <Link href="/checkout" className="px-8 py-4 bg-black dark:bg-white text-white dark:text-black font-bold rounded-xl hover:opacity-80 transition text-lg shadow-lg">
                        Proceed to Checkout
                    </Link>
                </div>
            </div>
        </main>
    );
}
