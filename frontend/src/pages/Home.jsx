/* eslint-disable no-unused-vars */
import React from 'react'
import { Navigate,Link } from 'react-router-dom'
export default function home() {
  return (
    <div>
      home

      <Link to='/messages'>Messages</Link>
    </div>
  )
}
