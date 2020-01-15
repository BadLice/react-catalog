import React from "react";
import {NavLink} from "react-router-dom";

export default (props) => {
    return (
        <div className="w3-bar w3-dark-grey">
            <NavLink className="w3-bar-item w3-button no-underline" to="/catalog" >Shop</NavLink>
            <div className="w3-dropdown-hover w3-right">
                <button className="w3-bar-item w3-button w3-black">My Account</button>
                <div className="w3-dropdown-content w3-bar-block w3-border" style={{ marginTop: '38px' }}>
                    <NavLink className="w3-bar-item w3-button no-underline" to="/balance">
                        &#128176; <b>{props.states.user.balance}</b> €
                    </NavLink>
                    <NavLink className="w3-bar-item w3-button no-underline" to="/cart">
                        &#128722; <b>{props.states.chart.length}</b> items
                    </NavLink>
                    <NavLink className="w3-bar-item w3-button no-underline" to="/editing">&#11452; Your shop</NavLink>
                    <NavLink className="w3-bar-item w3-button no-underline" to="/security">&#128737; Security</NavLink>
                </div>
            </div>
        </div>
    );

}
