import React, { useState,useEffect,useRef } from "react";
import {Select} from "react-dropdown-select"
import uuidv4 from 'uuid';
export default function NewSectionPusher(props) {
    const [errors,setErrors] = useState({});
    const sName = useRef();

    const setSection = () => {
        setErrors(
            props.functions.setSection({
                name: sName.current.value.trim(),
            })
        );
    }

    const clearValues = () => {
        sName.current.value='';
    }

    useEffect(() => {
        clearValues();
        props.modalController.close();
    },[props.states.sections.length]);

	return (
		<div className="w3-modal-content w3-light-grey w3-animate-opacity">
			<header className="w3-container w3-red w3-center">
				<span onClick={() => {props.modalController.close();clearValues()}} className="w3-button w3-display-topright">&times;</span>
				<h2>Add category</h2>
			</header>
			<div className="w3-container w3-margin ">
				<div className="new-product-card div-center">
                    <div className="w3-container w3-center">
                        
                        <div className="w3-center w3-margin w3-padding">
                            <input className={"w3-input "+(errors.nameErr || errors.alreadyExists ? 'w3-border w3-border-red' : '')} ref={sName} type="text" placeholder="Name"/>
                        </div>
                        <div className="w3-margin">
                            <input className="w3-button w3-green" type="button" defaultValue="Add Category" onClick={()=> setSection()}/>
                        </div>					
                    </div>
				</div>
			</div>
		</div>
	);
}
