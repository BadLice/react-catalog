import React, {useRef } from "react";
export default (props) => {

    const usernameRef = useRef();
    const passwordRef = useRef();
    
    return (
        <div className="limiter">
            <div className="container-login100" style={{backgroundImage: "url('images/bg-01.jpg')"}}>
                <div className="wrap-login100">
                    <div className="login100-form validate-form">
                        <span className="login100-form-logo">
                            <img src="logo192.png" style={{width: '120px'}}/>
                        </span>

                        <span className="login100-form-title p-b-34 p-t-27">
                            Log in
					    </span>

                        <div className="wrap-input100">
                            <input className="input100" type="text" name="username" placeholder="Username" ref={usernameRef} />
                            <span className="focus-input100" data-placeholder="&#xf207;"></span>
                        </div>

                        <div className="wrap-input100">
                            <input className="input100" type="password" name="pass" placeholder="Password" ref={passwordRef} />
                            <span className="focus-input100" data-placeholder="&#xf191;"></span>
                        </div>

                        {/* <div className="contact100-form-checkbox">
                            <input className="input-checkbox100" id="ckb1" type="checkbox" name="remember-me" />
                            <label className="label-checkbox100" htmlFor="ckb1">
                                Remember me
					    	</label>
                        </div> */}

                        <div className="container-login100-form-btn">
                            <button className="login100-form-btn" onClick={() => props.functions.login(usernameRef.current.value.trim(), passwordRef.current.value.trim())}>
                                Login
						    </button>
                        </div>

                        <div className="text-center p-t-90">
                            {/* <a className="txt1" href="#">
                                Forgot Password?
						    </a> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

