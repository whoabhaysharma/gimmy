"use client"

import { useEffect, useState } from 'react';
import { login, logout, authStateListener } from '../libs/auth';
import { useRouter } from 'next/navigation';

export default function Home() {
    const [userName, setUserName] = useState("")
    const [password, setPassword] = useState("")
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const handleLogin = async () => {
        setLoading(true)
        try {
            await login(userName, password)
            router.push("/")
        } catch (e) {
            console.log("not able to login")
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const unsubscribe = authStateListener((user) => {
            setUser(user);
            setLoading(false)
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return (
            <h1>loading...</h1>
        )
    }

    if (user) {
        router.push("/")
    }

    return (
        <div className="flex justify-center items-center w-full h-dvh">
            <div className="h-auto w-auto border-solid border-2 border-slate-50 rounded-md p-5 flex flex-col gap-2">
                <h1 className="align-middle">Gimmy</h1>
                <label className="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" /></svg>
                    <input type="text" className="grow" placeholder="Username" onChange={(e) => setUserName(e.target.value)} value={userName} />
                </label>
                <label className="input input-bordered flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
                    <input type="password" placeholder="******" className="grow" onChange={(e) => setPassword(e.target.value)} value={password} />
                </label>
                <button className="btn btn-info mt-3" onClick={handleLogin}>
                    Login
                    {loading && <span className="loading loading-spinner"></span>}
                </button>
            </div>
        </div>
    );
}
