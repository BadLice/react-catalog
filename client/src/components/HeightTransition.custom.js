import React, { useState, useRef } from "react";
import NavBar from './NavBar';
import HeightTransition from 'react-height-transition';

export default (props) => {
    return (
        <>
            <HeightTransition initial={props.initial}>
                {(props.id === props.activeId || props.onload) ? props.children : null}
            </HeightTransition>
        </>
    );
}