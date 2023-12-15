import React, { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./App.css"
import { Button, Loader, Modal, Tooltip } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { Helmet } from "react-helmet"
import { useMediaQuery } from "react-responsive"
import ReactGA from "react-ga4"
import baseUrl from "./context/baseUrl"
const App = () => {
  const [e, setE] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [opened, { open, close }] = useDisclosure(false)
  const navigation = useNavigate()

  const [opened1, setOpened] = useState(false)
  const storedUserId = localStorage.getItem("userId")
  useEffect(() => {
    ReactGA.send(window.location.pathname)
    const SendAnalytics = () => {
      ReactGA.send({
        hitType: "pageview",
        page: window.location.pathname,
      })
    }
  }, [])
  const handleSearch = async () => {
    try {
      setIsLoading(true)

      const response = await fetch(`${baseUrl}/find-lego`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemCode: e }),
      })

      const data = await response.json()

      localStorage.setItem("SearchValue", e)
      if (data.message === "SUCCESS") {
        navigation(`/product/`, {
          state: { data, e },
        })
      } else {
        open(true)
        setE("")
        // alert("Could not find the LEGO you are looking for.")
      }
    } catch {
      open(true)
      // alert("Could not find the LEGO you are looking for.")
    } finally {
      setIsLoading(false) // Set loading state back to false
    }
  }
  const handleInputChange = (event) => {
    const inputValue = event.target.value
    const numericValue = inputValue.replace(/\D/g, "") // Remove non-digit characters

    setE(numericValue)
  }

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSearch()
    }
  }
  const isDesktopOrLaptop = useMediaQuery({
    query: "(min-width: 1224px)",
  })
  return (
    <div>
      <Helmet>
        <title>Buy & Sell New LEGO Sets | Lego 2 Sell</title>
        <meta
          name="description"
          content="Sell your new LEGO sets for cash with LEGO2SELL.com, the original online LEGO Sets marketplace. Get quick payments and up to £2.49 for postage..."
        />
        <meta
          name="keywords"
          content="LEGO sets, new LEGO, sell LEGO, LEGO2SELL, LEGO marketplace"
        />
      </Helmet>
      {/* <div className="h-[87.6vh] lg:h-[85.6vh]"> */}
      <div className="">
        <div className="">
          <div className="">
            <div className="">
              <div className="flex items-center justify-center flex-col">
                <div className="mt-12">
                  <img
                    className="w-full object-contain h-[230px] lg:h-[290px] py-4"
                    src="/Images/Logo-min.png"
                    alt="search-img"
                    fetchpriority="high"
                  />
                </div>
                  <Modal
                  size="lg"
                  opened={opened}
                  onClose={close}
                  title="Error"
                  centered
                  >
                  <div className="flex items-center justify-center">
                    <img
                      className="w-3/4"
                      src="/Images/SearchErrorMessage.jpg"
                      alt=""
                      loading="lazy"
                    />
                  </div>
                  <div className="font-semibold mt-6 text-xl md:text-base order-1 md:order-2">
                    Could not find the LEGO® you are looking for.
                  </div>
                  <p className="text-gray-400 text-base font-normal py-4">
                    We apologize for the inconvenience, but the LEGO® set you
                    are searching for is currently unavailable on our website.
                    Please try searching for a different LEGO® set or check back
                    later as our inventory is regularly updated. If you have any
                    further questions or need assistance, please feel free to
                    contact our customer support team. Thank you for your
                    understanding.
                  </p>
                  {/* Modal content */}
                </Modal>

                <div className="w-full px-6 flex items-center justify-center">
                  <input
                    placeholder="Enter LEGO® Set Code here"
                    // disabled={e?.length === 5}
                    value={e}
                    onKeyPress={handleKeyPress}
                    onChange={handleInputChange}
                    type="text"
                    className="border px-6 py-4 w-full md:w-[50%] text-xl font-medium  rounded-2xl"
                    required
                  />
                </div>
                <button type="submit" onClick={handleSearch}>
                  <img
                    className="_search-btn_hj7zo_15"
                    src="/Images/search-img-6ce3ac56.png"
                    alt="search-btn"
                    loading="lazy"
                  />
                </button>
                <br />
                <br />

                <Tooltip
                  color="blue"
                  multiline
                  opened={!isDesktopOrLaptop ? opened1 : null}
                  width={isDesktopOrLaptop ? 480 : 280}
                  withArrow
                  transitionProps={{ duration: 200 }}
                  label="To search your LEGO® set just type in the LEGO® ID code found on all LEGO® sets and hit enter or the search button. (Example: 77941)"
                >
                <button
                    variant="outline"
                    onClick={() => setOpened((o) => !o)}
                    className={`${
                      opened1 ? "mt-16 lg:mt-0 " : ""
                    }text-base  font-medium text-gray-400`}
                >Search help</button>
                </Tooltip>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
