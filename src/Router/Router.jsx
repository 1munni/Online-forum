import {createBrowserRouter,} from "react-router";
import RootLayouts from "../Layouts/RootLayouts";
import Home from "../Pages/Home/Home/Home";
import AuthLayout from "../Layouts/AuthLayout";
import SignIn from "../Pages/Authentication/SignIn/SignIn";
import Register from "../Pages/Authentication/Register/Register";
import PrivateRoutes from "../Routes/PrivateRoutes";
import DasBoardLayout from "../Layouts/DasBoardLayout";
import MyPosts from "../Pages/DashBoard/MyPost/MyPosts";
import AddPost from "../Pages/DashBoard/AddPost/AddPost";
import MyProfile from "../Pages/DashBoard/MyProfile/MyProfile";
import PostDetails from "../Pages/Home/PostDetails/PostDetails";
import MemberPage from "../Pages/DashBoard/MemberPage/MemberPage";
import CommentsPage from "../Pages/DashBoard/CommentsPage/CommentsPage";
import MakeAdmin from "../Pages/DashBoard/MakeAdmin/MakeAdmin";
import AdminRoutes from "../Routes/AdminRoutes";
import Forbidden from "../Pages/Forbidden/Forbidden";
import AdminProfile from "../Pages/DashBoard/AdminProfiel/AdminProfile";
import MakeAnnounce from "../Pages/DashBoard/MakeAnnouncement/MakeAnnounce";
import ReportComment from "../Pages/DashBoard/ReportComment/ReportComment";
import TagPosts from "../Pages/Home/TagPosts/TagPosts";



export const router = createBrowserRouter([
  {
    path: "/",
    Component:RootLayouts,
    children:[
        {
            index:true,
            Component:Home
        },
        {
          path:'membership',
           element: (
    <PrivateRoutes>
     <MemberPage></MemberPage>
    </PrivateRoutes>
  ),
        },
        {
        path: "post/:id",         
        Component: PostDetails
      },
      {
        path:'forbidden',
        Component: Forbidden
      },
    {
  path: "/tags/:tag",
  element: <TagPosts />,
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
  },
 {
  path: '/dashboard',
  element: (
    <PrivateRoutes>
      <DasBoardLayout />
    </PrivateRoutes>
  ),
  children: [
    {
      path: 'myPost',
      element: <MyPosts />
    },
    {
  path: 'comments/:postId',
  element: <CommentsPage />
},
    {
      path: 'addPost',
      element: <AddPost></AddPost>
    },
    {
      path: 'profile',
      element: <MyProfile></MyProfile>
    },
    {
      path:'makeAdmin',
      element:<AdminRoutes><MakeAdmin></MakeAdmin></AdminRoutes>
    },
    {
      path:'adminProfile',
      element:<AdminRoutes><AdminProfile></AdminProfile></AdminRoutes>
    },
    {
      path:'makeAnnouncement',
      element:<AdminRoutes><MakeAnnounce></MakeAnnounce></AdminRoutes>
    },
    {
      path:'reportComments',
      element:<AdminRoutes><ReportComment></ReportComment></AdminRoutes>
    },
  ]
}

]);