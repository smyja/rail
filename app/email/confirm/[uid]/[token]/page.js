// pages/email/confirm/[uid]/[token].js
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation';
import axios from 'axios'

export default function ConfirmEmail({params }) {
  const { uid, token } = params 
  const router = useRouter();
  const [error, setError] = useState(null)
  const [isConfirmed, setIsConfirmed] = useState(false)


  useEffect(() => {

    if (uid && token) {
     // Send the uid and token to your backend to confirm the email
      axios.get(`http://127.0.0.1:8000/api/v1/confirm/${uid}/${token}`)
        .then(response => {

          setIsConfirmed(true)
          router.push("/login");
        })
        .catch(error => {
          console.log('GET request failed') // log when the GET request fails

          // Handle failed confirmation
          setError(error.message)
        })
    }
  }, [uid, token,router])

  return (
    <div>
      {isConfirmed ? (
        <p>Confirmation successful! Redirecting to login...</p>
      ) : (
        <p>Confirming...</p>
      )}
      {error && <p>Error: {error}</p>}
    </div>
  )
}
