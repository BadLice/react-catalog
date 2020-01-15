import React, { useState,useEffect } from "react";
import NavBar from "./NavBar.js"
import NewProductPusher from './NewProductPusher.js'
import NewSectionPusher from './NewSectionPusher.js'
import SellingCatalog from './SellingCatalog.js';
import ModalObj from '../classes/ModalObj.js';
import W3Modal from "../W3Modal.js"

export default function Editing(props) {
    const addProductModal = new ModalObj();
    const editProductModal = new ModalObj();

    var [updateSellingProducts,setUpdateSellingProducts] = useState(false);
    const [editingProductId,setEditProductId] = useState('');
    const [sellingProducts,setSellingProducts] = useGetSellingProductsFromDb(props.states.user,props.states.currentSection,updateSellingProducts);
    const [sellingSections,setSellingSections] = useGetSellingSectionsFromDb(props.states.user,updateSellingProducts);
    const [isSectionModalOpen,setIsSectionModalOpen] = useState(false);

    const saveProduct = (product,image) => {
        //validation
        let errors = {
            moneyErr: product.price === undefined || product.price === '' || product.price === null || isNaN(product.price),
            avaliableErr: product.avaliable === undefined || product.avaliable === '' || product.avaliable === null || isNaN(product.avaliable) || parseFloat(product.avaliable) % 1 !== 0,
            nameErr: product.name === undefined || product.name === '' || product.name === null,
            producerErr: product.producer === undefined || product.producer === '' || product.producer === null,
            sectionErr : product.sections.length <= 0,
        }

        if(!errors.nameErr && !errors.producerErr && !errors.moneyErr && !errors.avaliableErr && !errors.sectionErr) {
            var productFormData = new FormData();
            productFormData.append('file', image);
            productFormData.append('product',JSON.stringify(product));
    
            fetch('/products/saveProduct',{
                method: 'POST',
                body: productFormData,
            })
            .then(res => res.json())
            .then(res => {
                if(res.success) {
                    setUpdateSellingProducts(!updateSellingProducts);
                }
            });
        }
        return errors;
    }

    return (
        <>
            <NavBar states={props.states} functions={props.functions} />
            <div>

                <div className="w3-bar w3-grey">
                    <div className="w3-bar-item w3-button w3-right w3-pink" onClick={() => addProductModal.open()}>
                    Add product
                    </div>
                    {
                        props.states.user.privileges === 0 && (
                            <W3Modal
                                modalClassName = "w3-light-grey w3-animate-opacity w3-center"
                                setIsOpen = {setIsSectionModalOpen}
                                isOpen = {isSectionModalOpen}
                                btnClassName = "w3-bar-item w3-button w3-right w3-red"
                                btnText = "Add category"
                                header={<><h2>Add category</h2></>}
                                headerClassName="w3-red w3-center"
                                content = {
                                    <NewSectionPusher functions={props.functions} states={props.states} isOpen={isSectionModalOpen} setIsOpen={setIsSectionModalOpen}/>
                                }
                            />
                        )                       
                    }
                </div>

                <SellingCatalog functions={props.functions} states={props.states} editProductModal={editProductModal} setEditProductId={setEditProductId} sellingProducts={sellingProducts} setSellingProducts={setSellingProducts} sellingSections={sellingSections} setSellingSections={setSellingSections} saveProduct={saveProduct}/>

                <div ref={addProductModal.ref} className="w3-modal">
                    <NewProductPusher functions={props.functions} states={props.states} modalController={addProductModal}/>
                </div>
            </div>
        </>
    );
	
}


function useGetSellingSectionsFromDb(user,updateSellingProducts) {
    const [sellingsections,setSellingsections] = useState([]);

    useEffect(() => {
        fetch('/sections/getSellingSections',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id
                })
            })
            .then(res => res.json())
            .then(res => {
                if(res.success)
                    setSellingsections(res.sections);
            });
    },[user,updateSellingProducts])

    return [sellingsections,setSellingsections];
}

function useGetSellingProductsFromDb(user,sectionId,updateSellingProducts) {
    const [sellingProducts,setSellingProducts] = useState([]);

    useEffect(() => {
        fetch('/products/getSellingProducts',{
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: user.id,
                    sectionId: sectionId,
                    })
            })
            .then(res => res.json())
            .then(res => {
                if(res.success)
                    setSellingProducts(res.products);
            })
    },[user,sectionId,updateSellingProducts])

    return [sellingProducts,setSellingProducts];
}