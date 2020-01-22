import React, { useState, useEffect, useRef } from "react";

export default (props) => {
	return (
		<div className={"w3-bar-item w3-button " + ((props.current) ? "w3-light-grey" : '')} onClick={() => props.setCurrent(props.section.id)}>
			{props.section.name}
		</div>
	);
}
