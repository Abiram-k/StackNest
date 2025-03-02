

import Footer from '@/components/user/Footer'
import Navbar from '@/components/user/Navbar'
import { Outlet } from 'react-router-dom'

const Layout = () => {
  return (
   <>
   <Navbar isAuthintacted={true}/>
   <Outlet/>
   <Footer/>
   </>
  )
}

export default Layout
