"use client";
import { SignIn, useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation';
import React from 'react'

const SignInComponent = () => {
  const { user } = useUser();
  const searchParams = useSearchParams();


  const getRedirectUrl = () => {

    const userType = user?.publicMetadata?.role as string;

    console.log("user type form component", userType);
    

    if (userType !== "user") {
      return "/business/dashboard";
    }
    else {
    return "/user/dashboard";
    }
  }


  return (
    <SignIn 
    forceRedirectUrl={getRedirectUrl()}
    routing='hash'
    afterSignOutUrl='/'
    />
  )
}

export default SignInComponent