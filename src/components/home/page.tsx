"use client"

import { UrlProvider } from "@/context/UrlContext"
import Landing from "./Landing"

const page = () => {
  return (
    <>
    <UrlProvider>
     <Landing /> 
    </UrlProvider>
    </>
  )
}

export default page
