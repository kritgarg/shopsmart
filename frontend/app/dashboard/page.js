"use client"

import { useAuth, useUser, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useStore } from '../../context/StoreContext';

export default function Dashboard() {
    const { isLoaded, userId, getToken } = useAuth();
    const { user } = useUser();
    const { isAdmin, loading: contextLoading } = useStore();
    
    // Admin list of users (only admins fetch this)
    const [usersList, setUsersList] = useState([]);
    
    // Admin Product form state
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [notionLink, setNotionLink] = useState('');
    const [image, setImage] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // Regular User state
    const [purchases, setPurchases] = useState([]);
    const [dataLoading, setDataLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!userId || contextLoading) return;
            try {
                const token = await getToken();
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
                
                if (isAdmin) {
                    // Admins fetch the full user list
                    const userRes = await axios.get(`${apiUrl}/api/users`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUsersList(userRes.data);
                } else {
                    // Regular users fetch their own purchases
                    const purchaseRes = await axios.get(`${apiUrl}/api/users/purchases`, {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setPurchases(purchaseRes.data);
                }
            } catch (err) {
                console.error("Dashboard Data Fetch Error:", err);
            } finally {
                setDataLoading(false);
            }
        };

        if (isLoaded && userId && !contextLoading) {
            fetchDashboardData();
        }
    }, [isLoaded, userId, contextLoading, isAdmin, getToken]);

    const handlePromote = async (targetUserId) => {
        try {
            const token = await getToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            await axios.put(`${apiUrl}/api/users/${targetUserId}/role`, { role: 'ADMIN' }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsersList(usersList.map(u => u.id === targetUserId ? { ...u, role: 'ADMIN' } : u));
        } catch (err) { alert('Failed to promote user'); }
    };

    const handleProductUpload = async (e) => {
        e.preventDefault();
        if (!title || !price || !image) return alert("Missing required fields");
        setUploading(true);
        try {
            const token = await getToken();
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001';
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            formData.append('price', price);
            formData.append('notionLink', notionLink || '#');
            formData.append('image', image);

            await axios.post(`${apiUrl}/api/products`, formData, {
                headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
            });

            setUploadSuccess(true);
            setTitle(''); setDescription(''); setPrice(''); setNotionLink(''); setImage(null);
            setTimeout(() => setUploadSuccess(false), 3000);
        } catch (err) { alert('Failed to upload product'); } finally { setUploading(false); }
    };

    if (!isLoaded || contextLoading || dataLoading) {
        return <div className="flex items-center justify-center min-h-[40vh]">Loading Dashboard...</div>;
    }

    return (
        <main className="flex flex-1 w-full max-w-5xl flex-col items-start justify-start py-8 px-4 sm:px-8 mx-auto">
            <div className="flex w-full justify-between items-center mb-8 pb-4 border-b border-zinc-200 dark:border-zinc-800">
                <Link href="/" className="text-zinc-600 hover:text-indigo-600 transition tracking-tight font-medium">
                    ← Back to Home
                </Link>
                <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">Hello, {user?.firstName || user?.username} ({isAdmin ? 'Admin' : 'User'})</span>
                    <UserButton afterSignOutUrl="/" />
                </div>
            </div>

            <h1 className="text-3xl font-bold mb-2">{isAdmin ? 'Admin Control Center' : 'User Purchases'}</h1>
            
            {isAdmin ? (
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
                    {/* Add Product Form */}
                    <div className="lg:col-span-1 bg-white dark:bg-black p-6 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-sm">
                        <h2 className="text-xl font-bold mb-4">Add Product</h2>
                        <form onSubmit={handleProductUpload} className="flex flex-col gap-4">
                            <input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Title" required className="w-full p-2 border border-zinc-200 rounded-xl dark:bg-zinc-900 focus:ring-2 focus:ring-indigo-500 outline-none" />
                            <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Description" required className="w-full p-2 border border-zinc-200 rounded-xl dark:bg-zinc-900 h-24 focus:ring-2 focus:ring-indigo-500 outline-none" />
                            <input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="Price (₹)" required className="w-full p-2 border border-zinc-200 rounded-xl dark:bg-zinc-900" />
                            <input type="text" value={notionLink} onChange={e => setNotionLink(e.target.value)} placeholder="Link (Notion/Drive)" className="w-full p-2 border border-zinc-200 rounded-xl dark:bg-zinc-900" />
                            <div className="flex flex-col gap-1">
                                <span className="text-[10px] text-zinc-500 uppercase font-bold px-1">Product Image</span>
                                <input type="file" accept="image/*" onChange={e => setImage(e.target.files[0])} required className="text-xs" />
                            </div>
                            <button disabled={uploading} type="submit" className="mt-4 bg-black dark:bg-white text-white dark:text-black font-bold py-3 rounded-2xl hover:opacity-80 transition shadow-lg">
                                {uploading ? 'Uploading...' : 'Save Product'}
                            </button>
                            {uploadSuccess && <p className="text-green-600 text-xs text-center font-bold">Successfully Added!</p>}
                        </form>
                    </div>

                    {/* Users Management */}
                    <div className="lg:col-span-2 bg-white dark:bg-black p-6 border border-zinc-200 dark:border-zinc-800 rounded-3xl h-[600px] flex flex-col">
                        <h2 className="text-xl font-bold mb-4">Manage Platform Users</h2>
                        <div className="overflow-y-auto flex-1 pr-2 divide-y divide-zinc-100 dark:divide-zinc-900">
                            {usersList.map(u => (
                                <div key={u.id} className="flex justify-between items-center py-4 px-2 hover:bg-zinc-50 dark:hover:bg-zinc-950 transition rounded-xl">
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold truncate max-w-[200px]">{u.email}</span>
                                        <span className="text-[10px] text-zinc-500">{u.id}</span>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`text-[10px] px-2 py-1 rounded-full font-bold uppercase ${u.role === 'ADMIN' ? 'bg-indigo-100 text-indigo-700' : 'bg-zinc-100 text-zinc-700'}`}>{u.role}</span>
                                        {u.role !== 'ADMIN' && (
                                            <button onClick={() => handlePromote(u.id)} className="text-[10px] bg-indigo-600 text-white px-3 py-1.5 rounded-full font-bold hover:bg-indigo-700 transition">
                                                Promote
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="w-full mt-8">
                    {purchases.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                            {purchases.map(product => (
                                <div key={product.id} className="border border-zinc-200 dark:border-zinc-800 rounded-3xl overflow-hidden bg-white dark:bg-black p-5 flex flex-col gap-4 shadow-sm hover:shadow-xl transition">
                                    <div className="h-40 bg-zinc-100 dark:bg-zinc-900 rounded-2xl overflow-hidden">
                                        {product.imageUrl && <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        <h3 className="font-black text-lg truncate">{product.title}</h3>
                                        <p className="text-xs text-zinc-500 line-clamp-2">{product.description}</p>
                                    </div>
                                    <a href={product.notionLink} target="_blank" rel="noreferrer" className="mt-2 text-center py-3 bg-black dark:bg-white text-white dark:text-black rounded-2xl text-sm font-black hover:opacity-80 transition">
                                        Access Resource
                                    </a>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-20 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-[2.5rem] text-center bg-zinc-50 dark:bg-zinc-950/20">
                            <h2 className="text-2xl font-black mb-2 italic">Nothing here yet?</h2>
                            <p className="text-zinc-500 mb-6">Invest in your growth today.</p>
                            <Link href="/" className="px-8 py-3 bg-indigo-600 text-white rounded-full font-black hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200">
                                Browse Store
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </main>
    );
}
