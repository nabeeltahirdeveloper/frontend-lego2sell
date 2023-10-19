import React, { useState } from "react"
import { Notification } from "@mantine/core"
import { IconCheck } from "@tabler/icons-react"
import { Helmet } from 'react-helmet'

// import nodemailer from "nodemailer"

const Contact = () => {
  // app.js

  // const transporter = nodemailer.createTransport({
  //   host: "smtp.forwardemail.net",
  //   port: 465,
  //   secure: true,
  //   auth: {
  //     //
  //     // <https://forwardemail.net/guides/send-email-with-custom-domain-smtp>
  //     user: "info@lego2sell.com",
  //     pass: "3037971520209ce1a7094d6a",
  //   },
  // })

  // // const html = render("https://react.email/docs/utilities/render")

  // const options = {
  //   from: "you@example.com",
  //   to: "user@gmail.com",
  //   subject: "hello world",
  //   text: "demo",
  // }

  // transporter.sendMail(options)

  // demo
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [notification, setNotification] = useState(false)
  const [successMessage, setSuccessMessage] = useState(false)
  const [emailError, setEmailError] = useState(false) // New state for email validation
  const [nameError, setNameError] = useState(false) // New state for name validation
  const [messageError, setMessageError] = useState(false)
  // console.log(nameError)
  const validateEmail = (email) => {
    const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return pattern.test(email)
  }

  const validateField = (value, setError) => {
    const isValid = value.trim() !== ""
    setError(!isValid)
    return isValid
  }
  const fetchData = async () => {
    const isEmailValid = validateEmail(email)
    const isNameValid = validateField(name, setNameError)
    const isMessageValid = validateField(message, setMessageError)
    if (!validateEmail(email)) {
      setEmailError(true)
    }
    if (!isNameValid || !isMessageValid) {
      return
    }

    try {
      const response = await fetch(
        "https://api.lego2sell.com/contactus/submit",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: name, email: email, message: message }),
        }
      )

      setSuccessMessage(response.ok)
      setNotification(true)
    } catch {
      // Handle error
    }
  }

  return (
    <div>
      <Helmet>
        <title>Contact to sell your new LEGO sets online - LEGO2SELL </title>
        <meta
          name="description"
          content="Contact LEGO2SELL for questions, support, or inquiries. We're here to assist you every step of the way! Contact us to sell lego sets online."
        />
        <meta
          name="keywords"
          content="LEGO2SELL contact, selling LEGO sets, LEGO2SELL email, customer service LEGO2SELL"
        />
      </Helmet>
      <div className="w-full px-6 lg:px-44 py-12 lg:py-24">
        {/* <h1 className="h1 mb-8"></h1> */}
        <div className="flex items-center justify-center">
          <img className="lg:w-[20%] w-[40%]" src="/Images/contact.jpeg" alt="" />
        </div>
        <p className="mb-6 text-sm lg:text-lg text-black font-medium">
          If you can not find the information you need in our FAQ’s then just send
          us a quick email at the address below or via our quick and easy web form
          and one of the team will get back to you ASAP.
        </p>
        <div className="content-wrapper">
          <div className="flex items-center py-6 justify-center flex-col">
            <img className="w-44 lg:w-auto" src="/Images/email-logo.png" alt="Contact Us | Sell your new lego sets online for cash" />
            <h2 className=" text-lg lg:text-3xl text-blue-600 font-medium">
              Support@lego2sell.com
            </h2>
          </div>

          <h3 className="text-xl font-bold py-4">Get in touch!</h3>

          <p className="mb-3 font-normal text-base">
            Fields marked with <span className="text-[#E52D3B]">*</span> are
            required
          </p>
          <div className="mb-8">
            <label htmlFor="name" className="w-full flex font-bold text-sm mb-2">
              Name<span className="text-[#E52D3B]">*</span>
            </label>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Name"
              className="h-[67px] border border-[rgba(133,138,149,0.4)] rounded-3xl lg:rounded-xl w-full pl-6"
              type="text"
              id="name"
              name="name"
            />
            {nameError && (
              <p className="text-red-500 text-sm mt-1">Name is required</p>
            )}
          </div>
          <div className="mb-8">
            <label htmlFor="email" className="w-full flex font-bold text-sm mb-2">
              Email<span className="text-[#E52D3B]">*</span>
            </label>
            <input
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setEmailError(false) // Clear the error when typing
              }}
              placeholder="Email"
              className={`h-[67px] border ${
                emailError ? "border-red-500" : "border-[rgba(133,138,149,0.4)]"
              } rounded-3xl lg:rounded-xl w-full pl-6`}
              type="email"
              id="email"
              name="email"
            />
            {emailError && (
              <p className="text-red-500 text-sm mt-1">Invalid email format</p>
            )}
          </div>
          <div className="mb-8">
            <label
              htmlFor="message"
              className="w-full flex font-bold text-sm mb-2"
            >
              Message<span className="text-[#E52D3B]">*</span>
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Message"
              rows={6}
              className="h-[170px] pt-6 border border-[rgba(133,138,149,0.4)] rounded-3xl lg:rounded-xl w-full pl-6"
              id="message"
              name="message"
              defaultValue={""}
            />
            {messageError && (
              <p className="text-red-500 text-sm mt-1">Message is required</p>
            )}
          </div>
          {successMessage && (
            <h4 className="text-green-500 text-lg font-medium">
              Email sent Successfully
            </h4>
          )}
          <button
            onClick={fetchData}
            className="cursor-pointer rounded-xl bg-blue-500 text-white h-[50px] lg:h-[80px] flex items-center justify-center font-bold text-base lg:text-lg px-12 lg:px-20"
            style={{ marginTop: 20 }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}

export default Contact
// email.jsx
