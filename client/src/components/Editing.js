import React, { useState,useEffect,useRef } from "react";
import NewProductPusher from './NewProductPusher.js'
import NewSectionPusher from './NewSectionPusher.js'
import SellingCatalog from './SellingCatalog.js';
import ModalObj from '../classes/ModalObj.js';

export default function NavBar(props) {
    const addProductModal = new ModalObj();
    const addSectionModal = new ModalObj();

    return (
        <div className="">

            <div className="w3-bar w3-grey">
                <div className="w3-bar-item w3-button w3-right w3-pink" onClick={() => addProductModal.open()}>
                 Add product
                </div>
                {
                    props.states.user.privileges === 0 && (
                        <div className="w3-bar-item w3-button w3-right w3-red" onClick={() => addSectionModal.open()}>
                             Add category
                        </div>
                    )                       
                }
            </div>

            <SellingCatalog functions={props.functions} states={props.states}/>

            <div ref={addProductModal.ref} className="w3-modal">
                <NewProductPusher functions={props.functions} states={props.states} modalController={addProductModal}/>
            </div>
            {
                props.states.user.privileges === 0 && (
                    <div ref={addSectionModal.ref} className="w3-modal">
                        <NewSectionPusher functions={props.functions} states={props.states} modalController={addSectionModal}/>
                    </div>
                )                       
            }

        </div>
    );
	
}
