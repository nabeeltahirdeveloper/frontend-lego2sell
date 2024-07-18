import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./App.css";
import { Button, Loader, Modal, Tooltip } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { Helmet } from "react-helmet";
import { useMediaQuery } from "react-responsive";
import ReactGA from "react-ga4";
import baseUrl from "./context/baseUrl";
import axios from "axios";
import Footer from "./componet/Footer";
const App = () => {


  return (
    <div>
      <Helmet>
        <title>
        Sell Your LEGO® Sets and Make Extra Cash Today! Lego2Sell.com
        </title>
        <meta
          name="description"
          content="Looking to sell your LEGO® sets and make extra cash today? Look no further than Lego2Sell.com! Turn your unused LEGO® sets into money in no time."
        />
        <meta name="keywords" content="LEGO®,LEGO® Set,custom lego sets for sale,best place to sell legos,lego packaging,lego plastic bag sets,lego packaging boxes,lego sustainable packagingLEGO® Sell, sell lego sets,custom lego sets for sale,how to sell legos,sell lego" />

      </Helmet>
      {/* <div className="h-[87.6vh] lg:h-[85.6vh]"> */}
      <h2 style={{
        color: 'red',
        fontSize: '2rem',
        textAlign: 'center',
        marginTop: '100px'
      }}>
        This is totally a fruad site. Please avoid from this site.

      </h2>
    </div>
  );
};

export default App;
