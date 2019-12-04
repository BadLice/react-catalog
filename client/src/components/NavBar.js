import React, { useState,useEffect,useRef } from "react";
import {Link} from "react-router-dom";

export default function NavBar(props) {
	
    return (
        <div className="w3-bar w3-dark-grey">
            <div className="w3-bar-item w3-button" onClick={() => window.location.href='/catalog'}>
                Catalog
            </div>
            <div className="w3-bar-item w3-button w3-right w3-purple" onClick={() => window.location.href='/editing'}>
               Your products
            </div>
        </div>
    );
	
}
