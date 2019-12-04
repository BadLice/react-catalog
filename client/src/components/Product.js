import React, { useState,useEffect,useRef } from "react";

export default function Product(props) {

	const pName = useRef();
	const pProducer = useRef();
	const pPrice = useRef();
	const pAvaliable = useRef();
	const pLogo = useRef();

	const setProduct = () => {
			props.functions.setProduct({
			id: props.product.id,
			name: pName.current.value.trim(),
			producer: pProducer.current.value.trim(),
			price: props.price,
			avaliable: props.avaliable,
		})
	}

	const addToChart = () => {
			props.functions.addToChart(props.product.id)
	}

	if(props.canWrite) {
		return (
			<div className="w3-card-4 w3-dark-grey product-card">
				<div className="w3-container w3-center">
					<input ref={pName} onBlur={() => setProduct()} type="text" defaultValue={props.product.name} />
					<input ref={pProducer} onBlur={() => setProduct()} type="text" defaultValue={props.product.producer} />
					<p ref={pPrice}>{props.product.price} €</p>
					<p ref={pAvaliable}>{props.product.avaliable}</p>
					<input type="button" defaultValue="Add to chart" onClick={() => addToChart()}/>
				</div>
			</div>
		);
	} else {
		return (
			<div className="w3-card-4 w3-light-grey w3-margin product-card">
				<div className="w3-container">
					<div className="title w3-center">
						<h3>{props.product.name}</h3>
					</div>
					<div>
						<div className="w3-margin product-image-container">
							<img ref={pLogo} src={"/products-images/"+props.product.id+"/product-logo.jpg"} className="product-image" onError={() => pLogo.current.src="/products-images/default/product-logo.jpg"}/>
							</div>
						<div className="w3-right">
							<h6 className="w3-text-pink"><b>{props.product.producer}</b></h6>
							<p className="w3-text-green" ref={pPrice}>{props.product.price} €</p>
							<p className="w3-text-green" ref={pAvaliable}>{props.product.avaliable}</p>
						</div>
						{
							!props.hideBuyButton && (
								<div className="add-chart-button">
									<input className="w3-button w3-blue" type="button" defaultValue="Add to chart" onClick={() => addToChart()}/>
								</div>
							)
						}
					</div>
				</div>
			</div>
		);
	}
}
