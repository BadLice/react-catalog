import React, { useState, useEffect, } from "react";
import {Switch,	Route, Redirect, useHistory } from "react-router-dom";
import Catalog from './components/Catalog.js';
import Editing from './components/Editing.js';
import Login from './components/Login.js';

import './style/style.css'
import './style/w3.css'
import './style/main.css'
import './style/util.css'
import "./vendor/bootstrap/css/bootstrap.min.css"
import "./fonts/font-awesome-4.7.0/css/font-awesome.min.css"
import "./fonts/iconic/css/material-design-iconic-font.min.css"
import "./vendor/animate/animate.css"
import "./vendor/css-hamburgers/hamburgers.min.css"
import "./vendor/animsition/css/animsition.min.css"
import "./vendor/select2/select2.min.css"
import "./vendor/daterangepicker/daterangepicker.css"

const SHA256 = require("crypto-js/sha256");

export default (props) => {
	var history = useHistory();
	const [isAuthenticated, setAuthenticated] = useAuth();
	const [user,setUser] = useGetUserData(history);
	const [currentSection, setCurrentSection] = useState(undefined);
	const [sections,setSections] = useGetSectionsFromDb();
	const [products,setProducts] = useGetProductsFromDb(currentSection);
	const [chart,setChart] = useGetChartFromDb();
 
	//select first section by default
	useEffect(() => {
		if(!currentSection && sections.length>0)
			setCurrentSection(sections[sections.map(s => s.hasProducts).indexOf(1)].id);
	}, [sections.length]);
  
	const states = {
		history: history,
		user: user, setUser: setUser,
		currentSection: currentSection,setCurrentSection: setCurrentSection,
		sections:sections,setSections:setSections,
		products:products,setProducts:setProducts,
		chart:chart,setChart:setChart,
	}
	const functions = {
		login: (username,password) => {
			fetch('/user/login', { //server tries to login and sets catalog_user cookie
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username: username, password: SHA256(password).toString() })
			})
			.then(res => res.json())
			.then(res => {
				if (res.success) {
					setAuthenticated(true);
					let from = history.location.state ? history.location.state.from : null;
					history.push( from ? from : '/catalog');
				} else {
					setAuthenticated(false);
				}
			});
		},
		setSection: (section) => {
			//validation
			let errors = {
				nameErr: section.name.length <= 0        
			}
			if(!errors.nameErr) {
				fetch('/sections/addSection',{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
					},
					body: JSON.stringify({section: section})
				})
				.then(res => res.json())
				.then(res => {
					if(res.success) {
						section.id = res.sectionId;
						let s = [...sections];
						s.push(section)
						setSections(s);
					}
				});
			}
			return errors;
		},
		setCurrentSection: (sectionId) => setCurrentSection(sectionId),
		setProduct: (product,image) => {
			let p = [...products];
			let index = p.map(o => o.id).indexOf(product.id);

			//validation
			let errors = {
				moneyErr: product.price === undefined || product.price === '' || product.price === null || isNaN(product.price),
				avaliableErr: product.avaliable === undefined || product.avaliable === '' || product.avaliable === null || isNaN(product.avaliable) || parseFloat(product.avaliable) % 1 !== 0,
				nameErr: product.name === undefined || product.name === '' || product.name === null,
				producerErr: product.producer === undefined || product.producer === '' || product.producer === null,
				sectionErr : product.sections.length <= 0,
			}

			var productFormData = new FormData();
			productFormData.append('file', image);
			productFormData.append('product',JSON.stringify(product));
			
			product.price = parseFloat(product.price).toFixed(2);

			if(!errors.moneyErr && !errors.avaliableErr && !errors.nameErr && !errors.producerErr && !errors.sectionErr) {
				fetch('/products/addProduct',{
				method: 'POST',
				body: productFormData,
				})
				.then(res => res.json())
				.then(res => {
					if(res.success) {
						product.id = res.productIt;
						p.push(product);
						setProducts(p);
					}
				})
			}
			return errors;
	  	},
		addToChart: (productId) => {
			let p = [...products];
			let index = p.map(o => o.id).indexOf(productId);
			functions.isInChart(productId).then((alreadyInChart) => {
				if(!alreadyInChart) {
					fetch('/chart/addToChart',{
						method: 'POST',
						headers: {
							'Accept': 'application/json',
							'Content-Type': 'application/json'
						},
						body: JSON.stringify({
							productId: productId
							})
					})
					.then(res => res.json())
					.then(res => {
						if(res.success) {
							let c = [...chart];
							c.push(productId);
							setChart(c);
						}
					})
				}
			});
		},
		isInChart: (productId) => {
			return fetch('/chart/isInChart',{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				  },
				  body: JSON.stringify({
					  productId: productId,
					})
			})
			.then(res => res.json())
			.then(res => {
				if(res.success) {
					return res.contained;
				}
			});
			
		},
	}
	
	return (
		<div className="App">
			<Switch>
				<PrivateRoute path="/catalog" isAuthenticated={isAuthenticated}>
					<Catalog {...props} functions={functions} states={states} />
				</PrivateRoute>

				<PrivateRoute path="/editing" isAuthenticated={isAuthenticated}>
					<Editing {...props} functions={functions} states={states} />
				</PrivateRoute>

				<Route path="/login" render={(props) => <Login {...props} functions={functions} states={states} />} />
				<Route path="/" render={(props) => <Login {...props} functions={functions} states={states} />} />
			</Switch>
		</div>
	);
}

// A wrapper for <Route> that redirects to the login screen if you're not yet authenticated.
const PrivateRoute = ({ children, ...rest }) => {
	if(rest.isAuthenticated !== undefined && rest.isAuthenticated !== null) {
		return (
			<Route
				{...rest}
				render={
					props =>
						 rest.isAuthenticated ? (
						children
					) : (
						<Redirect
							to={{
								pathname: "/login",
								state: { from: props.location }
							}}
						/>
					)
				}
			/>
		);
	} else {
		return <></>;
	}
}

// ----------------------------- connection to db -----------------------------
function useGetSectionsFromDb() {
	const [sections,setSections] = useState([]);

	useEffect(()=> {
		fetch('/sections/getSections',{
			method: 'POST',
		})
		.then(res => res.json())
		.then(res => {setSections(res)})
	},[]);

	return [sections,setSections];
}

function useGetChartFromDb() {
	const [chart,setChart] = useState([]);

	useEffect(()=> {
		fetch('/chart/getChart',{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  }
		})
		.then(res => res.json())
		.then(res => setChart(res));
	},[]);

	return [chart,setChart];
}

function useGetProductsFromDb(currentSection) {
	const [products, setProducts] = useState([]);

	//--------------- FAKE DB --------------
	// useEffect(() => {
	// 	setProducts([
	// 		{
	// 			id: uuidv4(),
	// 			name: 'Alexa',
	// 			producer: 'Amazon',
	// 			price: 59.99,
	// 			avaliable: 100,
	// 		},
	// 		{
	// 			id: uuidv4(),
	// 			name: 'Home',
	// 			producer: 'Google',
	// 			price: 49.99,
	// 			avaliable: 200,
	// 		},
	// 		{
	// 			id: uuidv4(),
	// 			name: 'Home Mini',
	// 			producer: 'Google',
	// 			price: 29.99,
	// 			avaliable: 500,
	// 		},
	// 		{
	// 			id: uuidv4(),
	// 			name: 'Firestick',
	// 			producer: 'Amazon',
	// 			price: 19.99,
	// 			avaliable: 150,
	// 		},
	// 		{
	// 			id: uuidv4(),
	// 			name: 'Chromecast',
	// 			producer: 'Google',
	// 			price: 19.99,
	// 			avaliable: 550,
	// 		},
	// 	])
	// },[])

	useEffect(()=> {
		fetch('/products/getProducts',{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify({sectionId: currentSection})
		})
		.then(res => res.json())
		.then(res => {setProducts(res)})
	},[currentSection]);

	return [products,setProducts];
}

function useAuth() {
	const [isAuthenticated, setAuthenticated] = useState();

	useEffect(() => {
		fetch('/user/authenticate', {
			method: 'POST',
		})
		.then(res => res.json())
		.then(res => {
			if (res.success) {
				setAuthenticated(true);
			} else {
				setAuthenticated(false);
			}
		});
	}, []);

	return  [isAuthenticated, setAuthenticated];
}

function useGetUserData(history) {
	const [user, setUser] = useState(-1);
	
	useEffect(() => {
		fetch('/user/getUserData', {
			method: 'POST',
		})
		.then(res => res.json())
		.then(res => {
			if (res.success) {
				setUser({
					id: res.user.id,
					username: res.user.username,
					balance: parseFloat(res.user.balance),
					privileges: parseInt(res.user.privileges),
				})
			}
		});
	}, [history.location.pathname]);

	return [user, setUser];
}

