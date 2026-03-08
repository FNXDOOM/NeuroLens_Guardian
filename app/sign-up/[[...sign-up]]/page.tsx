import { SignUp } from '@clerk/nextjs'
import { Shield } from 'lucide-react'
import Link from 'next/link'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex flex-col items-center justify-center px-6 py-12">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2 mb-8 hover:opacity-80 transition-opacity">
        <div className="p-2 bg-primary rounded-lg">
          <Shield className="w-5 h-5 text-primary-foreground" />
        </div>
        <span className="font-semibold text-lg text-foreground">NeuroLens Guardian</span>
      </Link>

      {/* Clerk Sign Up Component */}
      <SignUp
        appearance={{
          elements: {
            rootBox: 'w-full max-w-md',
            card: 'shadow-lg shadow-black/5 border border-border rounded-2xl',
            headerTitle: 'text-foreground font-bold text-2xl',
            headerSubtitle: 'text-muted-foreground',
            formButtonPrimary:
              'bg-primary hover:opacity-90 text-primary-foreground font-semibold rounded-xl',
            formFieldInput:
              'rounded-xl border-border focus:ring-primary',
            footerActionLink: 'text-primary hover:underline font-medium',
            socialButtonsBlockButton:
              'border border-border rounded-xl hover:bg-secondary/10 transition-colors',
          },
        }}
        fallbackRedirectUrl="/user"
        signInUrl="/sign-in"
      />
    </div>
  )
}
