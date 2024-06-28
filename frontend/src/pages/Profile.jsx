/* eslint-disable no-unused-vars */
import React from 'react'
import {Link, useNavigate} from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {useRef ,useState,useEffect} from 'react'
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { app } from '../firebase.js'
import {  updateUserStart, updateUserSuccess, updateUserFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure ,signoutUserStart,signoutUserSuccess,signoutUserFailure} from '../redux/user/userSlice.js'


export default function Profile() {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const fileRef = useRef()
  const [error, setError] = useState(null);
  const [updatesuccess, setUpdateSuccess] = useState(false);
  const [deletesuccess, setDeleteSuccess] = useState(false);
  const currentUser = useSelector((state) => state.user.currentUser)
  const[file, setFile] = useState(undefined)
  const [filePerc, setFilePerc] = useState(0)
  const [fileUploadError, setFileUploadError] = useState(false)
  const [formdata , setFormdata] = useState({})
  

  useEffect(() => {
    if(file){
      handleFileUpload(file)
    }
  }, [file])
  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        setFilePerc(Math.round(progress))
        },
      (error) => {
        setFileUploadError(true)
        },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
         
           setFormdata({...formdata, avatar:downloadURL})
        })
      }
    )
  }
  const handleChange = (e) => {
    setFormdata({
      ...formdata,
      [e.target.id]: e.target.value,
    })
  }

  const handleSubmit = async(e) => {
    e.preventDefault()
    try {
      dispatch(updateUserStart())
      
      const res =await fetch(`/api/user/update/${currentUser._id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      })
      const data = await res.json()
      console.log(data);
      if (data.success === false) {
        if(data.message.indexOf("duplicate")!==-1){
          setError("Username or Email already exists")
          return
        }
          dispatch(updateUserFailure(data.message))
          setError(data.message)
        
        setUpdateSuccess(false)
        return
      }
      dispatch(updateUserSuccess(data))
      setUpdateSuccess(true)
      setError(null)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
      if(error!==null &&error.message.indexOf("duplicate key")!==-1){
        setError("Username or Email already exists")
      }else{
      setError(error.message)}
      setUpdateSuccess(false)
    }
    }
      
    const handleDelete=async()=>{
      try {
        dispatch(deleteUserStart())
        const res =await fetch(`/api/user/delete/${currentUser._id}`, {
          method: 'DELETE',
          credentials:"same-origin",
        })
        const data = await res.json()
        if (data.success === false) {
          dispatch(deleteUserFailure(data.message))
          console.log(data.message);
          setError(data.message)
          setDeleteSuccess(false)
          return
        }
        dispatch(deleteUserSuccess(data))
        setDeleteSuccess(true)
        setError(null)
        navigate('/')
      } catch (error) {
        dispatch(deleteUserFailure(error.message))
        setError(error.message)
        setDeleteSuccess(false)
      }
    }

    const handleSignOut= async()=>{
      try{
        dispatch(signoutUserStart())
        const res=await fetch('/api/auth/signout');
        const data=await res.json();
        if(data.success===false){
          dispatch(signoutUserFailure(data.message));
          return;
        }
        dispatch(signoutUserSuccess(data));
        navigate('/');
        console.log(data);
      }catch(error){
        dispatch(signoutUserFailure(error.message));
      }
    }    
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className=' text-center text-3xl font-bold mb-4 text-slate-800 my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input onChange={(e)=>setFile(e.target.files[0])} type="file" ref={fileRef} className="hidden" accept="image/*" />
        <img onClick={() => fileRef.current.click()} className='mt-2 self-center cursor-pointer object-cover w-32 h-32 rounded-full' src={formdata.avatar || currentUser.avatar} alt="" />
<p className='text-center'>
  {fileUploadError ? (
    <span className='text-red-500'>Upload Failed</span>
  ): filePerc >0&& filePerc < 100 ? (
      <span className='t ext-slate-500'>{filePerc}%</span>
    ): filePerc === 100 ? (
        <span className='text-green-500'>Uploaded Successfully</span>
      ): (
        ""
      )}
</p>
        <input onChange={handleChange} defaultValue={currentUser.userName} id='userName' type="text" placeholder='Username' className='border p-3 rounded-lg' />
        <input onChange={handleChange} defaultValue={currentUser.email} id='email' type="text" placeholder='email' className='border p-3 rounded-lg' />
        <input onChange={handleChange} defaultValue={currentUser.password} id='password' type="password" placeholder='password' className='border p-3 rounded-lg' />
        <input onChange={handleChange} defaultValue={currentUser.contactNumber} id='contactNumber' type="text" placeholder='contact number' className='border p-3 rounded-lg' />
        <input onChange={handleChange} checked={currentUser.gender==='male'?true:false || formdata.gender==='male'?true:false} id='gender' type='radio' value='male' name='gender' className='border p-3 rounded-lg' /><label>Male</label>
        <input onChange={handleChange} checked={currentUser.gender==='female'?true:false || formdata.gender==='female'?true:false} id='gender' type='radio' value='female' name='gender' className='border p-3 rounded-lg' /><label>Female</label>
        <input type="date" name="" defaultValue={currentUser.dateOfBirth} className="border p-3 rounded-lg" id="dateOfBirth" />
        <button type='submit' className='border p-3 rounded-lg bg-slate-700 text-white uppercase hover:opacity-80 disabled:opacity-25'>Update</button>
      </form>
      <div className='mt-5 flex justify-between'>
        <span onClick={handleDelete} className='text-red-500 cursor-pointer hover:underline'>Delete Account</span>
        <span onClick={handleSignOut} className=' text-red-500 cursor-pointer hover:underline'>Sign Out</span>
      </div>
      <p className='text-green-500 mt-5'>{updatesuccess?"Updated Successfully":""}</p>
     
    </div>
  )
}
