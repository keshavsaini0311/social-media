/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'


export default function UserProfile() {
    const[loading ,setLoading]=useState(false);
    const[error,setError]=useState(null);

    const params = useParams();

    useEffect(() => {
        const fetchUser = async () => {
            try {
                setLoading(true)
                setError(null)
                const username = params.username
                const res = await fetch(`/api/user/get/${username}`)
                const data = await res.json()
                if (data.success === false) {
                    setError(data.message)
                    return
                }
                setLoading(false)
                console.log(data)

            } catch (error) {
                setError(error)
                console.log(error)
            }
        
        }
    }, [])

  return (
    <div>
      
    </div>
  )
}
