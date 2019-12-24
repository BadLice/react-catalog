import React, { useState,useEffect,useRef } from "react";
import W3Modal from "../W3Modal.js"
import EditProduct from "./EditProduct.js";

export default function Product(props) {

	const pName = useRef();
	const pProducer = useRef();
	const pPrice = useRef();
	const pAvaliable = useRef();
	const pLogo = useRef();
    const [isEditProductModalOpen,setIsEditProductModalOpen] = useState(false);

	const addToChart = () => {
			props.functions.addToChart(props.product.id)
	}
	
	return (
		<div className="w3-card-4 w3-light-grey w3-margin product-card">
			<div className="w3-container">
				<div className="title w3-center">
					<h3>{props.product.name}</h3>
				</div>
				<div>
					<div className="w3-margin product-image-container">
						<img ref={pLogo} src={"/products-images/"+props.product.id+"/product-logo.jpg?"+Date.now()} className="product-image" onError={() => pLogo.current.src="/products-images/default/product-logo.jpg"}/> {/* Date.now() forces the refresh of the image when it is changed by the server */}
						</div>
					<div className="w3-right">
						<h6 className="w3-text-pink"><b>{props.product.producer}</b></h6>
						<p className="w3-text-green" ref={pPrice}>{props.product.price} €</p>
						<p className="w3-text-green" ref={pAvaliable}>{props.product.avaliable}</p>
					</div>
					{
						!props.canWrite && (
							<div className="add-chart-button">
								<input className="w3-button w3-blue" type="button" defaultValue="Add to chart" onClick={() => addToChart()}/>
							</div>
						)
					}
					{
						props.canWrite && (
							<div className="add-chart-button">
								<W3Modal
									modalClassName = "new-product-modal w3-light-grey w3-animate-opacity w3-center"
									setIsOpen = {setIsEditProductModalOpen}
									isOpen = {isEditProductModalOpen}
									btnClassName = "w3-button w3-orange"
									btnText = "Edit"
									header={<><h2>Edit product <br/><b>{props.product.name}</b></h2></>}
									headerClassName="w3-center w3-orange"
									content = {
										<EditProduct functions={props.functions} states={props.states} productId={props.product.id} saveProduct={props.saveProduct} sellingProducts={props.sellingProducts} setIsEditProductModalOpen={setIsEditProductModalOpen}/>
									}
								/>
							</div>
						)
					}
				</div>
			</div>
		</div>
	);

}
