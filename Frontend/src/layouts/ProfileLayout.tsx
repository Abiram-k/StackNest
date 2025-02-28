import SideBar from "@/components/SideBar"
import { Outlet } from "react-router-dom"

const ProfileLayout = () => {
  return (
    <div>
      <SideBar/>
      <Outlet/>
    </div>
  )
}

export default ProfileLayout
