import SignInComponent from '@/components/signInComponent'
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return(
    <>
    <div className='flex justify-center items-center '>
        <SignInComponent />
    </div>
    </>
  )
}