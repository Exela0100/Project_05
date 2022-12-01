// --- Variables
const url = 'http://localhost:3000/api/products/'
const params = new URLSearchParams(window.location.search)
const id = params.get('id')
const quantityProduct = document.querySelector('#quantity')
const colorProduct = document.querySelector('#colors')

// --- Find one product
async function FindOneProduct() {
	// --- Request all product
	let req = await fetch(url+id)
	let res = await req.json()

	// --- Check exist product
	if(Object.keys(res).length > 0 && req.ok) {
		// --- Add thumbnail
		let addImg = document.createElement('img')
		document.querySelector('.item__img').appendChild(addImg)
		addImg.src = res.imageUrl
		addImg.alt = res.altTxt

		// --- Add title
		let addName = document.getElementById('title')
		addName.innerText = res.name

		// --- Add price
		let addPrice = document.getElementById('price')
		addPrice.innerText = res.price

		// --- Add description
		let addDescription = document.getElementById('description')
		addDescription.innerText = res.description

		// --- Add colors
		let colors = document.querySelector('#colors')
		for (let color of res.colors){
			let addColors = document.createElement('option')
			colors.appendChild(addColors)
			addColors.value = color
			addColors.innerText = color
		}

		// --- Charge event
		SetCard(res)
	}else if(!req.ok) {
		// --- Message
		alert('Une erreur est survenue')

		// --- Redirect customer
		document.location.href = "index.html"
	}else {
		// --- Message
		alert('Aucun articles n\'a été trouvé')

		// --- Redirect customer
		document.location.href = "index.html"
	}
}

// --- Add card
function SetCard(product) {
	// --- Variables
	let btnCart = document.getElementById("addToCart")

	// --- Event button click
	btnCart.addEventListener('click', () => {
		// --- Variables
		let quantity = quantityProduct.value
		let color = colorProduct.value

		// --- Check product selected
		if(quantity >= 1 && quantity <= 100 && color !== "") {
			// --- Product object
			let productToCard = {
				id: product._id,
				color,
				quantity,
				name: product.name,
				imgUrl: product.imageUrl,
				altImg: product.altTxt
			}

			// --- Add panier
			SetPanier(productToCard)
		}else {
			alert('Veuillez sélectionner un quantité entre 1 et 100 et une couleur')
		}
	})
}

// --- Add product to panier
function SetPanier(product) {
	// --- Check panier
	let panier = GetPanier()

	// --- Check product exist to storage
	let checkProduct = panier.find(panier => panier.id === product.id && panier.color === product.color)

	// --- Update panier
	if(checkProduct !== undefined) {
		if((parseInt(checkProduct.quantity) + parseInt(product.quantity)) >= 1 && (parseInt(checkProduct.quantity) + parseInt(product.quantity)) <= 100) {
			// --- Update quantity
			checkProduct.quantity = parseInt(checkProduct.quantity) + parseInt(product.quantity)

			// --- Redirect customer
			document.location.href = "cart.html"
		}else {
			alert(`La quantité totale ne doit pas dépasser 100, Vous avez actuellement : ${checkProduct.quantity}/100 pour le produit de la couleur ${product.color}`)
		}
	}else {
		// --- Add product to panier
		panier.push(product)

		// --- Redirect customer
		document.location.href = "cart.html"
	}

	// --- Save product to storage
	localStorage.setItem('productList', JSON.stringify(panier))
}

// --- Check panier
function GetPanier() {
	// --- Variables
	let storage = localStorage.getItem('productList')

	// --- Check storage
	if(storage !== null) {
		return JSON.parse(storage)
	}else {
		return []
	}
}

// --- Call Product
(async () => FindOneProduct())()