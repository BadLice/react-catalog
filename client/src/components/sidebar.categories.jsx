import React from 'react';

import Section from './section.jsx';

export default (props) => {
    return (
        <div className="w3-container no-paddings">
            {/* sidebar elements */}
            <div ref={props.sidebarRef} className="w3-sidebar w3-dark-grey w3-card-4 w3-animate-left" style={{ display: 'none' }} >
                {/* sidebar intestation */}
                <div className="w3-bar w3-green">
                    <span className="w3-bar-item w3-padding-16">Categories</span>
                    <button onClick={() => props.closeSidebar()} className="w3-bar-item w3-button w3-right w3-padding-16 w3-hover-red" title="Close Sidebar">&#10006;</button>
                </div>

                {/* sidebar sections */}
                <div className="w3-bar-block">
                    {
                        props.sectionsInherited.map(s =>
                            <Section key={s.id} section={s} current={s.id === props.current} setCurrent={props.setCurrent} functions={props.functions} />
                        )
                    }
                </div>
            </div>
        </div>
    );
}