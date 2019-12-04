import React, { useState,useEffect } from "react";
import Section from './Section.js'
import Product from './Product.js'

export default function Catalog(props) {
	return (
		<div className="w3-container no-paddings">
			<div className="w3-container w3-right">
				<p>Balance: {props.states.user.balance} €</p>
				<p>Chart: {props.states.chart.length} items</p>
			</div>
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
				{
					props.states.products.map(p =>
						<Product key={p.id} product={p} functions={props.functions}/>
					)
				}
			</div>
		</div>
	);
}

