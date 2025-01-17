"use client"

import { UrlContext } from "@/context/UrlContext"
import AnalysisResults from "./AnalysisResults"

const page = () => {
  return (
    <>
    <UrlContext>
      <AnalysisResults />
    </UrlContext>
    </>
  )
}

export default page
