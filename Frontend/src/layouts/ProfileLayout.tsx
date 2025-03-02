import SideBar from "@/components/user/SideBar"
import { Outlet } from "react-router-dom"

const ProfileLayout = () => {
  return (
    <div className="flex md:gap-90">
      <SideBar/>
      <Outlet/>
    </div>
  )
}

export default ProfileLayout
