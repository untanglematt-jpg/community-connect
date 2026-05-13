// /components/layout/Header.tsx
import Link from 'next/link' 
import { AuthNav } from './AuthNav' 
export function Header() { 
 return ( 
 <header className="bg-amber-50 border-b border-stone-200"> 
 <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify between"> 
 <Link href="/" className="font-semibold text-stone-800 text-lg">  Community Connect 
 </Link> 
 <nav className="flex items-center gap-6"> 
 <Link href="/intake/housing" 
 className="text-sm text-stone-600 hover:text-stone-900">  Start assessment 
 </Link> 
 <AuthNav /> 
 </nav> 
 </div> 
 </header> 
 ) 
}
