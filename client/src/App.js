import React, { useState,useEffect,useRef } from "react";
import {Switch,Route,Router} from "react-router";
import { createBrowserHistory } from "history";
import Catalog from './components/Catalog.js';
import Editing from './components/Editing.js';
import NavBar from './components/NavBar.js';
import './style/style.css'
import './style/w3.css'

function App() {
  const customHistory = createBrowserHistory();

	const [user,setUser] = useGetUser(); //NOT IMPLEMENTED YET
	const [currentSection, setCurrentSection] = useState(undefined);
	const [sections,setSections] = useGetSectionsFromDb();
	const [products,setProducts] = useGetProductsFromDb(currentSection);
  	const [chart,setChart] = useGetChartFromDb(user);


 
	//select first section by default
	useEffect(() => {
		if(!currentSection && sections.length>0)
			setCurrentSection(sections[0].id);
  },[sections.length]);
  
  const states = {
    user: user,setUser: setUser,
    currentSection: currentSection,setCurrentSection: setCurrentSection,
    sections:sections,setSections:setSections,
    products:products,setProducts:setProducts,
    chart:chart,setChart:setChart,
  }

	const functions = {
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
							productId: productId,
							userId: user.id
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
					  userId: user.id
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
    <Router history={customHistory}>
      <div className="App">
        <NavBar/>
        <Switch>
          <Route path="/catalog" render={(props) => <Catalog {...props} functions={functions} states={states}/> }/>
          <Route path="/editing" render={(props) => <Editing {...props} functions={functions} states={states}/> }/>
        </Switch>
      </div>
    </Router>
  );
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

function useGetChartFromDb(user) {
	const [chart,setChart] = useState([]);

	useEffect(()=> {
		fetch('/chart/getChart',{
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			  },
			  body: JSON.stringify({
				  userId: user.id
				})
		})
		.then(res => res.json())
		.then(res => setChart(res));
	},[user.id]);

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

function useGetUser() {
	const [user, setUser] = useState({});

	useEffect(() => {
		setUser({
			id: 'TEST',
			username: 'badLice',
      balance: 897.15,
      privileges: 0
		});
	},[])

	return [user, setUser];
}
export default App;

