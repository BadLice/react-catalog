import React, { useState,useEffect,useRef } from "react";

class ModalObj {
    constructor() {
      this.ref = useRef();
      this.hidden = false;
    }
    open = () => {
      this.hidden=false;
      this.ref.current.style.display='block';
    }
    close =() => {
      this.hidden=true;
      this.ref.current.style.display='none';
    }   
}

export default ModalObj;
