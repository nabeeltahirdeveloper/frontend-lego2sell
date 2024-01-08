import React, { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import "./App.css"
import { Button, Loader, Modal, Tooltip } from "@mantine/core"
import { useDisclosure } from "@mantine/hooks"
import { Helmet } from "react-helmet"
import { useMediaQuery } from "react-responsive"
import ReactGA from "react-ga4"
import baseUrl from "./context/baseUrl"
import axios from "axios"
const App = () => {
  const [e, setE] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [opened, { open, close }] = useDisclosure(false)
  const navigation = useNavigate()

  const [opened1, setOpened] = useState(false)

  const [topFourBlogs, setTopFourBlogs] = useState([])
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


  useEffect(() => {
    const apiUrl = baseUrl + "/admin/api/blog/";
    axios
      .get(apiUrl, {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Accept: "application/json",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization, Accept",
          "Access-Control-Allow-Credentials": "true",
          "Access-Control-Max-Age": "86400",
          "Access-Control-Expose-Headers":
            "Content-Type, Authorization, Accept",
        },
      })
      .then((response) => {
        setTopFourBlogs(response.data.data.slice(0, 4));
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }, []);


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
                    className={`${opened1 ? "mt-16 lg:mt-0 " : ""
                      }text-base  font-medium text-gray-400`}
                  >Search help</button>
                </Tooltip>
              </div>
              <div className="flex mt-5 w-full justify-center flex-col items-center">
                <p style={{

                  fontWeight: 'bold',
                  fontSize: '1.5rem'
                }}>The best place to sell new <span style={{
                  color: '#428ABD',
                }}>

                    LEGO®&nbsp;
                  </span>
                  sets online.
                </p>
                <p style={{

                  fontWeight: 'bold',
                  fontSize: '1.5rem'
                }}>
                  Turn your sets to cash in 4 easy steps…
                </p>

                <img
                  className="w-1/4 mt-3"
                  src="/Images/legoYoutubeImage.png"
                  alt=""
                  loading="lazy"
                />
              </div>

              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '3rem',
                  // flexDirection: 'column'
                  marginLeft: 50,
                  marginRight: 50,
                  gap: 50,
                }}>
                  <div className="w-1/4 flex flex-col items-center justify-center">

                    <img
                      className="w-2/4"
                      src="/Images/LEGO search alt.png"
                      alt=""
                      loading="lazy"
                    />
                    <h2>
                      <span style={{
                        color: 'red',
                      }}>1.</span> Search your LEGO® Code
                    </h2>
                    <p
                      className="text-center"
                    >Pop your LEGO bricks in a bag and weigh them. Then choose the closest weight on our website or app.</p>
                  </div>
                  <div>
                    <img
                      src="/Images/Blue Aroow Alt flipped.png"
                      style={{
                        width: 100,
                        marginTop: -80,
                        marginLeft: -50,
                        position: 'absolute',
                      }}
                      alt=""
                      loading="lazy" />
                  </div>
                  <div className="w-1/4 flex flex-col items-center justify-center">

                    <img
                      className="w-2/4"
                      src="/Images/iphone Payments alt.webp"
                      alt=""
                      loading="lazy"
                    />
                    <h2>
                      <span style={{
                        color: 'red',
                      }}>2.</span> Get an instant offer
                    </h2>
                    <p
                      className="text-center"
                    >We’ll offer you a great price for your new LEGO® sets! Simply accept and checkout to continue.</p>
                  </div>
                  <div>
                    <img
                      src="/Images/Blue Aroow Alt.png"
                      style={{
                        width: 100,
                        marginTop: -30,
                        marginLeft: -50,
                        position: 'absolute',
                      }}
                      alt=""
                      loading="lazy" />
                  </div>
                  <div className="w-1/4 flex flex-col items-center justify-center">

                    <img
                      className="w-2/4"
                      src="/Images/Lego Parcel alt.webp"
                      alt=""
                      loading="lazy"
                    />
                    <h2>
                      <span style={{
                        color: 'red',
                      }}>3.</span> Post it to us
                    </h2>
                    <p
                      className="text-center"
                    >Package up your LEGO® and take it to your local postage drop off point and we will pay you up to £2.49 for all accepted sets.</p>
                  </div>
                  <div>
                    <img
                      src="/Images/Blue Aroow Alt flipped.png"
                      style={{
                        width: 100,
                        marginTop: -80,
                        marginLeft: -50,
                        position: 'absolute',
                      }}
                      alt=""
                      loading="lazy" />
                  </div>
                  <div className="w-1/4 flex flex-col items-center justify-center">

                    <img
                      className="w-2/4"
                      src="/Images/LEGO VIP Wallet alt.webp"
                      alt=""
                      loading="lazy"
                    />
                    <h2>
                      <span style={{
                        color: 'red',
                      }}>4.</span> Get paid
                    </h2>
                    <p
                      className="text-center"
                    >Choose either bank transfer or PayPal and we’ll send your money the same day we receive and check your bricks!</p>
                  </div>


                </div>

                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  marginTop: '3rem',
                  // flexDirection: 'column'
                  marginLeft: 50,
                  marginRight: 50,
                  gap: 50,
                  marginBottom: '7rem',

                }}>
                  <h2 style={{
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    wordSpacing: '0.5rem',

                  }}>
                    Why Sell Your LEGO® With <span
                      style={{
                        color: "#ff3131"
                      }}
                    >Lego</span><span
                      style={{
                        color: '#1cbc7c'
                      }}
                    >2</span><span
                      style={{
                        color: '#4a71f6'
                      }}
                    >Sell</span><span
                      style={{
                        color: '#febf00'
                      }}
                    >?</span>

                  </h2>
                  <div>
                    <img src="/Images/downArrow.png" alt=""
                      style={{
                        width: 100,
                        marginLeft: -120,
                        position: 'absolute',

                      }}
                    />
                  </div>
                </div>

                <div style={{
                  display: 'flex',
                  marginLeft: 50,
                  marginRight: 50,
                }}>
                  <div className="leftSection w-1/2 mr-5">
                    <h2 style={{
                      fontSize: '1.6rem',
                      marginBottom: 20,
                    }}>
                      We are the UK’s first and only dedicated Buyer of New LEGO® Sets!

                    </h2>
                    <p>
                      We have a unique data engine that searches multiple price databases of New LEGO® being sold over the last 6 months to give you the best second hand buy price on the market for your sets.
                      <br />
                      <br />
                      With our cloud database that is updated daily we can give you instant current market value quotes for your new LEGO® sets.
                      <br />
                      <br />
                      And if our AI engine can not give you are price just email Info@lego2sell.com for a bespoke quote.
                    </p>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                    }}>

                      <div className="button" style={{
                        marginLeft: -20,
                        marginTop: 20,
                      }}>
                        <Button
                          className="w-full"
                          variant="filled"

                          color="red"
                          size="lg"
                          radius="xl"
                          style={{
                            background: 'red ',
                          }}
                        >
                          Sell LEGO®
                        </Button>
                      </div>


                      <img src="/Images/Duplo Bricks alt.png" alt=""

                        style={{
                          width: 100,

                        }}
                      />


                    </div>


                  </div>


                  <div className="rightSection w-1/2 flex gap-5">

                    <div className="card1-column w-1/3">
                      
                        <div className="card1" style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingLeft: 5,
                          paddingRight: 5,
                          background: '#EAFED1',
                          paddingBottom: 20,
                        }}>
                          <div className="card1-image" style={{
                            display: 'flex',
                            alignItems: 'center',
                          }}>
                            <img src="/Images/LEGO POINTS alt.png" alt=""
                            style={{
                              width: 80,
                            
                            }}
                            />
                            <h3 className="card1-title" style={{
                              fontSize: '0.7rem',
                            }}>High payouts</h3>
                          </div>
                            <p className="card1-body text-center">
                            We pride ourselves on offering some of the highest price for your LEGO® Sets online.
                            </p>
                        </div>
                        <div className="card1" style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingLeft: 5,
                          paddingRight: 5,
                          background: '#CFEBFA',
                          paddingBottom: 20,
                          marginTop: 20,
                        }}>
                          <div className="card1-image" style={{
                            display: 'flex',
                            alignItems: 'self-end',
                            gap: 10,
                            marginTop: 10,

                          }}>
                            <img src="/Images/LEGO REd Parcel Icon alt.png" alt=""
                            style={{
                              width: 30,
                            
                            }}
                            />
                            <h3 className="card1-title" style={{
                              fontSize: '0.7rem',
                            }}>Postage refund</h3>
                          </div>
                            <p className="card1-body text-center">
                            We refund you up to £2.49 to cover the cost of postage
                            </p>
                        </div>
                

                    </div>
                    <div className="card2-column w-1/3"
                    style={{
                      marginTop: 30,
                    }}
                    >
                      
                        <div className="card1" style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingLeft: 5,
                          paddingRight: 5,
                          background: '#F7BBC0',
                          paddingBottom: 20,
                        }}>
                          <div className="card1-image" style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10
                          }}>
                            <img src="/Images/Lego Clock alt.png" alt=""
                            style={{
                              width: 50,
                            
                            }}
                            />
                            <h3 className="card1-title" style={{
                              fontSize: '0.7rem',
                            }}>Next & Same
                            <br />
                            day payments
                            </h3>
                          </div>
                            <p className="card1-body text-center">
                            We pride ourselves on offering some of the highest price for your LEGO® Sets online.
                            </p>
                        </div>
                        <div className="card1" style={{
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'center',
                          alignItems: 'center',
                          paddingLeft: 5,
                          paddingRight: 5,
                          background: '#FEF8DE',
                          paddingBottom: 20,
                          marginTop: 20,
                        }}>
                          <div className="card1-image" style={{
                            display: 'flex',
                            alignItems: 'self-end',
                            gap: 10,
                            marginTop: 10,

                          }}>
                            <img src="/Images/happy LEGO face alt.png" alt=""
                            style={{
                              width: 30,
                            
                            }}
                            />
                            <h3 className="card1-title" style={{
                              fontSize: '0.7rem',
                            }}>Totally hassle-free</h3>
                          </div>
                            <p className="card1-body text-center">
                            Just accept the offer
                            <ul
                            style={{
                              listStyleType:'disc',
                              marginTop: 10,
                              fontWeight: 'bold',
                            }}
                            >
                              <li>Box it</li>
                              <li>Send it</li>
                              <li>Get paid</li>
                            </ul>
As easy as that!

                            </p>
                        </div>
                

                    </div>

                    <div className="third-col w-1/3 flex items-center">

                      <img src="/Images/LEGO bricks alt.png" style={{
                        width: "70%",

                      
                      }} alt="" />

                    </div>

                  </div>
                </div>


               <div className="blogs"
               style={{
                backgroundColor: '#EAFED1',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'column',
                marginLeft: 50,
                marginRight: 50,
                marginTop: 50,
                marginBottom: 50,
                borderRadius: 10,

               }}
               >
                  <h2 style={{
                    fontWeight: 'bold',
                    fontSize: '1.5rem',
                    wordSpacing: '0.5rem',

                  }}>
                    News And Reviews

                  </h2>
                  <div className="blogs-container flex justify-center gap-5 "
                  style={{
                    backgroundColor: '#fff',
                    marginTop: 20,
                    marginBottom: 20,
                    marginLeft: 80,
                    marginRight: 80,
                  }}
                  >
                    {
                      topFourBlogs.map((blog, index) => (
                        <div className="blog-card w-1/4 flex flex-col items-center" key={index}>
                          <div className="" style={{
                            height: 100,
                          }}>
                            <img src={blog.image} alt=""
                            
                            style={{
                              width: 100
                            }}
                            />
                          </div>
                          <div className="blog-content">
                            <h3
                            style={{
                              fontWeight: 'bold',
                              fontSize: '.7rem',
                              marginTop: 10,
                            }}


                            >{blog.title}</h3>
                          </div>
                        </div>
                      ))
                    }

                  </div>
                    <div className="readNow"
                    style={{
                      alignSelf: 'flex-start',
                      marginLeft: 80,
                    }}
                    > 
                      <Link to="/blogs">
                        <Button
                          className="w-full"
                          variant="filled"

                          color="red"
                          size="sm"
                          radius="xl"
                          style={{
                            background: '#4AB5FE ',
                          }}
                        >
                          Read Now
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" class="w-6 h-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
</svg>

                        </Button>
                      </Link>
                    </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
