import React, { useRef } from "react";

export default props => {

    const logo = useRef();
    const amount = useRef();

    return (
        <div className="w3-container w3-light-grey2 w3-margin-big w3-border w3-border-blue no-paddings w3-text-white" >
            <div className="w3-container no-paddings">
                {/* <div className="title w3-center">
                    <h3 className="">{props.product.name}</h3>
                </div> */}
                <div className="w3-display-container">
                    <div className="product-image-container div-adjacent">
                        <img ref={logo} src={"/products-images/" + props.product.id + "/product-logo.jpg?" + Date.now()} className="cart-product-image" onError={() => logo.current.src = "/products-images/default/product-logo.jpg"} /> {/* Date.now() forces the refresh of the image when it is changed by the server */}
                    </div>
                    <div className=" w3-container cart-product-container-data div-adjacent" >
                        <h1 className="w3-margin-big"><b>{props.product.name}</b></h1>
                        <h3 className="w3-text-pink w3-margin-big"><b>{props.product.producer}</b></h3>
                        <h4 className="w3-text-blue w3-margin-big">{props.product.price} €</h4>
                        <h3 className={"w3-margin-big " + (props.product.avaliable > 0 ? 'w3-text-green' : 'w3-text-red')}>{props.product.avaliable > 0 ? props.product.avaliable +
                            ' pieces avaliable' : 'This product is no more avaliable!'}</h3>
                        <select ref={amount} className="w3-input w3-select w3-border-purple" defaultValue={props.product.amount <= props.product.avaliable ? props.product.amount : props.functions.normalizeAmount(props.product.id, props.product.avaliable)} onChange={() => props.functions.setCartAmount(props.product.id, amount.current.value)}>
                            {
                                [...Array(props.product.avaliable < 1000 ? props.product.avaliable : 1000)].map((_, i) => <option key={i} value={i + 1}>{i + 1}</option>)
                            }
                        </select>
                        <button className={"w3-button w3-orange remove-cart-button"} onClick={() => props.functions.removeFromCart(props.product.id)}>Remove</button>
                    </div>
                    <button className={"w3-button add-chart-button no-paddings " + (props.product.selected ? 'w3-green' : 'w3-red')} onClick={() => props.functions.selectInCart(props.product)}>
                        <div className="div-adjacent w3-margin" style={{ width: '80px' }}>
                            {props.product.selected ? <>Selected</> : <>Unselected</>}
                        </div>
                        <div className={"div-adjacent cart-select-button " + (props.product.selected ? 'w3-dark-green' : 'w3-dark-red')}>
                            {props.product.selected ? <>&#10004;</> : <>&#10006;</>}
                        </div>
                    </button>
                </div>
            </div>
        </div >
    );
};