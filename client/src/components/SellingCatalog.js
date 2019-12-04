import React, { useState,useEffect } from "react";
import Section from './Section.js'
import Product from './Product.js'

export default function SellingCatalog(props) {
    return (
        <div className="w3-container no-paddings">
            
            <div className="w3-sidebar w3-bar-block section-container">
                <div className="w3-bar-item w3-green">
                    Categories
                </div>
                {
                    props.states.sections.map(s => 
                        <Section key={s.id} section={s} current={s.id === props.states.currentSection} functions={props.functions}/>
                    )
                }
            </div>
            <div className="w3-container product-container">
                <div className="w3-panel w3-center w3-border-bottom w3-border-green">
                    <h6>Products you are selling</h6>
                </div>
                {
                    props.states.products.filter(p => p.createdUserID==props.states.user.id).map(p =>
                        <Product key={p.id} product={p} functions={props.functions} hideBuyButton={true}/>
                    )
                }
            </div>
        </div>);
}

