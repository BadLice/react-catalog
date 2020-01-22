import React from 'react'
import NavBar from './navbar'
import Product from './cart.product'

export default (props) => {
    return (
        <>
            <NavBar states={props.states} functions={props.functions} />
            <div className="w3-container no-paddings w3-full-height">
                <div className="w3-container navbar-margin w3-dark-grey2 w3-full-height">
                    {
                        props.states.cart.map(p => <Product states={props.states} functions={props.functions} product={p} />)
                    }
                </div>
            </div>
        </>
    );
}