import React, { useEffect, useMemo, useState } from "react";
import { Modal, Select } from "@mantine/core";

import AdminOffer from "../componet/AdminOffer";
import { useNavigate } from "react-router-dom";
import CryptoJS from "crypto-js";
import baseUrl from "../context/baseUrl";
import AdminDiscount from "../componet/AdminDiscount";
import axios from "axios";
import moment from "moment";

const CustomerDiscounts = () => {
  const storedUserId = localStorage.getItem("userId");

  const [data, setData] = useState([]);
  const [discounts, setDiscounts] = useState();
  const [createDiscountModal, setCreateDiscountModal] = useState(false);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [startTimeH, setStartTimeH] = useState(0);
  const [startTimeM, setStartTimeM] = useState(0);
  const [endTimeH, setEndTimeH] = useState(0);
  const [endTimeM, setEndTimeM] = useState(0);
  const [maxUses, setMaxUses] = useState(null);
  const [minAmount, setMinAmount] = useState(null);
  const [usePerPerson, setUsePerPerson] = useState(false);
  const [status, setStatus] = useState("Active");
  const [discountNote, setDiscountNote] = useState("");
  const [title, setTitle] = useState("Add");
  const [docId, setDocId] = useState("");

  const [validationError, setValidationError] = useState("");
  const [nameError, setNameError] = useState("");
  const [codeError, setCodeError] = useState("");
  const [amountError, setAmountError] = useState("");
  const [startDateError, setStartDateError] = useState("");
  const [endDateError, setEndDateError] = useState("");
  const [maxUsesError, setMaxUsesError] = useState("");
  const [minAmountError, setMinAmountError] = useState("");
  const [usePerPersonError, setUsePerPersonError] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [discountNoteError, setDiscountNoteError] = useState("");
  const [amountType, setAmountType] = useState("");

  const validationErr = useMemo(() => validationError, [validationError]);
  const validateDiscountForm = () => {
    let hasErrors = false;

    if (!name.trim()) {
      setNameError("Name is required.");
      hasErrors = true;
    } else {
      setNameError("");
    }

    if (!code.trim()) {
      setCodeError("Code is required.");
      hasErrors = true;
    } else {
      setCodeError("");
    }

    if (amount <= 0) {
      setAmountError("Amount must be greater than 0.");
      hasErrors = true;
    } else {
      setAmountError("");
    }

    if (!startDate) {
      setStartDateError("Start Date is required.");
      hasErrors = true;
    } else {
      setStartDateError("");
    }

    if (!endDate) {
      setEndDateError("End Date is required.");
      hasErrors = true;
    } else {
      setEndDateError("");
    }

    if (maxUses <= 0) {
      setMaxUsesError("Max Uses must be greater than or equal to 0.");
      hasErrors = true;
    } else {
      setMaxUsesError("");
    }

    if (minAmount <= 0) {
      setMinAmountError("Min Amount must be greater than or equal to 0.");
      hasErrors = true;
    } else {
      setMinAmountError("");
    }

    // Set overall validation error if there are any errors
    setValidationError(hasErrors ? "error" : "");

    // Return null if no errors, otherwise return "error"
    return hasErrors ? "error" : null;
  };

  const addDiscount = async () => {
    let error = validateDiscountForm();
    // setTimeout(async () => {
    console.log(error, "memo wlaa error");
    if (error === "error") {
      return;
    }
    let finalAmount;
    if (amountType === "%") {
      finalAmount = amount + "%";
    } else {
      finalAmount = amount;
    }
    const parsedDate = moment(startDate, "YYYY-MM-DD");

    const formattedStartDate = parsedDate.format("MM/DD/YYYY");
    const parsedDate1 = moment(endDate, "YYYY-MM-DD");

    const formattedEndDate = parsedDate1.format("MM/DD/YYYY");
    let reqData = {
      name: name,
      code: code,
      amount: finalAmount,
      startDate: formattedStartDate,
      endDate: formattedEndDate,
      minAmount: minAmount,
      maxUses: maxUses,
      useOnce: usePerPerson,
      status: status,
      discountNote: discountNote,
      adminId: storedUserId,
      docId: docId,
      startTimeH: startTimeH,
      startTimeM: startTimeM,
      endTimeH: endTimeH,
      endTimeM: endTimeM,
    };

    try {
      let res = await axios.post(`${baseUrl}/addDiscounts/`, reqData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      closeModalFun();
      console.log(res.data.data, "res from the discount");

      let updatedData = data.some((item, index) => {
        return item._id == res.data.data._id;
      });
      if (updatedData) {
        let filterUpdate = data.map((item, index) => {
          if (item._id == res.data.data._id) {
            return res.data.data;
          } else {
            return item;
          }
        });
        setData(filterUpdate);
      } else {
        setData([...data, res.data.data]);
      }
    } catch (error) {
      console.log("Error from the discount", error);
    }
    // }, 1000);
  };

  const getDiscounts = async () => {
    try {
      const response = await axios.get(
        `${baseUrl}/getDiscounts/${storedUserId}/`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // Assuming the response contains a data property with discounts
      const discounts = response.data.data;

      console.log("Discounts:", discounts);
      setData(discounts);

      return discounts;
    } catch (error) {
      console.error("Error fetching discounts:", error.response || error);
      throw error; // You may want to handle errors based on your application's needs
    }
  };

  const updateDiscount = async (item) => {
    try {
      console.log(item, "item to update");
      setDocId(item._id);
      setTitle("Update");
      setCreateDiscountModal(true);
      setName(item.name);
      setCode(item.code);
      if (item.amount.charAt(item.amount.length - 1).toString() === "%") {
        console.log(item.amount.charAt(item.amount.length - 1), "last element");
        setAmount(+item.amount.slice(0, -1));
      } else {
        setAmount(+item.amount);
      }
      setStartDate(moment(item?.startDate).format("YYYY-MM-DD"));
      setEndDate(moment(item?.endDate).format("YYYY-MM-DD"));
      setMaxUses(item.maxUses);
      setMinAmount(item.minAmount);
      setUsePerPerson(item.useOnce);
      setStatus(item.status);
      setDiscountNote(item.discountNote);
      setStartTimeH(item.startTimeH);
      setStartTimeM(item.startTimeM);
      setEndTimeH(item.endTimeH);
      setEndTimeM(item.endTimeM);
    } catch (error) {
      console.log(error);
    }
  };

  const closeModalFun = () => {
    setCreateDiscountModal(false);
    setTitle("Add");
    setName("");
    setCode("");
    setAmount("");
    setStartDate("");
    setEndDate("");
    setMaxUses(null);
    setMinAmount(null);
    setUsePerPerson(null);
    setStatus("");
    setDiscountNote("");
    setStartTimeH(0);
    setStartTimeM(0);
    setEndTimeH(0);
    setEndTimeM(0);
  };
  const fetchInfo = () => {
    // Data to encrypt
    const sensitiveData = "frontend";
    // Encryption key (must be a secret)
    const encryptionKey = "legotwosell";
    // Encrypt the data
    const encryptedData = CryptoJS.AES.encrypt(
      sensitiveData,
      encryptionKey
    ).toString();

    return fetch(`${baseUrl}/GetorderValue`, {
      headers: {
        "Content-Type": "application/json",
        source: encryptedData,
      },
    })
      .then((res) => res.json())
      .then((d) => setData(d.orders));
  };
  useEffect(() => {
    getDiscounts();
  }, []);
  // console.log(data, "lego")
  const [SearchValue, setSearchValue] = useState();
  const navigation = useNavigate();
  return (
    <div className="">
      <div className="xl:px-44 px-6 md:px-22 py-4 my-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigation("/AdminDashboard")}
            className="px-6 py-2 rounded-xl bg-blue-500 text-white font-medium"
          >
            Back
          </button>
          <h4 className="lg:text-2xl text-sm pl-6 font-semibold">
            Customer Discounts
          </h4>
          <button
            onClick={() => setCreateDiscountModal(true)}
            className="px-6 py-0.5 lg:py-2 text-sm lg:text-base rounded-xl bg-blue-500 text-white font-medium"
          >
            Create Discount
          </button>
        </div>
        <div className="mt-4 mb-6">
          <h3 className="text-lg font-bold py-2">Search Discounts</h3>
          <input
            placeholder="Search user Discounts"
            className="border px-6 rounded-xl w-full py-4"
            type="text"
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </div>
        {data
          ?.filter((value) => {
            // console.log(value, "lol")
            const { code, name } = value;
            const offerId = String(code || ""); // Convert offerId to a string

            if (!SearchValue) {
              return true; // If no search value, show all data
            }

            const searchLower = SearchValue?.toLowerCase(); // Convert search value to lowercase
            // const firstName = value?.user?.Mydetails[0].firstName || "";
            // const emailLower = value?.user?.email?.toLowerCase();

            return (
              offerId.includes(searchLower) ||
              name?.toLowerCase().includes(searchLower)
            );
          })
          .map((value, index) => {
            if (value?.Status !== "Paid" && value?.Status !== "Rejected") {
              return (
                <AdminDiscount
                  order={value?.code}
                  index={index}
                  key={value._id}
                  SearchValue={SearchValue}
                  items={value}
                  updateDiscount={updateDiscount}
                  setData={setData}
                  data={data}
                />
              );
            }
            return null;
          })}

        {/* {data
          ?.filter((value) => {
            console.log("demo888", value.Order.length === 0)
            return SearchValue
              ? value?._id?.includes(SearchValue)
                ? value?._id
                : value?.Mydetails[0]?.firstName?.includes(SearchValue)
                ? value?.Mydetails[0]?.firstName
                : null
              : value + " " + value?.email && value.Order.length !== 0
          })
          .reverse()
          .map((value, index) => {
            console.log("lego", value.Order)

            var userID = value?._id
            return (
              <>
                <AdminOffer
                  index={index}
                  key={value._id}
                  SearchValue={SearchValue}
                  data={value.Mydetails}
                  items={value}
                />
              </>
            )
          })} */}
      </div>
      <Modal
        size={"xl"}
        onClose={() => {
          closeModalFun();
        }}
        opened={createDiscountModal}
      >
        <div className="flex flex-col gap-[50px]  bg-gray-100 py-[60px] px-[60px] max-sm:px-[5px] rounded-[20px]">
          <p className="text-center text-[24px] font-bold ">
            {title} Discount Detail
          </p>
          <div className="flex justify-start gap-[100px] max-md:gap-[50px] max-sm:gap-[25px] items-center max-lg:items-start">
            <h4 className="text-[20px] font-[500] w-[110px]">Name:</h4>
            <div>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder=""
                className="bg-white focus:outline-none p-1 border-2 w-[400px] max-md:w-[200px] max-sm:w-[100px]  border-gray-300 rounded-[4px]"
                type="text"
              />
              <p className="text-gray-500 text-[14px] w-[400px] max-md:w-[300px] max-sm:w-[200px] max-lg:w-[300px] max-sm:w-[200px]">
                The name of discount. user will see this on checkout
              </p>
              {nameError && (
                <div className="text-red-600 text-sm">{nameError}</div>
              )}
            </div>
          </div>
          <div className="flex justify-start gap-[100px] max-md:gap-[25px] items-center max-lg:items-start">
            <h4 className="text-[20px] font-[500] w-[110px]">Code:</h4>
            <div>
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder=""
                className="bg-white focus:outline-none p-1 border-2 w-[400px] max-md:w-[200px] max-sm:w-[100px]  border-gray-300 rounded-[4px]"
                type="text"
              />
              <p className="text-gray-500 text-[14px] w-[400px] max-md:w-[300px] max-sm:w-[200px]">
                The code customers will enter to apply this Discount.
              </p>
              {codeError && (
                <div className="text-red-600 text-sm">{codeError}</div>
              )}
            </div>
          </div>
          <div className="flex justify-start gap-[100px] max-md:gap-[25px] items-center max-lg:items-start">
            <h4 className="text-[20px] font-[500] w-[110px]">Amount:</h4>
            <div className="">
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder=""
                className="bg-white focus:outline-none p-1 border-2 w-[200px] max-md:w-[145px] max-sm:w-[60px] border-gray-300 rounded-[4px]"
                type="number"
              />
              <select
                name="%"
                id=""
                value={amountType}
                onChange={(e) => setAmountType(e.target.value)}
              >
                <option value={"%"}>%</option>
                <option value={""}>Num</option>
              </select>
              <p className="text-gray-500 text-[14px] w-[400px] max-md:w-[300px] max-sm:w-[200px]">
                The amount as a percentage or flat rate. Cannot be left blank.
              </p>
              {amountError && (
                <div className="text-red-600 text-sm">{amountError}</div>
              )}
            </div>
          </div>
          <div className="flex justify-start gap-[127px] max-md:gap-[25px] items-center max-lg:items-start ">
            <h4 className="text-[20px] font-[500] w-[110px] whitespace-nowrap">
              Start date:
            </h4>
            <div>
              <div className="flex max-md:flex-wrap gap-1">
                <input
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  placeholder="YYYY-MM-DD"
                  className="bg-white focus:outline-none p-1 border-2 w-[150px] max-md:w-[200px] max-sm:w-[100px]  border-gray-300 rounded-[4px]"
                  type="text"
                />
                <input
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue < 24) {
                      setStartTimeH(e.target.value);
                    }
                  }}
                  value={startTimeH}
                  placeholder="hh"
                  className="bg-white focus:outline-none p-1 border-2 w-[150px] max-md:w-[200px] max-sm:w-[100px]  border-gray-300 rounded-[4px]"
                  type="number"
                  max={24}
                />
                <input
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue < 60) {
                      setStartTimeM(e.target.value);
                    }
                  }}
                  value={startTimeM}
                  placeholder="mm"
                  className="bg-white focus:outline-none p-1 border-2 w-[150px] max-md:w-[200px] max-sm:w-[100px]  border-gray-300 rounded-[4px]"
                  type="number"
                  max={60}
                />
              </div>
              <p className="text-gray-500 text-[14px] w-[400px] max-md:w-[300px] max-sm:w-[200px]">
                Put the date and time. this discount will start on. Leave blank
                for no start date.
              </p>
              {startDateError && (
                <div className="text-red-600 text-sm">{startDateError}</div>
              )}
            </div>
          </div>
          <div className="flex justify-start gap-[85px] max-md:gap-[25px] items-center max-lg:items-start">
            <h4 className="text-[20px] font-[500] w-[110px] whitespace-nowrap max-sm:whitespace-normal">
              Expiration date:
            </h4>
            <div>
              <div className="flex max-md:flex-wrap gap-1">
                <input
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  placeholder="YYYY-MM-DD"
                  className="bg-white focus:outline-none p-1 border-2 w-[150px] max-md:w-[200px] max-sm:w-[100px]  border-gray-300 rounded-[4px]"
                  type="text"
                />
                <input
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue < 24) {
                      setEndTimeH(e.target.value);
                    }
                  }}
                  value={endTimeH}
                  placeholder="hh"
                  className="bg-white focus:outline-none p-1 border-2 w-[150px] max-md:w-[200px] max-sm:w-[100px]  border-gray-300 rounded-[4px]"
                  type="number"
                  max={24}
                />
                <input
                  onChange={(e) => {
                    const newValue = e.target.value;
                    if (newValue < 60) {
                      setEndTimeM(e.target.value);
                    }
                  }}
                  value={endTimeM}
                  placeholder="mm"
                  className="bg-white focus:outline-none p-1 border-2 w-[150px] max-md:w-[200px] max-sm:w-[100px]  border-gray-300 rounded-[4px]"
                  type="number"
                  max={60}
                />
              </div>

              <p className="text-gray-500 text-[14px] w-[400px] max-md:w-[300px] max-sm:w-[200px]">
                Put the date and time. this discount will expire on. leave blank
                to never expire.
              </p>
              {endDateError && (
                <div className="text-red-600 text-sm">{endDateError}</div>
              )}
            </div>
          </div>
          <div className="flex justify-start gap-[100px] max-md:gap-[25px] items-center max-lg:items-start">
            <h4 className="text-[20px] font-[500] w-[110px] whitespace-nowrap">
              Min Amount:
            </h4>
            <div>
              <input
                value={minAmount}
                onChange={(e) => setMinAmount(e.target.value)}
                placeholder=""
                className="bg-white focus:outline-none p-1 border-2 w-[400px] max-md:w-[200px] max-sm:w-[100px]  border-gray-300 rounded-[4px]"
                type="number"
              />
              <p className="text-gray-500 text-[14px] w-[400px] max-md:w-[300px] max-sm:w-[200px]">
                The minimum subtotal of item price in a cart before this
                discussion may be applied
              </p>
              {minAmountError != "" && (
                <div className="text-red-600 text-sm">{minAmountError}</div>
              )}
            </div>
          </div>
          <div className="flex justify-start gap-[100px] max-md:gap-[25px] items-center max-lg:items-start">
            <h4 className="text-[20px] font-[500] w-[110px] whitespace-nowrap">
              Max Uses:
            </h4>
            <div>
              <input
                value={maxUses}
                onChange={(e) => setMaxUses(e.target.value)}
                placeholder=""
                className="bg-white focus:outline-none p-1 border-2 w-[400px] max-md:w-[200px] max-sm:w-[100px]  border-gray-300 rounded-[4px]"
                type="number"
              />
              <p className="text-gray-500 text-[14px] w-[400px] max-md:w-[300px] max-sm:w-[200px]">
                The max number of times this discount can be used
              </p>
              {maxUsesError != "" && (
                <div className="text-red-600 text-sm">{maxUsesError}</div>
              )}
            </div>
          </div>
          <div className="flex justify-start gap-[100px] max-md:gap-[25px] items-center max-lg:items-start">
            <h4 className="text-[20px] font-[500] w-[110px] whitespace-nowrap">
              Use Once:
            </h4>
            <div className="flex items-center">
              <input
                checked={usePerPerson}
                value={usePerPerson}
                onChange={() => setUsePerPerson(!usePerPerson)}
                className="bg-white focus:outline-none p-1 border-2  h-[24px] w-[24px] border-gray-300 rounded-[4px]"
                type="checkbox"
              />
              <p className="text-gray-500 text-[14px] ml-1">
                Prevent customers from using this discount more than once.
              </p>
              {usePerPersonError && (
                <div className="text-red-600 text-sm">{usePerPersonError}</div>
              )}
            </div>
          </div>
          <div className="flex justify-start gap-[100px] max-md:gap-[25px] items-center max-lg:items-start">
            <h4 className="text-[20px] font-[500] w-[110px] whitespace-nowrap">
              Status
            </h4>
            <div>
              <select
                value={status}
                name="status"
                id="status"
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Not Active">Not Active</option>
              </select>
              <p className="text-gray-500 text-[14px] w-[400px] max-md:w-[300px] max-sm:w-[200px]">
                The status of this discount code
              </p>
              {statusError && (
                <div className="text-red-600 text-sm">{statusError}</div>
              )}
            </div>
          </div>
          <div className="flex justify-start gap-[100px] max-md:gap-[25px] items-center max-lg:items-start">
            <h4 className="text-[20px] font-[500] w-[110px] whitespace-nowrap">
              Discount Notes:
            </h4>
            <div className="w-full">
              <textarea
                value={discountNote}
                onChange={(e) => setDiscountNote(e.target.value)}
                rows={4}
                className="bg-whiten max-sm:ml-2 w-[100%] focus:outline-none p-1 border-2  border-gray-300 rounded-[4px]"
                type="text"
              />
              {discountNoteError && (
                <div className="text-red-600  text-sm">{discountNoteError}</div>
              )}
            </div>
          </div>
          <div>
            <button
              onClick={() => addDiscount()}
              className="text-white bg-blue-800 px-[10px] py-[5px] rounded-[4px]"
            >
              {" "}
              {title} Discount
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default CustomerDiscounts;
