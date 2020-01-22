import React, { useRef } from "react";

export default props => {

    const logo = useRef();

    return (
        <div className="w3-container w3-light-grey w3-margin-big w3-border w3-border-blue no-paddings">
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
                    </div>
                    <button className="w3-button w3-green add-chart-button">
                        <div className="div-adjacent w3-margin">
                            Select
                        </div>
                        <div className="div-adjacent w3-margin">
                            aaa
                        </div>

                    </button>
                </div>
            </div>
        </div>
    );
};