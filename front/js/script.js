// --- Variables
const url = 'http://localhost:3000/api/products/'
const domProduct = document.getElementById('items')

// --- Product
async function FindProducts() {
	// --- Request all product
	let req = await fetch(url)
	let res = await req.json()

	// --- Check exist product
	if(res.length > 0 && req.ok) {
		// --- Loop product
		for(let data of res) {
			// --- Create link
			let createLink = document.createElement('a')
			domProduct.appendChild(createLink)
			createLink.href = `product.html?id=${data._id}`

			// --- Create article
			let createArticle = document.createElement('article')
			createLink.appendChild(createArticle)

			// --- Create thumbnail
			let createThumb = document.createElement('img')
			createArticle.appendChild(createThumb)
			createThumb.src = data.imageUrl
			createThumb.alt = data.altTxt;

			// --- Create title
			let createTitle = document.createElement('h3')
			createArticle.appendChild(createTitle)
			createTitle.classList.add('productName')
			createTitle.innerHTML = data.name

			// --- Create description
			let createDescription = document.createElement('p')
			createArticle.appendChild(createDescription)
			createDescription.classList.add('productDescription')
			createDescription.innerHTML = data.description
		}
	}else if(!req.ok) {
		alert('Une erreur est survenue')
	}else {
		alert('Aucun articles n\'a été trouvé')
	}
}

// --- Call Product
(async () => FindProducts())()