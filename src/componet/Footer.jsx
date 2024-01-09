import React from "react"

const Footer = ({rounded}) => {
  return (
    <div className="flex mt-auto w-full items-end justify-center bg-blue-500" style={{
      borderRadius: rounded ? "51% 49% 47% 53% / 100% 100% 0% 0% " : "0",
      height: rounded ? "100px" : "auto"
    }}>
      <div className="py-2 text-[10px] lg:text-[12px] text-white lg:text-start text-center  px-6">
        LEGO® is a trademark of the LEGO® Group of companies which does not
        sponsor, authorize or endorse this site
      </div>
    </div>
  )
}

export default Footer
