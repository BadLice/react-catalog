import React, { useRef } from "react";

import NavBar from './navbar.jsx';
import Product from './product.jsx';
import Section from './section.jsx';
import CagetSidebar from './sidebar.categories.jsx'

export default (props) => {
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

    return (
        <>
            <NavBar states={props.states} functions={props.functions} sidebar={sidebar} openNav={openNav} main={main} nav={nav} openSidebar={() => openSidebar()} showCategSidebar />
            <div className="w3-container no-paddings w3-full-height">

                <CagetSidebar states={props.states} functions={props.functions} sectionsInherited={props.states.sections.filter(s => s.hasProducts)} closeSidebar={closeSidebar} sidebarRef={sidebar} setCurrent={props.states.setCurrentSection} current={props.states.currentSection} />

                <div ref={main} className="w3-sidebar-main w3-full-height">
                    <div className="w3-container w3-dark-grey2 w3-border w3-border-black navbar-margin product-container" style={{ height: '100%' }}>
                        {
                            props.states.products.map(p =>
                                <Product key={p.id} product={p} functions={props.functions} />
                            )
                        }
                    </div>
                </div>
            </div>


        </>
    );
}

