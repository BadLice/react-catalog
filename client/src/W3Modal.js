import React,{useEffect,useState,useRef} from "react";

export default (props) => {
    const modalController = useRef();

    const openModal = () => {
        props.setIsOpen(true);
    }

    const closeModal = () => {
        props.setIsOpen(false);
    }

    return (
    <>
        <button className={props.btnClassName ? props.btnClassName : "w3-button"} onClick={() => openModal()}>{props.btnText}</button>

        <div ref={modalController} className="w3-modal" style={{display: props.isOpen ? 'block' : 'none'}}>
            <div className={"w3-modal-content "+ props.modalClassName}>

                <header className={"w3-container "+(props.headerClassName ? props.headerClassName : 'w3-red')}>
                    <span onClick={() => closeModal()} className="w3-button w3-display-topright">&times;</span>
                    {
                        props.header && (
                            <>{props.header}</>
                        )
                    }
                </header>
                <div className="w3-container">
                    {props.content}
                </div>
                {
                    props.footer && (
                        <footer className={"w3-container "+(props.footerClassName ? props.footerClassName : 'w3-red')}>
                            <p>{props.footer}</p>
                        </footer>
                    )
                }
            </div>
        </div>
      </>
    );
}