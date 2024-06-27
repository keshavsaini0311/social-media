/* eslint-disable no-unused-vars */
import React ,{useState} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {useDispatch ,useSelector} from 'react-redux'
import {signInStart,signInSuccess,signInFailure} from '../redux/user/userSlice'


 const SignIn=()=>{ 

  const [formData, setFormData] = useState({});
  const {loading,error}=useSelector((state)=>state.user);
  const navigate=useNavigate();
  const dispatch=useDispatch();


  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.id]: event.target.value,
    });
  };

  const handleSubmit =async (event) => {
    event.preventDefault();

    try {
      
        dispatch(signInStart());
         const res= await fetch("/api/auth/signin",
         {
           method:'POST',
           headers:{
             'Content-Type':'application/json',
           },
           body: JSON.stringify(formData),
         }
         );
         const data =await res.json();
         if(data.success===false){
           dispatch(signInFailure(data.message));
           console.log(data.message);
           return;
         }
         dispatch(signInSuccess(data));
         navigate('/home');
         console.log(data);
       } catch (error) {
         dispatch(signInFailure(error.message));
       }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Sign In</h2>
        <form >
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="email"
              type="email"
              placeholder="Email"
              onChange={handleChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2"  htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              onChange={handleChange}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
              onClick={handleSubmit}
            >
              Sign In
            </button>
            <Link
              className="inline-block align-baseline font-bold text-sm text-green-500 hover:text-emerald-600"
              to="/forgot-password"
            >
              Forgot Password?
            </Link>
          </div>
          <Link
              className="pt-3 inline-block align-baseline font-bold text-sm text-green-700 hover:text-emerald-600"
              to="/sign-up"
            >
              Create Account
            </Link>
        </form>
      </div>
    </div>
  )

}



export default SignIn;