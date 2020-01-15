import React, { useState,useEffect,useRef } from "react";
import {Select} from "react-dropdown-select"
export default function EditProduct(props) {

    const [product,setProduct] = useGetProductFromDb(props.productId);

	const [errors,setErrors] = useState({});
	const pName = useRef();
	const pProducer = useRef();
	const pPrice = useRef();
	const pAvaliable = useRef();
	const [pSections,setPSections] = useState([]);
	const pImg = useRef();
	const pFileUploaded = useRef();
	const [pImgFileSrc,setPImgFileSrc] = useState("/products-images/default/product-logo.jpg");
	const [sectionDropdownOptions,setSectionDropdownOptions] = useState([]);
	
	const saveProduct = () => {
		let product = {
			id: props.productId,
			name: pName.current.value.trim(),
			producer: pProducer.current.value.trim(),
			price: pPrice.current.value.trim(),
			avaliable: pAvaliable.current.value.trim(),
			sections: pSections
		};

		let updateErrors =  props.saveProduct(product, pFileUploaded.current.files[0])
		setErrors(updateErrors);

		if(!updateErrors.nameErr && !updateErrors.producerErr && !updateErrors.moneyErr && !updateErrors.avaliableErr && !updateErrors.sectionErr)
			props.setIsEditProductModalOpen(false);
	}

	const showUploadedImage = () => {
		let files = pFileUploaded.current.files;
		if (FileReader && files && files.length) {
			if(files[0].type === "image/jpeg" || files[0].type === "image/png") {
				let fr = new FileReader();
				fr.onload = () => setPImgFileSrc(fr.result);
				fr.readAsDataURL(files[0]);
			}
		}
	}
	
	useEffect(() => {
        if(props.states.sections) {
            let sdo = [...props.states.sections];
            sdo = sdo.map(o => {
                o.value = o.id;
                o.label = o.name;
                return o;
            })
            setSectionDropdownOptions(sdo);
        }
	},[props.states.sections]);
    
    useEffect(() => {
        pName.current.value = product.name;
        pProducer.current.value = product.producer;
        pPrice.current.value = product.price;
		pAvaliable.current.value = product.avaliable;
		if(product.sections) {
			let sdo = [...product.sections];
			sdo = sdo.map(o => {
				o.value = o.id;
				o.label = o.name;
				return o;
			})
			setPSections(sdo);
		}
        setPImgFileSrc("/products-images/"+product.id+"/product-logo.jpg");
    },[product]);

	return (
		<div className="w3-display-middle new-product-card div-center">
			<form ref={pImg}>
				<div className="w3-container w3-center">
					<div className="w3-margin ">
						<img ref={pImg} src={pImgFileSrc} className="product-image new-product-image div-center" onError={() => setPImgFileSrc("/products-images/default/product-logo.jpg")}/>
						<input type="file" ref={pFileUploaded} name="file" id="file" className="inputfile" onChange={() => showUploadedImage()}/>
						<label htmlFor="file" className="w3-button w3-blue w3-margin w3-hover-light-blue">{pImgFileSrc==="/products-images/default/product-logo.jpg" ? "Choose image" : "Change image"}</label>
					</div>
					<div className="w3-center w3-margin w3-padding">
						<input className={"w3-input "+(errors.nameErr ? 'w3-border w3-border-red' : '')} ref={pName} type="text" placeholder="Name"/>
						<input className={"w3-input "+(errors.producerErr ? 'w3-border w3-border-red' : '')} ref={pProducer} type="text" placeholder="Producer"/>
						<input className={"w3-input "+(errors.moneyErr ? 'w3-border w3-border-red' : '')} ref={pPrice} type="text" placeholder="Price"/>
						<input className={"w3-input "+(errors.avaliableErr ? 'w3-border w3-border-red' : '')} ref={pAvaliable} type="text" placeholder="Pieces avaliable"/>

						
						<Select className={"w3-input w3-white dropdown-select"+(errors.sectionErr ? 'w3-border w3-border-red' : '')} multi options={sectionDropdownOptions} dropdownHandle={false} values={pSections} onChange={(values) => setPSections(values)} placeholder="Type a section..."/>
					</div>
					<div className="w3-margin">
						<input className="w3-button w3-green" type="button" defaultValue="Save changes" onClick={()=> saveProduct()}/>
					</div>					
				</div>
			</form>
		</div>
	);
}

function useGetProductFromDb(productId) {
    const [product,setProduct] = useState({});

    useEffect(() => {
        if(productId.length > 0) {
            fetch('/products/getProduct',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                  },
                  body: JSON.stringify({
                      productId: productId
                    })
            })
            .then(res => res.json())
            .then(res => {
                if(res.success) {
                    setProduct(res.product);
                }
            });
        }
    },[productId])

    return [product,setProduct];
}