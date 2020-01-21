import React, { useState, useRef, useEffect } from "react";
import NavBar from './NavBar';
import HeightTransition from './HeightTransition.custom';
import Progress from 'react-progressbar';

export default (props) => {
    let [rechargeActiveTab, setActiveTab] = useState('');
    let cardNumber = useRef();
    let cardHolder = useRef();
    let cardExpiration = useRef();
    let cardCvv = useRef();
    let amount = useRef();
    let [cardProgress, setCardProgress] = useState(0);
    let [errors, setErrors] = useState({});
    let [lastAmount, setLastAmount] = useState(0);

    const isActive = (name) => rechargeActiveTab === name;

    useEffect(() => {
        if (cardNumber.current) {
            cardNumber.current.value = ''
            cardHolder.current.value = ''
            cardExpiration.current.value = ''
            cardCvv.current.value = ''
            amount.current.value = ''
            setCardProgress(0)
            setErrors({});
        }
    }, [rechargeActiveTab]);

    return (
        <>
            <NavBar states={props.states} functions={props.functions} />
            <div className="w3-container">
                <div className="w3-panel w3-pale-green w3-leftbar w3-border-green w3-center">
                    <h2 className="w3-text-green w3-margin-big">YOUR CREDIT</h2>
                    <h3 className="w3-text-green w3-margin-big"><span className="w3-text-blue">{props.states.user.balance}</span> €</h3>
                </div>
            </div>
            <div className="w3-border">
                <div className="w3-bar w3-border-bottom w3-light-grey intronav">
                    <div className="w3-bar-item w3-green" >Recharge using &#8658;</div>
                    <button className={"tab-selector w3-bar-item w3-button " + (isActive('card') ? ' w3-dark-grey' : '')} onClick={() => setActiveTab('card')}>Credit Card</button>
                    <button className={"tab-selector w3-bar-item w3-button " + (isActive('transfer') ? ' w3-dark-grey' : '')} onClick={() => setActiveTab('transfer')}>Transfer</button>
                    <button className={"tab-selector w3-bar-item w3-button " + (isActive('cash') ? ' w3-dark-grey' : '')} onClick={() => setActiveTab('cash')}>Cash</button>
                </div>

                <HeightTransition initial={0} id="card" activeId={rechargeActiveTab}>
                    <div className="w3-container city w3-animate-opacity w3-display-container w3-margin w3-light-grey">
                        <table>
                            <tbody>
                                <tr>
                                    <td>
                                        <span onClick={() => setActiveTab('')} className="w3-button w3-display-topright">X</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <label className="no-margins">Card number</label>
                                        <input ref={cardNumber} type="number" className={"w3-input width-150px w3-hover-border-blue " + (errors.number ? 'w3-border w3-border-red' : '')} placeholder="Insert card number" />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <label className="no-margins">Holder</label>
                                        <input ref={cardHolder} type="text" className={"w3-input width-150px w3-hover-border-blue " + (errors.holder ? 'w3-border w3-border-red' : '')} placeholder="Insert holder" />
                                    </td>
                                </tr>

                                <tr>
                                    <td>
                                        <label className="no-margins" htmlFor="ex_date">Expiration date</label>
                                        <input ref={cardExpiration} type="date" id="ex_date" className={"w3-input w3-hover-border-blue " + (errors.expiration ? 'w3-border w3-border-red' : '')} style={{ width: '160px' }} placeholder="Insert expiration date" />
                                    </td>
                                    <td>
                                        <label className="no-margins" htmlFor="cvv">CVV</label>
                                        <input ref={cardCvv} type="text" pattern="\d*" maxLength="3" id="cvv" className={"w3-input w3-hover-border-blue " + (errors.cvv ? 'w3-border w3-border-red' : '')} style={{ width: '100px' }} placeholder="Insert CVV" />
                                    </td>
                                </tr>

                                <tr>
                                    <td colSpan="2">
                                        <label className="no-margins w3-text-green" htmlFor="amount">Amount</label>
                                        <input ref={amount} type="number" min="1" step="any" id="amount" className={"w3-input width-150px w3-hover-border-green " + (errors.amount ? 'w3-border w3-border-red' : '')} placeholder="€" />
                                    </td>
                                </tr>
                                <tr>
                                    <td colSpan="2">
                                        <input type="button" className="w3-button w3-orange w3-margin w3-center" defaultValue="Recharge" onClick={() =>
                                            props.functions.rechargeWithCard(
                                                cardNumber.current.value,
                                                cardHolder.current.value.trim(),
                                                cardExpiration.current.value,
                                                cardCvv.current.value,
                                                amount.current.value,
                                                setCardProgress,
                                                setErrors,
                                                setActiveTab,
                                                setLastAmount
                                            )} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className={"w3-light-grey w3-margin"}>
                            <Progress completed={cardProgress} />
                        </div>
                    </div>
                </HeightTransition>

                <HeightTransition initial={0} id="transfer" activeId={rechargeActiveTab}>
                    <div className="w3-container city w3-animate-opacity w3-display-container w3-margin w3-light-grey">
                        <span onClick={() => setActiveTab('')} className="w3-button w3-display-topright">X</span>
                        <h2 className="w3-margin-big">Recharge via <span className="w3-text-yellow">IBAN</span></h2>
                        <h5 className="w3-margin-big w3-text-red">IT47D0300203280642246613587</h5>
                        <p className="w3-margin-big">Make a transfer to this IBAN to top up your credit</p>
                    </div>
                </HeightTransition>

                <HeightTransition initial={0} id="cash" activeId={rechargeActiveTab}>
                    <div className="w3-container city w3-animate-opacity w3-display-container w3-margin w3-light-grey">
                        <span onClick={() => setActiveTab('')} className="w3-button w3-display-topright">X</span>
                        <h2 className="w3-margin-big">Recharge via <span className="w3-text-green">Cash</span></h2>
                        <h5 className="w3-margin-big w3-text-red">Wall St., Whashington DC, USA</h5>
                        <p className="w3-margin-big">Send cash to this address to recharge</p>

                    </div>
                </HeightTransition>

                <HeightTransition initial={0} id="recharged" activeId={rechargeActiveTab}>
                    <div className="w3-container city w3-animate-opacity w3-display-container w3-margin w3-light-grey">
                        <span onClick={() => setActiveTab('')} className="w3-button w3-display-topright">X</span>
                        <h2 className="w3-margin-big">Recharge <span className="w3-text-green">SUCCESSFUL</span>!</h2>
                        <h5 className="w3-margin-big">Your credit is been increased by <span className="w3-text-blue">{lastAmount}</span> €</h5>
                        <p className="w3-margin-big">Check your credit to verify the total balance</p>
                    </div>
                </HeightTransition>

                <HeightTransition initial={0} id='' activeId={rechargeActiveTab}>
                    <div className="w3-container city w3-animate-opacity w3-display-container w3-margin w3-light-grey">
                        <h2 className="w3-margin-big">Recharge <span className="w3-text-yellow">Now</span>!</h2>
                    </div>
                </HeightTransition>
            </div>
        </>
    );
}