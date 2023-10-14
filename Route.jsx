import React from "react"
import { RouterProvider, createBrowserRouter } from "react-router-dom"

import Header from "./src/componet/Header"
import App from "./App"
import SignUpForm from "./Pages/Signin"
import Admin from "./Pages/Admin"
import Product from "./Pages/Product"
import Basket from "./Pages/Basket"
import Details from "./Pages/Details"
import HowWrokPage from "./src/componet/HowWrokPage"
import SuccessPage from "./Pages/SuccessPage"
import Dashboard from "./Pages/Dashboard"
import Conditions from "./Pages/Conditions"
import Terms from "./Pages/Terms"
import Packaging from "./Pages/Packaging"
import AboutUs from "./Pages/AboutUs"
import Contact from "./Pages/Contact"
import PrivacyStatement from "./Pages/PrivacyStatement"
import PasswordReset from "./Pages/PasswordReset.jsx/PasswordReset"
import ChangePassword from "./src/componet/ChangePassword"
const adminView = localStorage.getItem("adminView")
export const router = createBrowserRouter([
  {
    path: "",
    element: (
      <div className=" flex min-h-screen flex-col ">
        <Header />
        <App />
        <Footer />
      </div>
    ),
  },
  {
    path: "/signup/",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />
        <SignUpForm />
        <Footer />
      </div>
    ),
  },
  {
    path: "/Admin/",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />
        {/* {isAdmin ? <Admin /> : <div>Unauthorization Persn Not allow</div>} */}
        {adminView === "admin" ? <Admin /> : <Navigate to={"/"} />}
        {/* <Admin /> */}

        <Footer />
      </div>
    ),
  },
  {
    path: "/login/",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />
        <Login />
        <Footer />
      </div>
    ),
  },
  {
    path: "/product",
    element: (
      <div className=" flex min-h-screen flex-col ">
        <Header />
        <Product />
        <Footer />
      </div>
    ),
  },
  {
    path: "/selling-basket",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />
        <Basket />
        <Footer />
      </div>
    ),
  },
  {
    path: "/check-your-details",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />
        <Details />
        <Footer />
      </div>
    ),
  },
  {
    path: "/how-it-works",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />
        <HowWrokPage />
        <Footer />
      </div>
    ),
  },
  {
    path: "/success",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />
        <SuccessPage />
        <Footer />
      </div>
    ),
  },
  {
    path: "/my-account",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />

        <Dashboard />

        <Footer />
      </div>
    ),
  },
  {
    path: "/Conditions",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />

        <Conditions />

        <Footer />
      </div>
    ),
  },
  {
    path: "/terms-and-conditions",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />
        <Terms />
        <Footer />
      </div>
    ),
  },
  {
    path: "/acceptance-guidelines",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />
        <Appceptance />
        <Footer />
      </div>
    ),
  },
  {
    path: "/packaging-guidelines",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />
        <Packaging />
        <Footer />
      </div>
    ),
  },
  {
    path: "/about",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />
        <AboutUs />
        <Footer />
      </div>
    ),
  },
  {
    path: "/Contact",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />
        <Contact />
        <Footer />
      </div>
    ),
  },
  {
    path: "/privacy-statement",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />
        <PrivacyStatement />
        <Footer />
      </div>
    ),
  },
  {
    path: "/forgotpassword/:id/:token",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />
        <PasswordReset />
        <Footer />
      </div>
    ),
  },
  {
    path: "/forgot-password",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />
        <ChangePassword />
        <Footer />
      </div>
    ),
  },
  {
    path: "/AdminDashboard",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />
        {adminView === "admin" ? <AdminDashboard /> : <Navigate to={"/"} />}
        <Footer />
      </div>
    ),
  },
  {
    path: "/customeroffers",
    element: (
      <div className="h-screen flex min-h-screen flex-col ">
        <Header />
        {adminView === "admin" ? <CustomerOffers /> : <Navigate to={"/"} />}
        <Footer />
      </div>
    ),
  },
])
const Route = () => {
  return <RouterProvider router={router} />
}

export default Route
