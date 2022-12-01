// --- Variables
const params = new URLSearchParams(window.location.search)
const id = params.get('id')
const orderID = document.getElementById('orderId')

// --- Show ID order
orderID.innerText = id