import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const withAuth = (WrappedComponent: React.FC) => {
  const AuthenticatedComponent: React.FC = (props) => {
    const router = useRouter()
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token')
        if (!token) {
          router.push('/')
        } else {
          setIsLoading(false)
        }
      }
    }, [router])

    if (isLoading) {
      return null
    }
    return <WrappedComponent {...props} />
  }

  return AuthenticatedComponent
}

export default withAuth
