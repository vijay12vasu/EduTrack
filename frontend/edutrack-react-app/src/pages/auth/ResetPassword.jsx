import { Link } from 'react-router-dom'
import { Input } from '../../components/ui/Input'
import Button from '../../components/ui/Button'

export default function ResetPassword() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-appbg px-6 py-12">
      <div className="w-full max-w-md bg-white rounded-2xl border border-slate-100 shadow-card p-8 lg:p-10">
        <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Reset Password</h2>
        <p className="text-sm text-slate-500 mb-6">
          Enter your registered email to receive reset instructions.
        </p>

        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <Input label="Email Address" type="email" placeholder="student@example.com" />

          <Button type="submit" className="w-full" size="lg">
            Send Reset Link
          </Button>

          <div className="text-center">
            <Link to="/login" className="text-sm font-medium text-blue-600 hover:underline">
              Back to Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  )
}
