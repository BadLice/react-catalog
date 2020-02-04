import React from 'react'
import NavBar from './navbar'
import Product from './cart.product'
import CountUp, { useCountUp } from 'react-countup'
import { useState } from 'react'
import { Link } from 'react-router-dom'

export default (props) => {

    const [sliderOpen, setSliderOpen] = useState(false);
    // const { countUp2, start, reset } = useCountUp({ start: props.states.user.balance, end: (props.states.user.balance - props.states.cartTotal), duration: 5, });

    const openSlider = () => setSliderOpen(true);
    const closeSlider = () => setSliderOpen(false);

    const hasEnoughMoney = () => {
        return (props.states.user.balance - props.states.cartTotal) > 0
    }

    return (
        <>
            <NavBar states={props.states} functions={props.functions} />
            <div className="w3-container no-paddings cart-total-footer-margin" style={{ scrollbar: 'none' }}>
                <div className="navbar-margin w3-dark-grey2">
                    {
                        props.states.cart.map(p => <Product key={p.id} states={props.states} functions={props.functions} product={p} />)
                    }
                </div>

                {/* closed slider */}
                <div className={"cart-total-footer w3-dark-grey w3-padding w3-border-top w3-border-green" + (sliderOpen ? ' overlay ' : '')}>
                    <div className="div-adjacent" style={{ float: "right" }}>
                        <h4 className="div-adjacent w3-margin w3-text-white">Total</h4>
                        <CountUp className="div-adjacent w3-margin" decimals={2} decimal="," prefix="€ " end={props.states.cartTotal} duration={1} start={props.states.precCartTotal} >
                            {({ countUpRef }) => (
                                <h4 ref={countUpRef} className="div-adjacent w3-margin w3-text w3-text-yellow"></h4>
                            )}
                        </CountUp>
                    </div>
                    <div className="div-adjacent" style={{ float: "left" }}>
                        <button className="w3-button w3-orange w3-padding" onClick={openSlider}>PURCHASE</button>
                    </div>
                </div>


                {/* open slider */}
                <div className={"overlay navbar-margin w3-dark-grey w3-center" + (sliderOpen ? ' open ' : '')}>
                    <div className="w3-display-container">
                        <table className="w3-container w3-border w3-border-grey w3-display-topmiddle" style={{ marginTop: '20%', borderCollapse: "inherit" }}>
                            <tbody>
                                <tr>
                                    <td>
                                        <h2 className="w3-margin-big w3-text-white">BALANCE</h2>
                                    </td>
                                    <td>
                                        <h1 className="w3-margin-big w3-text-green">€ {props.states.user.balance.toFixed(2).replace('.', ',')}</h1>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <h2 className="w3-margin-big w3-text-white">TOTAL</h2>
                                    </td>
                                    <td>
                                        <h1 className="w3-margin-big w3-text-red">€ {props.states.cartTotal.toFixed(2).replace('.', ',')}</h1>
                                    </td>
                                </tr>
                                <tr><td colSpan="2"><hr className="w3-yellow" /></td></tr>
                                {
                                    hasEnoughMoney() ?
                                        (<>
                                            <tr>
                                                <td>
                                                    <h2 className="w3-margin-big w3-text-white">REMAINING</h2>
                                                </td>
                                                <td>
                                                    <h1 className="w3-margin-big w3-text-blue">€ {(props.states.user.balance - props.states.cartTotal).toFixed(2).replace('.', ',')}</h1>
                                                </td>
                                            </tr>
                                            <tr>
                                                <td>
                                                    <a style={{ textDecoration: 'underline', cursor: 'pointer' }} onClick={closeSlider}>Not now</a>
                                                </td>
                                                <td><button className="w3-button w3-orange w3-padding">PURCHASE</button></td>
                                            </tr>
                                        </>)
                                        :
                                        (<>
                                            <tr>
                                                <td>
                                                    <p className="w3-text-yellow">Youn dont have enough money to purchase this products.<br />Reduce the amounts of products you are buying or:</p>
                                                </td>
                                                <td>
                                                    <Link className="w3-button w3-button no-underline w3-padding w3-blue" to="/balance">
                                                        <b>RECHARGE NOW!</b>
                                                    </Link>
                                                </td>
                                            </tr>
                                        </>)
                                }
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>
        </>
    );
}