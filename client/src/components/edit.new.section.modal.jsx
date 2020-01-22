import React, { useState, useEffect, useRef } from "react";
import W3Modal from "../W3Modal.js"
import NewSection from './edit.new.section.jsx'

export default (props) => {
    const [isSectionModalOpen, setIsSectionModalOpen] = useState(false);

    if (props.states.user.privileges <= 1) {
        return (
            <W3Modal modalClassName="w3-light-grey w3-animate-opacity w3-center" setIsOpen={setIsSectionModalOpen} isOpen={isSectionModalOpen} btnClassName="w3-button w3-orange w3-margin-big" btnText="Add category" header={<h2 className="w3-margin-big">ADD CATEGORY</h2>} headerClassName="w3-orange w3-center" >
                <NewSection functions={props.functions} states={props.states} isOpen={isSectionModalOpen} setIsOpen={setIsSectionModalOpen} />
            </W3Modal>
        )
    } else {
        return <></>
    }
}
