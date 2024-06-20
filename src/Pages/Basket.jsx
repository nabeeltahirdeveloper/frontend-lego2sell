import { Loader, Modal } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import { Link, useLocation, useNavigate } from "react-router-dom";
import baseUrl from "../context/baseUrl";
import axios from "axios";
const Basket = () => {
  const location = useLocation();
  const navigation = useNavigate();
  // const data = location.state && location.state.data
  const SearchValue = location.state.SearchValue;
  const condition = location.state.condition;
  const productCondition = location.state.productCondition;
  const [price, setPrice] = useState(null);
  const [discount, setDiscount] = useState(0);
  const [discountInPercent, setDiscountInPercent] = useState(0);
  const [inPercent, setInPercent] = useState(false);
  const [codeInputVisible, setCodeInputVisible] = useState(false);
  // console.log("price", price)
  const storedUserId = localStorage.getItem("userId");
  const [data, setData] = useState();
  const route = location.pathname;
  const [opened, { open, close }] = useDisclosure(false);
  const [inputCode, setInputCode] = useState("");
  const [vouceherErr, setVoucherErr] = useState("");
  const [vouceherAdded, setVoucherAdded] = useState("");
  const [quantity, setQuantity] = useState(1); // Initialize quantity to 1
  const [totalPrice, setTotalPrice] = useState(null);
  const BasketValue = 1;
  // console.log(data.length)
  useEffect(() => {
    if (price !== null) {
      const newTotalPrice = price * quantity;
      setTotalPrice(newTotalPrice);
      localStorage.setItem("TotalPrice", newTotalPrice.toFixed(2)); // Save total price in local storage
    }
  }, [price, quantity]);
  
  const increaseQuantity = () => {
    setQuantity(quantity + 1);
  };
  
  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };
  
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/find-lego`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemCode: SearchValue }),
        });

        const data = await response.json();
        setData(data);
      } catch (error) {
        // console.log(error)
        // alert("Could not find the LEGO you are looking for.")
      } finally {
        // console.log("Complete")
        // Set loading state back to false
      }
    };

    fetchData(); // Call the fetchData function
  }, [SearchValue]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${baseUrl}/calculate-price`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ itemCode: SearchValue }),
        });

        const priceData = await response.json();
        if (priceData.body.price52 === null) {
          open(true);
          setTimeout(() => {
            navigation("/");
          }, 5000);
        }

        const originalPrice = priceData.body.price.min_price;
        const discountPercentage = condition;
        // const discountPercentage = 0
        const discount = originalPrice * (discountPercentage / 100);
        const discountedPrice = originalPrice - discount;
        console.log(
          priceData,
          "price of item",
          originalPrice,
          "originalPrice",
          discountedPrice,
          "discountedPrice",
          discountPercentage,
          "discountPercentage",
          discount,
          "discount"
        );
        setPrice(discountedPrice);
        // console.log("Discounted price: " + discountedPrice);
        localStorage.setItem("Price", discountedPrice.toFixed(2));
        if (priceData.message === "SUCCESS") {
          setPrice(discountedPrice);
        } else {
          // alert("Could not find the LEGO you are looking for.")
        }
      } catch {
        // alert("Could not find the LEGO you are looking for.")
      }
    };

    fetchData();
  }, [SearchValue]);

  const isDateLess = (startDate) => {
    const currentDate = new Date();
    let startDatee = new Date(startDate);
    console.log("Current Date:", currentDate);
    console.log("Start Date:", startDatee);
    console.log("Is Current Date after Start Date?", currentDate >= startDatee);
    return currentDate >= startDatee;
  };
  const isDateGreater = (endDate) => {
    const currentDate = new Date();
    let endDatee = new Date(endDate);
    console.log("Current Date:", currentDate);
    console.log("End Date:", endDatee);
    console.log("Is Current Date before End Date?", currentDate <= endDatee);
    return currentDate <= endDatee;
  };

  const addUserToUsedByArray = async (discount) => {
    try {
      const response = await axios.put(
        `${baseUrl}/addDiscountUsers/${storedUserId}`,
        {
          docId: discount._id,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      return response;
    } catch (error) {
      console.log(error, "error while adding to usedBy");
    }
  };

  const getDiscounts = async () => {
    try {
      const response = await axios.get(`${baseUrl}/getDiscounts/`, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const discounts = response.data.data;

      let discountVoucher = discounts.filter((discount, index) => {
        if (discount.code.toLowerCase() === inputCode.toLowerCase()) {
          return discount;
        }
      });
      console.log(discountVoucher, "discount voucher");

      if (discountVoucher[0]?.code.toLowerCase() === inputCode.toLowerCase()) {
        if (discountVoucher[0].status === "Active") {
          if (isDateLess(discountVoucher[0].startDate)) {
            if (isDateGreater(discountVoucher[0].endDate)) {
              if (
                discountVoucher[0].maxUses > discountVoucher[0].usedBy.length
              ) {
                if (discountVoucher[0].minAmount <= price) {
                  let alreadyUsed = discountVoucher[0]?.usedBy.some(
                    (item, i) => {
                      return storedUserId == item;
                    }
                  );
                  console.log(
                    alreadyUsed,
                    "already used",
                    discountVoucher[0].useOnce
                  );
                  if (
                    (alreadyUsed === true &&
                      discountVoucher[0].useOnce === false) ||
                    (alreadyUsed === false &&
                      discountVoucher[0].useOnce === true) ||
                    (alreadyUsed === false &&
                      discountVoucher[0].useOnce === false)
                  ) {
                    const response = addUserToUsedByArray(discountVoucher[0]);

                    console.log("response of add voucher", response);
                    if (
                      discountVoucher[0].amount
                        .charAt(discountVoucher[0].amount.length - 1)
                        .toString() === "%"
                    ) {
                      console.log(
                        discountVoucher[0].amount.charAt(
                          discountVoucher[0].amount.length - 1
                        ),
                        "last element"
                      );
                      setDiscountInPercent(discountVoucher[0].amount);
                      let amountToAdd =
                        (price * discountVoucher[0].amount.slice(0, -1)) / 100;
                      localStorage.setItem(
                        "Price",
                        (+price + amountToAdd).toFixed(2)
                      );
                      localStorage.setItem("Discount", amountToAdd.toFixed(2));
                      setInPercent(true);
                      setPrice(+price + amountToAdd);
                      setDiscount(amountToAdd.toFixed(2));
                      setVoucherErr("");

                      console.log(amountToAdd, "amount to add percentage");
                    } else {
                      localStorage.setItem(
                        "Discount",
                        discountVoucher[0].amount
                      );

                      localStorage.setItem(
                        "Price",
                        (+price + +discountVoucher[0].amount).toFixed(2)
                      );

                      setPrice(+price + +discountVoucher[0].amount);
                      setDiscount(+discountVoucher[0].amount);

                      setVoucherErr("");

                      console.log(discountVoucher[0].amount, "amount to add");
                    }
                    setVoucherAdded("congratulates your vouceher has added");
                    setCodeInputVisible(false);
                    setInputCode("");
                    return "congratulates you have added vouceher";
                  } else {
                    setVoucherErr("you have alredy used voucher");
                    return "you have alredy used voucher";
                  }
                }
              } else {
                setVoucherErr("discount limit exceed");
                return "discount limit exceed";
              }
            } else {
              setVoucherErr("voucher date expired");

              return "voucher date expired";
            }
          } else {
            setVoucherErr("voucher date not started yet");

            return "voucher date not started yet";
          }
        } else {
          setVoucherErr("voucher is not active");

          return "Voucher is not Active";
        }
      } else {
        setVoucherErr("no voucher found");

        return "no voucher founded";
      }
    } catch (error) {
      console.error("Error fetching discounts:", error.response || error);
      throw error; // You may want to handle errors based on your application's needs
    }
  };

  useEffect(() => {
    console.log(vouceherErr, "vouvher error aaya");
  }, [vouceherErr]);
  return (
    <div className="lg:px-12 lg:flex-row flex-col px-4 h-[88vh] lg:h-[84vh] space-x-0 lg:space-x-8 items-start flex py-8">
      <Helmet>
        <meta charSet="utf-8" />

        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="keywords" content="Lego, sell, Lego2Sell, Lego 2 Sell" />
        <meta name="viewport" content="width=device-width" />
        <meta
          property="og:description"
          content="Lego2Sell.com is the quick, convenient, and free online platform to sell your LEGO® sets for cash! Whether you have a complete collection or a mixed assortment of lego, we're here to buy. Start selling your LEGO with Lego2Sell.com today!"
        />
      </Helmet>
      <div className="border w-full flex-1 py-6 px-4 lg:px-12  border-gray-300 rounded-xl">
        <Modal
          opened={opened}
          onClose={() => {
            close();
            navigation("/");
          }}
          title="Woops"
          centered
        >
          {/* Modal content */}
          <div className="">
            <img
              className="w-full"
              src="/Images/SearchErrorMessage.jpg"
              alt=""
              loading="lazy"
            />
            <p className="text-gray-400 text-base font-normal py-4">
              We are sorry but we can not seem to find a price for that set! If
              you still want to check please contact{" "}
              <Link
                className="text-blue-500 font-medium"
                to={"mailto:support@lego2sell.com"}
              >
                support@lego2sell.com
              </Link>
            </p>
          </div>
        </Modal>
        <div className="flex flex-col lg:flex-row items-center justify-between">
          <div className="flex flex-col lg:flex-row items-center gap-6">
            <img
              className="lg:w-44 w-[95%] py-2 object-contain  border rounded-lg px-4 border-gray-300 h-full lg:h-32"
              src={data?.body?.image_url}
              alt=""
              style={{ maxHeight: "260px" }}
            />
            <h3 className=" text-xl lg:text-lg font-semibold">
              {data?.body?.name} {SearchValue}
            </h3>
          </div>
          <div className="flex items-center lg:py-0 py-4 gap-6">
            {price ? (
              <h2 className="text-blue-500 text-sm lg:text-xl font-semibold">
                £{price.toFixed(2)}
              </h2>
            ) : (
              <Loader size="xs" />
            )}
            <button onClick={() => navigation("/")}>
              <svg
                width={24}
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                <g
                  id="SVGRepo_tracerCarrier"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                ></g>
                <g id="SVGRepo_iconCarrier">
                  {" "}
                  <g id="Edit / Close_Circle">
                    {" "}
                    <path
                      id="Vector"
                      d="M9 9L11.9999 11.9999M11.9999 11.9999L14.9999 14.9999M11.9999 11.9999L9 14.9999M11.9999 11.9999L14.9999 9M12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12C21 16.9706 16.9706 21 12 21Z"
                      stroke="#000000"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>{" "}
                  </g>{" "}
                </g>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full lg:flex-[0.4]">
        <div className="w-full  mt-10 md:mt-0  md:relative bottom-0 left-0 right-0 z-10">
          <div className="bg-white rounded-2xl  shadow-[0_4px_25px_rgba(38,50,92,0.1)] p-4 px-6 md:p-8 text-center ">
            <h2 className="h4 mb-4 hidden md:block">Offer summary</h2>
            <div className="flex flex-row md:flex-col items-center justify-between">
              <div className="text-green-500 text-xl md:text-5xl font-bold mb-0 md:mb-2 order-2 md:order-1">
                {price ? (
                  <h2> £{(price - discount).toFixed(2)}</h2>
                ) : (
                  <Loader size="xs" />
                )}
              </div>
              <div className="font-bold text-xl md:text-base order-1 md:order-2">
                Item Offer
              </div>
            </div>

            <div className="flex flex-row md:flex-col items-center justify-between">
              <div className="text-green-500 text-xl md:text-3xl font-bold mb-0 md:mb-2 order-2 md:order-1">
              {totalPrice ? (
  <h2 className="text-green-500 text-3xl mt-1  font-semibold">
    £{totalPrice.toFixed(2)}
  </h2>
) : (
  <Loader size="xs" />
)}

              </div>

              <div className="font-bold text-xl md:text-base order-1 md:order-2">
                Total
              </div>
            </div>
            {discount != 0 && (
              <div className="flex flex-row md:flex-col items-center justify-between">
                <div className="font-bold text-xl md:text-base order-1 md:order-2 mb-2">
                Discount
              </div>
                <div className="text-green-500 text-xl md:text-[17px] font-bold mb-0 md:mb-2 order-2 md:order-1">
                  {discount === 0 ? (
                    <h2> £ 0</h2>
                  ) : (
                    <h2>
                      {discountInPercent != 0 ? `${discountInPercent} +` : null}{" "}
                      £{Number(discount).toFixed(2)}
                    </h2>
                  )}
                </div>
                <div className="font-bold text-xl md:text-base order-1 md:order-2"></div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <div className="font-bold text-lg">Add more</div>
  <button onClick={decreaseQuantity} className="text-xl font-bold px-2">-</button>
  <span className="text-xl">{quantity}</span>
  <button onClick={increaseQuantity} className="text-xl font-bold px-2">+</button>
</div>

            <button
              onClick={() => {
                localStorage.setItem("Basket", 1);
                localStorage.setItem("BasketStatus", "start");
                if (storedUserId === "null" || storedUserId === null) {
                  navigation("/login/", {
                    state: { route, productCondition },
                  });
                } else {
                  navigation("/check-your-details", {
                    state: {
                      data,
                      price,
                      SearchValue,
                      discount,
                      condition,
                      productCondition,
                      inPercent,
                      discountInPercent,
                    },
                  });
                }
              }}
              type="button"
              className="hover:scale-[1.05]  transition-all mt-4 w-full text-center lg:ml-0 flex items-center justify-center px-6 lg:px-9 rounded-xl bg-blue-500 hover:bg-white text-white hover:text-black  hover:border font-bold text-[15px] h-[49px] lg:h-[65px]  xl:text-[18px]"
            >
              <p className="hover:text-black w-[100%]">Accept Offer</p>
            </button>
            <h2
              onClick={() => setCodeInputVisible(true)}
              className="h4 mt-4 hidden md:block text-blue-500 cursor-pointer "
            >
              I have a voucher code
            </h2>
            {codeInputVisible && (
              <div className="rounded-[12px] border border-blue-500 p-[6px] flex justify-between">
                <input
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value)}
                  className="focus:outline-none"
                  type="text"
                  placeholder="Enter your code..."
                />
                <p
                  onClick={() => getDiscounts()}
                  className="cursor-pointer rounded-[12px] text-purple-700 text-[32px] bg-purple-50 px-[20px]"
                >
                  +
                </p>
              </div>
            )}
            {vouceherErr && (
              <p className="text-red-600 text-[20px] ">{vouceherErr}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Basket;
