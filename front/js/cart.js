// --- Variables
const url = 'http://localhost:3000/api/products/'
const itemList = document.querySelector('#cart__items')

// --- Find one product
async function FindPanier() {
	// --- Variables
	let items = localStorage.getItem('productList')
	let itemsBack = await (await fetch(url)).json()
	let panier

	// --- Check panier and return item panier
	if(items === null) {
		panier = []
	}else {
		panier = JSON.parse(items)
	}

	// --- Check id panier is empty
	if (panier.length === 0) {
		itemList.innerHTML = '<p>Le panier est vide</p>'
	}else {
		// --- Variables
		let amount = 0
		let quantity = 0

		for(let item of panier) {
			// --- Create element article
			let itemArticle = document.createElement('article')
			itemList.appendChild(itemArticle)
			itemArticle.className = 'cart__item'
			itemArticle.setAttribute('data-id', item.id)
			itemArticle.setAttribute('data-color', item.color)

			// --- Create content thumbnail
			let itemContentThumb = document.createElement('div')
			itemArticle.appendChild(itemContentThumb)
			itemContentThumb.className = 'cart__item__img'

			// --- Add thumbnail
			let itemThumb = document.createElement('img')
			itemContentThumb.appendChild(itemThumb)
			itemThumb.src = item.imgUrl
			itemThumb.alt = item.altImg

			// --- Create content item
			let itemContent = document.createElement('div')
			itemArticle.appendChild(itemContent)
			itemContent.className = 'cart__item__content'

			// --- Create content element
			let itemContentTitle = document.createElement('div')
			itemContent.appendChild(itemContentTitle)
			itemContentTitle.className = 'cart__item__content__titlePrice'

			// --- Add title
			let itemTitle = document.createElement('h2')
			itemContentTitle.appendChild(itemTitle)
			itemTitle.innerText = item.name

			// --- Add color
			let itemColor = document.createElement('p')
			itemTitle.appendChild(itemColor)
			itemColor.innerText = item.color

			// --- Create price
			let itemContentPrice = document.createElement('p')
			itemContentTitle.appendChild(itemContentPrice)

			// --- Update amount
			for(let productBack of itemsBack) {
				// --- Check ID
				if(productBack._id === item.id) {
					// --- Add price
					itemContentPrice.innerText = `${productBack.price * item.quantity} €`

					// --- Add total amount
					amount += (productBack.price * item.quantity)
				}
			}

			// --- Create content setting
			let itemContentSetting = document.createElement('div')
			itemContent.appendChild(itemContentSetting)
			itemContentSetting.className = 'cart__item__content__settings'

			// --- Add content quantity
			let itemContentQuantity = document.createElement('div')
			itemContentSetting.appendChild(itemContentQuantity)
			itemContentQuantity.className = 'cart__item__content__settings__quantity'

			// --- Add text quantity
			let itemQuantityText = document.createElement('p')
			itemContentQuantity.appendChild(itemQuantityText)
			itemQuantityText.innerText = 'Qté : '

			// --- Add input quantity
			let productQuantity = document.createElement('input')
			itemContentQuantity.appendChild(productQuantity)
			productQuantity.value = item.quantity
			productQuantity.className = 'itemQuantity'
			productQuantity.setAttribute('type', 'number')
			productQuantity.setAttribute('min', '1')
			productQuantity.setAttribute('max', '100')
			productQuantity.setAttribute('name', 'itemQuantity')

			// --- Update amount
			quantity += parseInt(item.quantity)

			// --- Create content delete
			let itemContentDelete = document.createElement('div')
			itemContentSetting.appendChild(itemContentDelete)
			itemContentDelete.className = 'cart__item__content__settings__delete'

			// --- Create action delete
			let productSupprimer = document.createElement('p')
			itemContentDelete.appendChild(productSupprimer)
			productSupprimer.className = 'deleteItem'
			productSupprimer.innerHTML = 'Supprimer'
		}

		// --- Add quantity
		let itemQuantity = document.getElementById('totalQuantity')
		itemQuantity.innerText = quantity

		// --- Add total
		let itemTotal = document.getElementById('totalPrice')
		itemTotal.innerText = amount
	}

	// --- Update quantity
	await UpdateQuantity(panier)

	// --- Remove item
	await RemoveItem(panier)
}

// --- Update quantity
async function UpdateQuantity(panier) {
	// --- Variables
	let elementQuantity = document.querySelectorAll('.itemQuantity')
	let itemsBack = await (await fetch(url)).json()

	// --- Search element quantity
	elementQuantity.forEach(elem => {
		// --- Variables
		let element = elem.closest('article')
		let id = element.dataset.id
		let color = element.dataset.color

		// --- Event change quantity
		elem.addEventListener('change', async () => {
			// --- Variables
			let amount = 0
			let quantity = 0
			let indexElem = panier.findIndex(elemI => elemI.id === id && elemI.color === color)

			// --- Check element quantity
			if(panier.quantity !== elem.valueAsNumber && elem.valueAsNumber > 0) {
				// --- Update amount
				for(let productBack of itemsBack) {
					// --- Check ID
					if(productBack._id === panier[indexElem].id) {
						// --- Update price
						element.children[1].children[0].children[1].innerHTML = `${(productBack.price * elem.valueAsNumber)} €`
					}
				}

				// --- Update panier
				panier[indexElem].quantity = elem.valueAsNumber
				//quantity = elem.valueAsNumber

				// --- Save new quantity
				localStorage.setItem('productList', JSON.stringify(panier))
			}else if(elem.valueAsNumber <= 0) {
				// --- Message
				alert('veuillez entrer une valeur supérieur à 0')
			}

			// --- Loop panier
			for(let item of panier){
				// --- Update amount
				for(let productBack of itemsBack) {
					// --- Check ID
					if(productBack._id === item.id) {
						// --- Update total amount
						amount += (productBack.price * item.quantity)
					}
				}

				// --- Update quantity
				quantity += parseInt(item.quantity)
			}

			// --- Add quantity
			let itemQuantity = document.getElementById('totalQuantity')
			itemQuantity.innerText = quantity

			// --- Add total
			let itemTotal = document.getElementById('totalPrice')
			itemTotal.innerText = amount
		})
	})
}

// --- Remove item
async function RemoveItem(panier) {
	// --- Variables
	let buttonRemove = document.querySelectorAll('.deleteItem')
	let itemsBack = await (await fetch(url)).json()

	// --- Search button delete
	buttonRemove.forEach(elem => {
		// --- Variables
		let element = elem.closest('article')
		let id = element.dataset.id
		let color = element.dataset.color
		let amount = 0
		let quantity = 0

		// --- Event click remove
		elem.addEventListener('click', async () => {
			// --- Search item element
			panier = panier.filter(elementFilter => elementFilter.id !== id || elementFilter.color !== color)

			// --- Update item panier
			localStorage.setItem('productList', JSON.stringify(panier))

			// --- Message
			alert(`Le produit a été supprimer du panier`)

			// --- Loop panier
			for(let item of panier){
				// --- Update amount
				for(let productBack of itemsBack) {
					// --- Check ID
					if(productBack._id === item.id) {
						// --- Update total amount
						amount += (productBack.price * item.quantity)
						console.log(item)
					}
				}

				// --- Update quantity
				quantity += parseInt(item.quantity)
			}

			// --- Add quantity
			let itemQuantity = document.getElementById('totalQuantity')
			itemQuantity.innerText = quantity

			// --- Add total
			let itemTotal = document.getElementById('totalPrice')
			itemTotal.innerText = amount

			// --- Update quantity
			await UpdateQuantity(panier)

			// --- Delete element
			element.remove()
		})
	})
}

// --- Call Product
(async () => FindPanier())()

// --- Form
// --- Regex -> https://regexr.com/
const emailReg = new RegExp('^[A-Za-z0-9.-_]+[@]{1}[A-Za-z0-9.-_]+[.]{1}[a-z]{2,}$')
const textReg = new RegExp("^[A-Za-zàâäéèêëïîôöùûüç '-]+$")
const addressReg = new RegExp("^[0-9]{1,3}(?:(?:[,. ]){1}[-A-Za-zàâäéèêëïîôöùûüç]+)+")

// --- Form firstname
function CheckFirstname(val) {
	// --- Variables
	let errorFirstname = document.getElementById('firstNameErrorMsg')

	// --- Check value
	if(textReg.test(val.value)) {
		errorFirstname.innerHTML = ''
		return true
	}else {
		errorFirstname.innerHTML = 'Veuillez saisir votre prénom'
		return false
	}
}

// --- Form lastname
function CheckLastname(val) {
	// --- Variables
	let errorLastname = document.getElementById('lastNameErrorMsg')

	// --- Check value
	if(textReg.test(val.value)) {
		errorLastname.innerHTML = ''
		return true
	}else {
		errorLastname.innerHTML = 'Veuillez saisir votre nom'
		return false
	}
}

// --- Form address
function CheckAddress(val) {
	// --- Variables
	let errorAddress = document.getElementById('addressErrorMsg')

	// --- Check value
	if(addressReg.test(val.value)) {
		errorAddress.innerHTML = ''
		return true
	}else {
		errorAddress.innerHTML = 'Veuillez saisir votre adresse complète'
		return false
	}
}

// --- Form city
function CheckCity(val) {
	// --- Variables
	let errorCity = document.getElementById('cityErrorMsg')

	// --- Check value
	if(textReg.test(val.value)) {
		errorCity.innerHTML = ''
		return true
	}else {
		errorCity.innerHTML = 'Veuillez saisir votre ville'
		return false
	}
}

// --- Form email
function CheckEmail(val) {
	// --- Variables
	let errorEmail = document.getElementById('emailErrorMsg')

	// --- Check value
	if(emailReg.test(val.value)) {
		errorEmail.innerHTML = ''
		return true
	}else {
		errorEmail.innerHTML = 'Veuillez saisir votre adresse mail'
		return false
	}
}

// --- Form submit
function Submit(evt) {
	// --- Event
	evt.preventDefault()

	// --- Variables
	let panier = localStorage.getItem('productList')

	// --- Select value
	let inputFirstname = document.getElementById('firstName')
	let inputLastname = document.getElementById('lastName')
	let inputAddress = document.getElementById('address')
	let inputCity = document.getElementById('city')
	let inputEmail = document.getElementById('email')

	// --- Check value
	let checkFirstname = CheckFirstname(inputFirstname)
	let checkLastname = CheckLastname(inputLastname)
	let checkAddress = CheckAddress(inputAddress)
	let checkCity = CheckCity(inputCity)
	let checkEmail = CheckEmail(inputEmail)

	// --- Check
	if(panier === null) {
		alert('Votre panier est vide')
	}else if(checkFirstname && checkLastname && checkAddress && checkCity && checkEmail) {
		// --- Variables
		let arrayPanier = []
		let objectPanier = JSON.parse(panier)

		// --- Update Array
		for(let i=0;i<objectPanier.length;i++) {
			arrayPanier.push(objectPanier[i].id)
		}

		// --- Create order
		let createOrder = {
			contact: {
				firstName: inputFirstname.value,
				lastName: inputLastname.value,
				address: inputAddress.value,
				city: inputCity.value,
				email: inputEmail.value,
			},
			products: arrayPanier
		}

		// --- Send order
		fetch('http://localhost:3000/api/products/order', {
			method:'POST',
			body: JSON.stringify(createOrder),
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			}
		})
			.then(res => res.json())
			.then(data => {
				// --- Check exist order ID
				if(data.orderId) {
					// --- Clear storage
					localStorage.clear()

					// --- Redirect customer
					document.location.href = `confirmation.html?id=${data.orderId}`
				}
			})
			.catch(err => alert(`Une erreur est survenue : ${err.message}`))
	}else {
		alert('Veuillez remplir le formulaire')
	}
}

// --- Event
const ButtonSubmit = document.getElementById('order')
ButtonSubmit.addEventListener('click', evt => Submit(evt))