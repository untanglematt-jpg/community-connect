'use client'
import { useEffect, useState } from 'react' 
import Link from 'next/link' 
import { createBrowserClient } from '@/lib/auth-helpers' 
export function AuthNav() { 
 const [user, setUser] = useState(null) 
 const supabase = createBrowserClient() 
 useEffect(() => { 
 supabase.auth.getSession().then(({ data }) => setUser(data.session?.user ??  null)) 
 const { data: listener } = supabase.auth.onAuthStateChange((_, session) => {  setUser(session?.user ?? null) 
 }) 
 return () => listener.subscription.unsubscribe() 
 }, []) 
 if (!user) return <Link href="/auth/sign-in">Sign in</Link> 
 return ( 
 <div className="flex items-center gap-4"> 
 <Link href="/my-results">My saved results</Link> 
 <button onClick={() => supabase.auth.signOut()}>Sign out</button>  </div> 
 ) 
}
