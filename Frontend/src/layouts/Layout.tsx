

import Footer from '@/components/Footer'
import Navbar from '@/components/Navbar'
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
