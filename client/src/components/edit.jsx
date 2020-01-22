import React, { useEffect, useRef, useState } from "react";

import ModalObj from '../classes/ModalObj.js';
import NavBar from "./navbar.jsx"
import NewProductModal from './edit.new.product.modal.jsx'
import NewSectionModal from './edit.new.section.modal.jsx'
import Product from './product.jsx'
import CagetSidebar from './sidebar.categories.jsx'

export default function Editing(props) {

    let sidebar = useRef();
    let openNav = useRef();
    let main = useRef();
    let nav = useRef();

    const closeSidebar = () => {
        sidebar.current.style.display = 'none';
        main.current.style.marginLeft = "0%";
        openNav.current.style.display = "inline-block";
        nav.current.style.marginLeft = "0%";
    }
    const openSidebar = () => {
        main.current.style.marginLeft = "15%";
        sidebar.current.style.width = "15%";
        nav.current.style.marginLeft = "15%";
        sidebar.current.style.display = "block";
        openNav.current.style.display = 'none';
    }

    const editProductModal = new ModalObj(); //deprecated, switch to W3Modal

    const [isProductModalOpen, setIsProductModalOpen] = useState(false);

    useEffect(() => {
        if (!props.states.currentSellingSection && props.states.sellingSections.length > 0) {
            props.states.setCurrentSellingSection(props.states.sellingSections[0].id);
        }
    }, [props.states.sellingSections.length]);

    if (props.states.user.privileges === 2) {
        props.states.history.push('/catalog');
        return '';
    }

    return (
        <>
            <NavBar states={props.states} functions={props.functions} sidebar={sidebar} openNav={openNav} main={main} nav={nav} openSidebar={() => openSidebar()} showCategSidebar={props.states.sellingProducts && props.states.sellingProducts.length !== 0} />

            <div className="w3-container no-paddings w3-full-height">
                {
                    !props.states.sellingProducts ?
                        (
                            <div className="w3-container navbar-margin w3-dark-grey2 w3-full-height">
                                <div className="w3-panel w3-pale-red w3-leftbar w3-border-red w3-center">
                                    loading (Not implemented yet)
                            </div>
                            </div>
                        )
                        :
                        (
                            <>

                                {
                                    props.states.sellingProducts.length === 0 ?
                                        (
                                            <div className="w3-container navbar-margin w3-dark-grey2 w3-full-height">
                                                <div className="w3-panel w3-pale-red w3-leftbar w3-border-red w3-center">
                                                    <h2 className="w3-margin-big w3-text-yellow">NO PRODUCTS</h2>
                                                    <h5 className="w3-margin-big">You are selling no products</h5>
                                                    <p className="w3-margin-big w3-text-green">Click on buttons below to start selling</p>
                                                    <NewSectionModal states={props.states} functions={props.functions} />
                                                    <NewProductModal functions={props.functions} states={props.states} />
                                                </div>
                                            </div>
                                        )
                                        :
                                        (
                                            <>
                                                <CagetSidebar states={props.states} functions={props.functions} sectionsInherited={props.states.sellingSections} closeSidebar={closeSidebar} sidebarRef={sidebar} current={props.states.currentSellingSection} setCurrent={props.states.setCurrentSellingSection} />

                                                <div ref={main} className="w3-sidebar-main w3-full-height">
                                                    <div className="w3-container navbar-margin w3-full-height w3-dark-grey2">
                                                        <div className="w3-panel w3-border-bottom no-margins">
                                                            <NewSectionModal states={props.states} functions={props.functions} />
                                                            <NewProductModal functions={props.functions} states={props.states} isOpen={isProductModalOpen} setIsOpen={setIsProductModalOpen} />
                                                        </div>
                                                        <div className="w3-container navbar-margin">
                                                            {
                                                                props.states.sellingProducts.map(p =>
                                                                    <Product key={p.id} product={p} functions={props.functions} states={props.states} modalController={editProductModal} hideBuyButton={true} canWrite={true} />
                                                                )
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </>
                                        )
                                }

                            </>
                        )
                }
            </div>

        </>
    );

}
