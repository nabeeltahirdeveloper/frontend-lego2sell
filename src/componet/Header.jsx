import { Accordion, Group, Text } from "@mantine/core"
import React, { useEffect, useRef, useState } from "react"
import { charactersList } from "./FAQData"
import { Link, useLocation, useNavigate } from "react-router-dom"
import axios from "axios"
import baseUrl from "../context/baseUrl"
const Header = ({ addBasket }) => {
  const [FAQOpen, setFAQOpen] = useState()
  const [openMenu, setOpenMenu] = useState()
  const navigation = useNavigate()
  // console.log("addBasket", addBasket)
  // const totalPrice = localStorage.getItem("totalPrice")
  const location = useLocation()
  const storedUserId = localStorage.getItem("userId")
  // console.log("storedUserId", location.pathname)
  const route = location.pathname
  const Basket = localStorage.getItem("Basket")
  const BasketStatus = localStorage.getItem("BasketStatus")
  const [orderitems, setOrderitems] = useState()
  const [userData, setUserData] = useState()
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/user/${storedUserId}`
        )
        setUserData(response.data)
        console.log(userData)
        localStorage.setItem(
          "adminView",
          response.data.admin === "admin" ? "admin" : null
        )
        // setLoading(false)
      } catch (error) {
        console.error(error)
        // setLoading(false)
      }
    }

    if(storedUserId !== null){
      fetchUserData()
    }
  }, [storedUserId, setUserData])
  useEffect(() => {
    const fetchUserOrders = async () => {
      try {
        const response = await axios.get(
          `${baseUrl}/Getorder/${storedUserId}`
        )

        if (response.status === 200) {
          const { orders } = response.data
          // console.log("User orders:", orders)
          setOrderitems(orders)
          // Process the orders data as needed
        } else {
          throw new Error("Error: " + response.status)
        }
      } catch (error) {
        console.error("An error occurred:", error)
        // Handle the error as needed
      }
    }

    if(storedUserId !== null){
      fetchUserOrders()
    }
  }, [storedUserId, setOrderitems])

  const [totalPrice, setTotalPrice] = useState(0)

  useEffect(() => {
    if (orderitems) {
      const PostOffer = orderitems
        ?.filter((value) => {
          return value?.Status === "Paid" || value?.Status === "Rejected"
        })
        ?.map((value) => value.Price)
      const totalPrice = orderitems.reduce(
        (sum, value) => sum + (value?.Price || 0),
        0
      )
      const totalPriceMinusPostOffer =
        totalPrice -
        (PostOffer?.reduce((sum, price) => sum + (price || 0), 0) || 0)
      // console.log("demo2938293892382938", totalPriceMinusPostOffer)
      setTotalPrice(totalPriceMinusPostOffer)
      // localStorage.setItem("totalPrice", totalPrice)
    }
  }, [orderitems])
  // console.log(route)
  const items = charactersList.map((item) => (
    <Accordion.Item value={item.id} key={item.label}>
      <Accordion.Control>
        <AccordionLabel {...item} />
      </Accordion.Control>
      <Accordion.Panel>
        <Text size="sm">{item.content}</Text>
      </Accordion.Panel>
    </Accordion.Item>
  ))

  function useOutsideAlerter(ref) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          setFAQOpen(false)
          setMenuOpen(false)
          setOpenMenu(false)
        }
      }
      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside)
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside)
      }
    }, [ref])
  }
  const PostOffer = orderitems
    ?.filter((value) => {
      return value.Status === "Paid" || value.Status === "Rejected"
    })
    ?.map((value) => value)

  // Find PostOffer length
  // const postOfferLength = PostOffer ? PostOffer.length : 0
  const [numberofitem, setNumberofitem] = useState(0)
  const excludedPaths = ["/my-account", "/", "/product/", "/selling-basket/"]
  useEffect(() => {
    const calculatedNumber =
      (orderitems?.length || 0) + +(Basket || 0) - (PostOffer?.length || 0)
    const MyAccountNumber = (orderitems?.length || 0) - (PostOffer?.length || 0)
    if (
      location.pathname !== "/my-account" &&
      !excludedPaths.includes(location.pathname)
    ) {
      setNumberofitem(calculatedNumber)
    } else {
      setNumberofitem(MyAccountNumber)
    }
    // console.log("Postman", calculatedNumber)
  }, [orderitems, Basket, PostOffer])
  const wrapperRef = useRef(null)

  useOutsideAlerter(wrapperRef)
  const [MenuOpen, setMenuOpen] = useState()
  const router = location.pathname

  return (
    <div
      ref={wrapperRef}
      className="flex flex-col items-center w-full justify-between"
    >
      
    </div>
  )
}

export default Header
function AccordionLabel({ label, image, description }) {
  return (
    <Group noWrap>
      <div>
        <Text>{label}</Text>
        <Text size="sm" color="dimmed" weight={400}>
          {description}
        </Text>
      </div>
    </Group>
  )
}
