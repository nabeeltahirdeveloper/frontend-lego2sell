import React from "react"

const Footer = ({rounded}) => {
  return (
    <div className="flex mt-auto w-full items-end justify-center" style={{
      background: "#4AB6FF",
      borderRadius: rounded ? "70% 70% 48% 53% / 190% 190% 0% 0% " : "0",
      height: rounded ? "60px" : "auto",
      maxWidth: rounded ? "80%" : "auto",
      margin: rounded ? "0 auto" : "0",
    }}>
      <div className="py-2 text-[10px] lg:text-[12px] text-white lg:text-start text-center  px-6">
        LEGO® is a trademark of the LEGO® Group of companies which does not
        sponsor, authorize or endorse this site
      </div>
    </div>
  )
}

export default Footer
