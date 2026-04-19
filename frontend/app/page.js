"use client"

import { useState, useEffect } from 'react'
import { useAuth, UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import axios from 'axios'

export default function Home() {
    const { isLoaded, userId } = useAuth()
    const [products, setProducts] = useState([])
    const [loadingProducts, setLoadingProducts] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'
                const res = await axios.get(`${apiUrl}/api/products`)
                setProducts(res.data)
            } catch (err) {
                console.error('Error fetching products:', err)
            } finally {
                setLoadingProducts(false)
            }
        }
        fetchProducts()
    }, [])

    return (
        <main className="flex flex-col w-full min-h-screen">
            <header className="flex justify-between items-center p-6 border-b border-zinc-200 dark:border-zinc-800 max-w-5xl mx-auto w-full">
                <div className="text-2xl font-black tracking-tighter text-indigo-600 dark:text-indigo-400">
                    <Link href="/">ShopSmart</Link>
                </div>
                <nav className="flex gap-4 items-center">
                    {!isLoaded ? null : userId ? (
                        <>
                            <Link href="/dashboard" className="px-4 py-2 font-medium hover:text-indigo-600 transition">
                                Dashboard
                            </Link>
                            <Link href="/cart" className="px-4 py-2 font-medium hover:text-indigo-600 transition">
                                Cart
                            </Link>
                            <UserButton afterSignOutUrl="/" />
                        </>
                    ) : (
                        <>
                            <Link href="/sign-in" className="px-5 py-2 rounded-full font-medium hover:bg-zinc-100 dark:hover:bg-zinc-900 transition">
                                Login
                            </Link>
                            <Link href="/sign-up" className="px-5 py-2 rounded-full bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition">
                                Sign Up
                            </Link>
                        </>
                    )}
                </nav>
            </header>

            <div className="flex-1 max-w-5xl mx-auto w-full p-6">
                <section className="py-12 text-center flex flex-col items-center">
                    <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-zinc-900 dark:text-white">
                        Your Next-Gen Market
                    </h1>
                    <p className="text-xl text-zinc-500 max-w-2xl mb-8">
                        Discover the best products. Everything you need, cleanly organized and easy to buy.
                    </p>
                </section>

                <section className="py-8">
                    <h2 className="text-3xl font-bold mb-8">Latest Products</h2>
                    {loadingProducts ? (
                        <p className="text-zinc-500">Loading products...</p>
                    ) : products.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {products.map(product => (
                                <div key={product.id} className="border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden hover:shadow-lg transition flex flex-col bg-white dark:bg-black">
                                    <div className="h-48 bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center p-4">
                                        {/* Mock image if cloudinary isn't fully linked */}
                                        {product.imageUrl ? (
                                            <img src={product.imageUrl} alt={product.title} className="h-full object-contain" />
                                        ) : (
                                            <div className="text-zinc-400">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="text-lg font-bold">{product.title}</h3>
                                        <p className="text-sm text-zinc-500 flex-1 my-2">{product.description}</p>
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="font-bold text-lg">₹{product.price}</span>
                                            {userId ? (
                                                <Link 
                                                    href="/cart" 
                                                    onClick={() => localStorage.setItem('last_cart_id', product.id)}
                                                    className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black rounded-lg text-sm font-semibold hover:opacity-80 transition"
                                                >
                                                    Add to Cart
                                                </Link>
                                            ) : (
                                                <Link href="/sign-in" className="px-4 py-2 border border-zinc-200 dark:border-zinc-700 rounded-lg text-sm font-semibold hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                                                    Login to Buy
                                                </Link>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-24 bg-zinc-50 dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800">
                            <h3 className="text-xl font-medium text-zinc-500">No products available.</h3>
                        </div>
                    )}
                </section>
            </div>
        </main>
    )
}

