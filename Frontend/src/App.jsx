/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import RegisterPage from './pages/Register/Register'
import NotFound from './pages/Errors/NotFound'
import Header from './components/Header'
import LayoutAdmin from './components/Admin/LayoutAdmin'
import AdminPage from './pages/Admin/AdminPage'
import LoginPage from './pages/Login/Login'
import { fetchAccount } from './redux/slice/accountSlide'
import Home from './pages/Client/Home/Home'
import UserPage from './pages/Admin/User/UserPage'
import ResumePage from './pages/Client/Resume/ResumePage'
import ResumeTable from './components/Admin/Resume/ResumeTable'
import ScheduleTable from './components/Schedule/ScheduleTable'
import MyResumeTable from './pages/Client/Resume/MyResumeTable'
import MyScheduleTable from './components/Schedule/MyScheduleTable'
import ScheduleWithOtherTable from './components/Schedule/ScheduleWithOtherTable'
import SideBar from './components/SideBar/SideBar'
import './app.scss'
import ScheduleDetail from './components/Schedule/ScheduleDetail'

const Layout = () => {

  return (
    <div className="app-container">
      <Header />
      <div className="main-container">
        <SideBar />
        <div className="content">
          <Outlet />
        </div>
      </div>
    </div>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <Home /> },
      {
        path: "resumes/:slug",
        element: <ResumePage />
      },
      {
        path: "schedules",
        element: <ScheduleTable />,
        children: [
          { index: true, element: <MyScheduleTable /> },
          {
            path: "invitee",
            element: <ScheduleWithOtherTable />
          },
          {
            path: ":id",
            element: <ScheduleDetail />
          }
        ]
      },
      {
        path: "resume",
        element: <MyResumeTable />
      },
    ]
  },
  {
    path: "/admin",
    element: <LayoutAdmin />,
    errorElement: <NotFound />,
    children: [
      { index: true, element: <AdminPage /> },
      {
        path: "users",
        element: <UserPage />,
      },
      {
        path: "resumes",
        element: <ResumeTable />,
      },
    ]
  },
  {
    path: "/login",
    element: <LoginPage />,
  }, {
    path: "/register",
    element: <RegisterPage />
  }
])

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    if (
      window.location.pathname === '/login'
      || window.location.pathname === '/register'
    )
      return;
    dispatch(fetchAccount())
  }, [])

  return (
    <>
      <RouterProvider router={router} />
    </>
  )
}

export default App
