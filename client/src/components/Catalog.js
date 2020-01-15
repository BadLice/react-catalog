import React from "react";
import Product from './Product.js';
import Section from './Section.js';
import NavBar from './NavBar.js';

export default (props) => {
	return (
		<>
			<NavBar states={props.states} functions={props.functions}/>
			<div className="w3-container no-paddings">
				<div className="w3-sidebar w3-bar-block section-container">
					<div className="w3-bar-item w3-green">
						Categories
					</div>
					{
						props.states.sections.map(s => 
							s.hasProducts ?  <Section key={s.id} section={s} current={s.id === props.states.currentSection} functions={props.functions}/> : ''
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
		</>
	);
}

