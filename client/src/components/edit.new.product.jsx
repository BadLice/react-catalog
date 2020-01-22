import React, { useState, useEffect, useRef } from "react";
import { Select } from "react-dropdown-select"
export default (props) => {

	const [errors, setErrors] = useState({});
	const pName = useRef();
	const pProducer = useRef();
	const pPrice = useRef();
	const pAvaliable = useRef();
	const [pSections, setPSections] = useState([]);
	const pImg = useRef();
	const pFileUploaded = useRef();
	const [pImgFileSrc, setPImgFileSrc] = useState("/products-images/default/product-logo.JPG");
	const [sectionDropdownOptions, setSectionDropdownOptions] = useState([]);

	const setProduct = () => {

		let product = {
			name: pName.current.value,
			producer: pProducer.current.value,
			price: pPrice.current.value,
			avaliable: pAvaliable.current.value,
			sections: pSections,
		}
		setErrors(props.functions.setProduct(product, pFileUploaded.current.files[0]));
	}

	useEffect(() => {
		clearValues();
		props.setIsOpen(false);
	}, [props.states.products.length]);


	const clearValues = () => {
		pName.current.value = '';
		pProducer.current.value = '';
		pPrice.current.value = '';
		pAvaliable.current.value = '';
		setPSections([]);
	}

	const showUploadedImage = () => {
		let files = pFileUploaded.current.files;
		if (FileReader && files && files.length) {
			if (files[0].type === "image/jpeg" || files[0].type === "image/png") {
				var fr = new FileReader();
				fr.onload = function () {
					setPImgFileSrc(fr.result);
				}
				fr.readAsDataURL(files[0]);
			}
		}
	}

	useEffect(() => {
		let sdo = [...props.states.sections];
		sdo = sdo.map(o => {
			o.value = o.id;
			o.label = o.name;
			return o;
		})
		setSectionDropdownOptions(sdo);
	}
		, [props.states.sections]);
	return (
		<div className="new-product-card div-center">
			<form ref={pImg}>
				<div className="w3-container w3-center">
					<div className="w3-margin ">
						<img ref={pImg} src={pImgFileSrc} className="product-image new-product-image div-center" />
						<input type="file" ref={pFileUploaded} name="img-new-product" id="img-new-product" className="inputfile" onChange={() => showUploadedImage()} />
						<label htmlFor="img-new-product" className="w3-button w3-blue w3-margin w3-hover-light-blue">{pFileUploaded.current && pFileUploaded.current.files.length <= 0 ? "Choose image" : "Change image"}</label>
					</div>
					<div className="w3-center w3-margin w3-padding">
						<input className={"w3-input " + (errors.nameErr ? 'w3-border w3-border-red' : '')} ref={pName} type="text" placeholder="Name" />
						<input className={"w3-input " + (errors.producerErr ? 'w3-border w3-border-red' : '')} ref={pProducer} type="text" placeholder="Producer" />
						<input className={"w3-input " + (errors.moneyErr ? 'w3-border w3-border-red' : '')} ref={pPrice} type="text" placeholder="Price" />
						<input className={"w3-input " + (errors.avaliableErr ? 'w3-border w3-border-red' : '')} ref={pAvaliable} type="text" placeholder="Pieces avaliable" />
						<Select className={"w3-input w3-white dropdown-select" + (errors.sectionErr ? 'w3-border w3-border-red' : '')} multi options={sectionDropdownOptions} dropdownHandle={false} values={pSections} onChange={(values) => setPSections(values)} placeholder="Type a section..." />
					</div>
					<div className="w3-margin">
						<input className="w3-button w3-green" type="button" defaultValue="Sell product" onClick={() => setProduct()} />
					</div>
				</div>
			</form>
		</div>
	);
}
