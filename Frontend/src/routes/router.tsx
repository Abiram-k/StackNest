import { createBrowserRouter } from "react-router-dom";
import { publicRoutes,userRoutes,adminRoutes,errorRoutes } from ".";


export const appRouter = createBrowserRouter([
    {children:[
        ...publicRoutes,
        ...userRoutes,
        ...adminRoutes,
        ...errorRoutes
    ]}
])