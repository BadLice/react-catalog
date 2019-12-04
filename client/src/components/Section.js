import React, { useState,useEffect,useRef } from "react";

export default function Product(props) {

	const setCurrentSection = () => {
		props.functions.setCurrentSection(props.section.id);
	}

	return (
		<div className={"w3-bar-item w3-button " + ((props.current) ? "w3-light-grey" : '')} onClick={() => setCurrentSection()}>
			{props.section.name}
		</div>
	);
}
