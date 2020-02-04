import React from "react";
import { NavLink } from "react-router-dom";

export default (props) => {
    return (
        <>
            <div ref={props.nav} className="w3-bar w3-dark-grey w3-sidebar-main w3-border-bottom w3-border-grey" style={{ position: 'fixed', zIndex: 4 }}>
                {
                    props.showCategSidebar ?
                        (
                            <button ref={props.openNav} className="w3-bar-item w3-button no-underline" onClick={() => props.openSidebar()}>&#9776;</button>
                        )
                        :
                        ('')
                }
                <NavLink className="w3-bar-item w3-button no-underline" to="/catalog" >Shop</NavLink>
                <div className="w3-dropdown-hover w3-right" style={{ position: 'fixed', right: 0 }}>
                    <button className="w3-bar-item w3-button w3-black">My Account</button>
                    <div className="w3-dropdown-content w3-bar-block w3-border" style={{ marginTop: '38px' }}>
                        <NavLink className="w3-bar-item w3-button no-underline" to="/balance">
                            &#128176; <b>{props.states.user.balance}</b> €
                        </NavLink>
                        <NavLink className="w3-bar-item w3-button no-underline" to="/cart">
                            &#128722; <b>{props.states.cart.length}</b> items
                        </NavLink>
                        {props.states.user.privileges !== 2 ? <NavLink className="w3-bar-item w3-button no-underline" to="/editing">&#11452; Your shop</NavLink> : ''}
                        <NavLink className="w3-bar-item w3-button no-underline" to="/security">&#128737; Security</NavLink>
                    </div>
                </div>
            </div>
        </>
    );

}
