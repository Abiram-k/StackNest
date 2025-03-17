import { lazy } from "react";
import { RouteObject } from "react-router-dom";
const PageNotFound = lazy(() => import("../pages/public/PageNotFound"));

export const errorRoutes :RouteObject[] = [
    {
        path:"*",element:<PageNotFound/>
    }
]

