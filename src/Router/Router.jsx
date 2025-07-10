import {createBrowserRouter,} from "react-router";
import RootLayouts from "../Layouts/RootLayouts";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import SignIn from "../Pages/Authentication/SignIn/SignIn";
import Register from "../Pages/Authentication/Register/Register";

export const router = createBrowserRouter([
  {
    path: "/",
    Component:RootLayouts,
    children:[
        {
            index:true,
            Component:Home
        }
    ]
  },
  {
    path:"/",
    Component:AuthLayout,
    children:[
      {
        path:'signin',
        Component:SignIn
      },
      {
        path:'register',
        Component:Register
      }
    ]
  }
]);