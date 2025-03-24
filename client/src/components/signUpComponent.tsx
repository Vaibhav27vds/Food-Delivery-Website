"use client";
import { SignUp, useUser } from '@clerk/nextjs'
import { useSearchParams } from 'next/navigation';
import React from 'react'

const SignUpComponent = () => {
  const { user } = useUser();
  const searchParams = useSearchParams();
  const getRedirectUrl = () => {

    const userType = user?.publicMetadata?.role as string;
    if (userType !== "user") {
      return "/business/dashboard";
    }
    else{
    return "/user/dashboard";
    }
  }
  return (
    <SignUp
    forceRedirectUrl={getRedirectUrl()}
    routing='hash'
    afterSignOutUrl='/'
    />
  )
}

export default SignUpComponent