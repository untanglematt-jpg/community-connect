// /app/auth/sign-up/page.tsx
'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { createBrowserClient } from '@/lib/auth-helpers'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
})

type FormValues = z.infer<typeof schema>

export default function SignUpPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const returnTo = searchParams.get('returnTo') || '/my-results'
  const [serverError, setServerError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const { register, handleSubmit, formState: { errors, isValid } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: 'onChange',
  })

  const onSubmit = async (data: FormValues) => {
    setLoading(true)
    setServerError(null)

    const supabase = createBrowserClient()
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    })

    if (error) {
      setServerError(error.message)
      setLoading(false)
      return
    }

    router.push(returnTo)
  }

  return (
    <div className="min-h-screen bg-amber-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-semibold text-stone-800">Create your account</h1>
          <p className="text-stone-500 text-sm mt-2">Save your results and come back any time.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-stone-100 p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-1">
              <Label htmlFor="email">Email address</Label>
              <input
                id="email"
                type="email"
                {...register('email')}
                placeholder="you@example.com"
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <Label htmlFor="password">Password</Label>
              <input
                id="password"
                type="password"
                {...register('password')}
                placeholder="At least 8 characters"
                className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              {errors.password && <p className="text-red-500 text-xs">{errors.password.message}</p>}
            </div>

            {serverError && (
              <div className="bg-red-50 border border-red-100 rounded-lg px-4 py-3">
                <p className="text-red-600 text-sm">{serverError}</p>
              </div>
            )}

            <Button type="submit" disabled={!isValid || loading} className="w-full bg-green-600 hover:bg-green-700 text-white">
              {loading ? 'Creating account...' : 'Create account'}
            </Button>
          </form>

          <p className="text-center text-sm text-stone-500 mt-5">
            Already have an account?{' '}
            <Link href={`/auth/sign-in?returnTo=${returnTo}`} className="text-green-700 underline underline-offset-2">
              Sign in
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-stone-400 mt-6">
          You can always use the platform without an account. Creating one just lets you save your results.
        </p>
      </div>
    </div>
  )
}