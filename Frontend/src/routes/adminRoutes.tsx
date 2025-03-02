import { lazy } from "react";
const AdminLoginPage = lazy(() => import("../pages/admin/auth/AdminLogin"));
import { RouteObject } from "react-router-dom";


export const adminRoutes:RouteObject[] = [
    {path:"admin",children:[
        {path:"auth",children:[
            {path:"login", element:<AdminLoginPage/>}
        ]}
    ]}
]
