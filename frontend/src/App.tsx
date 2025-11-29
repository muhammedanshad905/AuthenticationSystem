import { Toaster } from "react-hot-toast"
import Home from "./pages/Home"
import Login from "./pages/Login"
import OTPVerification from "./pages/Otp"
import Register from "./pages/Register"
import { BrowserRouter, Route, Routes} from "react-router-dom"


const App = () => {
  return (
    <>
    <Toaster />
    <BrowserRouter>
      <Routes>
           <Route path='/' element={<Home />} />
           <Route path='/login' element={<Login />} />
           <Route path='/register' element={<Register />} />
           <Route path='/otp' element={<OTPVerification />} />
       </Routes>
    </BrowserRouter>
    </>
  )
}

export default App
