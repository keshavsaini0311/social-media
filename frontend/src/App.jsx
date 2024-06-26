/* eslint-disable no-unused-vars */
import { BrowserRouter ,Routes,Route} from 'react-router-dom'
import PrivateRoute from './components/PrivateRoute'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import Home from './pages/Home'
import ChatPage from './pages/ChatPage'
import Profile from './pages/Profile'
import ProfilePage from './pages/ProfilePage'
import Header from './components/Header'

export default function App() {
  return (
    <BrowserRouter>
    
    <Routes>
      <Route path='/' element={<SignIn/>}/>
      <Route path='/sign-up' element={<SignUp/>}/>
      <Route element={<PrivateRoute/>}>
      <Route path='/profile/:id' element={<ProfilePage/>}/>
      <Route path='/update-profile' element={<Profile/>}/>
      <Route path='/home' element={<Home/>}/>
      <Route path='/messages' element={<ChatPage/>}/>
      </Route>
    </Routes>
    </BrowserRouter>
  )
}