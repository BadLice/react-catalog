import React, { useState, useRef } from "react";
import HeightTransition from 'react-height-transition';

export default ({ initial, ...rest }) => {
    return (
        <>
            <HeightTransition initial={initial} {...rest}>
                {(rest.id === rest.activeId || rest.onload) ? rest.children : null}
            </HeightTransition>
        </>
    );
}