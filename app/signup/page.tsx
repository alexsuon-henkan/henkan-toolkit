import { SignUp } from "@/components/SignUp"

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8 mx-auto">
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create a new account</h2>
          <SignUp />
        </div>
      </div>
    </div>
  )
}
