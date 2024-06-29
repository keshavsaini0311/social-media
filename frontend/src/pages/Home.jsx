/* eslint-disable no-unused-vars */
import React from 'react'
import { Navigate,Link } from 'react-router-dom'
import Header from '../components/Header'
export default function home() {
  return (
    <div>
      <Header/>
      home

      <Link to='/messages'>Messages</Link>
    </div>
  )
}
