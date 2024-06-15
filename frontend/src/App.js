import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import PrivateRoute from "./components/PrivateRoute";
import SignUp from "./pages/SignUp";
import { Messaging } from "./pages/Messaging";


export default function App() {
  return (
    <>
    <BrowserRouter>
      <Routes>
        <Route path="/sign-up" element={<SignUp/>}/>
        <Route path='/' element={<SignIn/>}/>
        <Route element={<PrivateRoute />}>
          <Route path='/messages' element={<Messaging/>}/>
          <Route path='/home' element={<Home/>}/>
        </Route> 
      </Routes>
    </BrowserRouter>
    </>
  )
}
