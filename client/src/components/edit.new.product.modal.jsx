import React, { useState, useEffect, useRef } from "react";
import W3Modal from "../W3Modal.js"
import NewProduct from './edit.new.product.jsx'

export default (props) => {
    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    if (props.states.user.privileges === 0) {
        return (
            <W3Modal modalClassName="w3-light-grey w3-animate-opacity w3-center" setIsOpen={setIsProductModalOpen} isOpen={isProductModalOpen} btnClassName="w3-button w3-blue w3-margin-big" btnText="Sell product" header={<><h2 className="w3-margin-big">SELL PRODUCT</h2></>} headerClassName="w3-blue w3-center" >
                <NewProduct functions={props.functions} states={props.states} isOpen={isProductModalOpen} setIsOpen={setIsProductModalOpen} />
            </W3Modal>
        )
    } else {
        return <></>
    }
}
