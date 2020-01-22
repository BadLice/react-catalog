import React, { useEffect, useState } from "react";
import { Redirect, Route, Switch, useHistory } from "react-router-dom";

import Balance from './components/balance';
import Catalog from './components/catalog';
import Editing from './components/edit';
import Cart from './components/cart'
import Login from './components/login';

import "./fonts/font-awesome-4.7.0/css/font-awesome.min.css"
import "./fonts/iconic/css/material-design-iconic-font.min.css"
import './style/main.css'
import './style/style.css'
import './style/util.css'
import './style/w3.css'
import "./vendor/animate/animate.css"
import "./vendor/animsition/css/animsition.min.css"
import "./vendor/bootstrap/css/bootstrap.min.css"
import "./vendor/css-hamburgers/hamburgers.min.css"
import "./vendor/daterangepicker/daterangepicker.css"
import "./vendor/select2/select2.min.css"

export default (props) => {
	var history = useHistory();
	const [isAuthenticated, setAuthenticated] = useAuth();
	const [userToUpdate, setUserToUpdate] = useState(false);
	const [user, setUser] = useGetUserData(history, userToUpdate);
	const [currentSection, setCurrentSection] = useState(undefined);
	const [currentSellingSection, setCurrentSellingSection] = useState(undefined);
	const [sections, setSections] = useGetSectionsFromDb();
	const [products, setProducts] = useGetProductsFromDb(currentSection);
	const [cart, setCart] = useGetChartFromDb();
	const [editingProductId, setEditProductId] = useState('');
	const [sellingSectionsToUpdate, setSellingSectionsToUpdate] = useState(false);
	const [sellingProductsToUpdate, setSellingProductsToUpdate] = useState(false);
	const [sellingSections, setSellingSections] = useGetSellingSectionsFromDb(sellingSectionsToUpdate);
	const [sellingProducts, setSellingProducts] = useGetSellingProductsFromDb(currentSellingSection, sellingProductsToUpdate);

	//select first section by default
	useEffect(() => {
		if (!currentSection && sections.length > 0)
			setCurrentSection(sections[sections.map(s => s.hasProducts).indexOf(1)].id);
	}, [sections.length]);

	const states = {
		history: history,
		user: user, setUser: setUser,
		currentSection: currentSection, setCurrentSection: setCurrentSection,
		sections: sections, setSections: setSections,
		products: products, setProducts: setProducts,
		cart: cart, setCart: setCart,
		editingProductId: editingProductId, setEditProductId: setEditProductId,
		sellingSections: sellingSections, setSellingSections: setSellingSections,
		sellingProducts: sellingProducts, setSellingProducts: setSellingProducts,
		currentSellingSection: currentSellingSection, setCurrentSellingSection: setCurrentSellingSection
	}
	const functions = {
		updateUser: () => setUserToUpdate(!userToUpdate),
		updateSellingSections: () => setSellingSectionsToUpdate(!sellingSectionsToUpdate),
		updateSellingProducts: () => setSellingProductsToUpdate(!sellingProductsToUpdate),
		saveProduct: (product, image) => {
			let errors = { //validation
				moneyErr: product.price === undefined || product.price === '' || product.price === null || isNaN(product.price),
				avaliableErr: product.avaliable === undefined || product.avaliable === '' || product.avaliable === null || isNaN(product.avaliable) || parseFloat(product.avaliable) % 1 !== 0,
				nameErr: product.name === undefined || product.name === '' || product.name === null,
				producerErr: product.producer === undefined || product.producer === '' || product.producer === null,
				sectionErr: product.sections.length <= 0,
			}

			if (!errors.nameErr && !errors.producerErr && !errors.moneyErr && !errors.avaliableErr && !errors.sectionErr) {
				var productFormData = new FormData();
				productFormData.append('file', image);
				productFormData.append('product', JSON.stringify(product));

				fetch('/products/saveProduct', {
					method: 'POST',
					body: productFormData,
				})
					.then(res => res.json())
					.then(res => {
						if (res.success) {
							functions.updateSellingSections();
							functions.updateSellingProducts();
						}
					});
			}
			return errors;
		},
		login: (username, password) => {
			fetch('/user/login', { //server tries to login and sets catalog_user cookie
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username: username, password: password }) //only HTTPS!!! (http only for development build)
			})
				.then(res => res.json())
				.then(res => {
					if (res.success) {
						setAuthenticated(true);
						let from = history.location.state ? history.location.state.from : null;
						history.push(from ? from : '/catalog');
					} else {
						setAuthenticated(false);
					}
				});
		},
		singup: (username, password) => {
			fetch('/user/signup', { //server tries to login and sets catalog_user cookie
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({ username: username, password: password }) //only HTTPS!!! (http only for development build)
			})
				.then(res => res.json())
				.then(res => {
					if (res.success) {
						setAuthenticated(true);
						let from = history.location.state ? history.location.state.from : null;
						history.push(from ? from : '/catalog');
					} else {
						setAuthenticated(false);
					}
				});
		},
		rechargeWithCard: (number, holder, expiration, cvv, amount, setProgress, setErrors, setActiveTab, setLastAmount) => {
			fetch('/user/rechargeCard', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					number: number,
					holder: holder,
					expiration: expiration,
					cvv: cvv,
					amount: amount
				})
			})
				.then(res => res.json())
				.then(res => {
					//increase progress bar (fake loading..)
					let progress = 0;
					let elaborateProgress = setInterval(() => {
						if (progress < 100) {
							setProgress(progress)
							progress += Math.random() * 30
						} else {
							if (res.success) {
								setProgress(100);
								setLastAmount(amount);
								functions.updateUser();
								setErrors({});
								setActiveTab('recharged');
							} else {
								setProgress(0);
								setErrors(res.errors);
							}
							clearInterval(elaborateProgress)
						}
					}, 500);
					//-------------
				});
		},
		setSection: (section) => {
			//validation
			let errors = {
				nameErr: section.name.length <= 0
			}
			if (!errors.nameErr) {
				fetch('/sections/addSection', {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json'
					},
					body: JSON.stringify({ section: section })
				})
					.then(res => res.json())
					.then(res => {
						if (res.success) {
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
		setProduct: (product, image) => {
			let p = [...products];
			// let index = p.map(o => o.id).indexOf(product.id);

			//validation
			let errors = {
				moneyErr: product.price === undefined || product.price === '' || product.price === null || isNaN(product.price),
				avaliableErr: product.avaliable === undefined || product.avaliable === '' || product.avaliable === null || isNaN(product.avaliable) || parseFloat(product.avaliable) % 1 !== 0,
				nameErr: product.name === undefined || product.name === '' || product.name === null,
				producerErr: product.producer === undefined || product.producer === '' || product.producer === null,
				sectionErr: product.sections.length <= 0,
			}

			var productFormData = new FormData();
			productFormData.append('file', image);
			productFormData.append('product', JSON.stringify(product));

			product.price = parseFloat(product.price).toFixed(2);

			if (!errors.moneyErr && !errors.avaliableErr && !errors.nameErr && !errors.producerErr && !errors.sectionErr) {
				fetch('/products/addProduct', {
					method: 'POST',
					body: productFormData,
				})
					.then(res => res.json())
					.then(res => {
						if (res.success) {
							product.id = res.productIt;
							p.push(product);
							setProducts(p);
							functions.updateSellingSections();
							functions.updateSellingProducts();
						}
					})
			}
			return errors;
		},
		addToChart: (productId) => {
			let p = [...products];
			let index = p.map(o => o.id).indexOf(productId);
			functions.isInChart(productId).then((alreadyInChart) => {
				if (!alreadyInChart) {
					fetch('/chart/addToChart', {
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
							if (res.success) {
								let c = [...cart];
								c.push(productId);
								setCart(c);
							}
						})
				}
			});
		},
		isInChart: (productId) => {
			return fetch('/chart/isInChart', {
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
					if (res.success) {
						return res.contained;
					}
				});

		},
	}

	return (
		<div className="w3-full-height">
			<Switch>
				<PrivateRoute path="/catalog" isAuthenticated={isAuthenticated} privileges={2}>
					<Catalog {...props} functions={functions} states={states} />
				</PrivateRoute>

				<PrivateRoute path="/editing" isAuthenticated={isAuthenticated} privileges={1}>
					<Editing {...props} functions={functions} states={states} />
				</PrivateRoute>

				<PrivateRoute path="/balance" isAuthenticated={isAuthenticated} privileges={2}>
					<Balance {...props} functions={functions} states={states} />
				</PrivateRoute>

				<PrivateRoute path="/cart" isAuthenticated={isAuthenticated} privileges={2}>
					<Cart {...props} functions={functions} states={states} />
				</PrivateRoute>

				<Route path="/login" render={(props) => <Login {...props} functions={functions} states={states} />} />
				<Route path="/" render={(props) => <Login {...props} functions={functions} states={states} />} />
			</Switch>
		</div>
	);
}

// A wrapper for <Route> that redirects to the login screen if you're not yet authenticated.
const PrivateRoute = ({ children, ...rest }) => {
	if (rest.isAuthenticated !== undefined && rest.isAuthenticated !== null) {
		return (
			<Route
				{...rest}
				render={
					props =>
						rest.isAuthenticated ? (
							children.props.states.user.privileges <= rest.privileges ? children : <AccessDeniedPage />
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
//page rendered if user has not privileges to see current page
const AccessDeniedPage = () => {
	return <p>access denied.</p>
}

// ----------------------------- connection to db -----------------------------
function useGetSectionsFromDb() {
	const [sections, setSections] = useState([]);

	useEffect(() => {
		fetch('/sections/getSections', {
			method: 'POST',
		})
			.then(res => res.json())
			.then(res => { setSections(res) })
	}, []);

	return [sections, setSections];
}

function useGetChartFromDb() {
	const [chart, setChart] = useState([]);

	useEffect(() => {
		fetch('/chart/getChart', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
			.then(res => res.json())
			.then(res => setChart(res));
	}, []);

	return [chart, setChart];
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

	useEffect(() => {
		fetch('/products/getProducts', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ sectionId: currentSection })
		})
			.then(res => res.json())
			.then(res => { setProducts(res) })
	}, [currentSection]);

	return [products, setProducts];
}

function useAuth() {
	const [isAuthenticated, setAuthenticated] = useState();

	useEffect(() => {
		fetch('/user/authenticate', { //authenticate user using cookies
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

	return [isAuthenticated, setAuthenticated];
}

function useGetUserData(history, userToUpdate) {
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
	}, [history.location.pathname, userToUpdate]);

	return [user, setUser];
}

function useGetSellingSectionsFromDb(toUpdate) {
	const [sellingsections, setSellingsections] = useState([]);

	useEffect(() => {
		fetch('/sections/getSellingSections', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
			.then(res => res.json())
			.then(res => {
				if (res.success) {
					setSellingsections(res.sections);
				}
			});
	}, [toUpdate])

	return [sellingsections, setSellingsections];
}

function useGetSellingProductsFromDb(sectionId, toUpdate) {
	const [sellingProducts, setSellingProducts] = useState(null);

	useEffect(() => {
		if (sectionId) {
			fetch('/products/getSellingProducts', {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					sectionId: sectionId,
				})
			})
				.then(res => res.json())
				.then(res => {
					if (res.success)
						setSellingProducts(res.products);
				})
		}
	}, [sectionId, toUpdate])

	return [sellingProducts, setSellingProducts];
}