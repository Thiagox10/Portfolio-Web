const API_URL = 'https://api.mercadolibre.com/sites/MLB/search?q=$computador';
const olCart = document.querySelector('.cart__items');
const buttonClear = document.querySelector('.empty-cart');
const totalElement = document.querySelector('.total-price');
const button = document.querySelector('.button');
const vitrine = document.querySelector('.items');
const search = document.querySelector('.search');
const logo = document.querySelector('.logo');

function setLocalStorage() {
  const carrinho = olCart.innerHTML;
  localStorage.setItem('cartItems', carrinho);
}

function totalCart(price) {
	let total = parseFloat(totalElement.innerText);
//  console.log(typeof price);
//  console.log(total);
total = total + price
 totalElement.innerText = total.toFixed(2);
 localStorage.setItem('total', total);

//  console.log(totalElement);
}

function totalCartSub(event) {
  const valor = parseFloat(event.target.innerText.split(`$`)[1]);
  // let total = parseFloat(totalElement.innerText);
  const totalStorage = totalElement.innerText;
  const result = totalStorage - valor
  totalElement.innerText = result.toFixed(2);
  localStorage.setItem('total', result);
}

function clearCart() {
 localStorage.setItem('total', 0);
 olCart.innerHTML = '';
 totalElement.innerText = '0';
 setLocalStorage();
}

buttonClear.addEventListener('click', clearCart);

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createProductItemElement({ sku, name, image, price }) {
  const section = document.createElement('section');
  const div = document.querySelector('.items');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('span', 'item__price', `R$ ${price}`));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));
  return div.appendChild(section);
}
// Requisito 3 - Excluir os Items do carrinho ao clicar em cima.
function cartItemClickListener(event) {
 const cartItem = event.target;
 totalCartSub(event);
 cartItem.remove();
 setLocalStorage();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function mapAndShowPc(arrayFromApi) {
  const array = arrayFromApi.results;
  const result = array.map((element) => (
    {
      sku: element.id,
      name: element.title,
      image: element.thumbnail,
      price: element.price,
    }));

  return result.forEach((element) => createProductItemElement(element));
}

function mapAndShowItem(objectFromApi) {
  const ol = olCart;
  const { id, title, price } = objectFromApi;
  const result = () => (
    {
      sku: id,
      name: title,
      salePrice: price,
    });
ol.appendChild(createCartItemElement(result()));
totalCart(price);
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

const fetcherID = (event) => {
  const buttonParent = event.target.parentElement;
  const productId = getSkuFromProductItem(buttonParent);

      fetch(`https://api.mercadolibre.com/items/${productId}`)
        .then((response) => response.json())
        .then((data) => mapAndShowItem(data))
        .then(() => setLocalStorage());
};

const fetcherPC = (url) => {
   setTimeout(() => fetch(url)
     .then((response) => response.json())
     .then((data) => mapAndShowPc(data))
     .then(() => {
      const buttons = document.querySelectorAll('.item__add');
      buttons.forEach((button) => {
      button.addEventListener('click', fetcherID);
    });
     })
     .then(() => document.querySelector('.loading').remove()), 500);
};

function getLocalStorage() {
  olCart.innerHTML = localStorage.getItem('cartItems');
  const exist = localStorage.getItem('total');
  console.log(exist);
    if (exist) {
      totalElement.innerText = exist;
    } else totalElement.innerText = '0';


  const listaLi = document.querySelectorAll('.cart__item');
  listaLi.forEach((element) => {
    element.addEventListener('click', cartItemClickListener);
});
}

button.addEventListener('click', () => {
  vitrine.innerHTML = '';
  const API_URL_SEARCH = `https://api.mercadolibre.com/sites/MLB/search?q=${search.value}`;
  fetcherPC(API_URL_SEARCH);
});
search.addEventListener('keyup', function (e) {
  let key = e.which || e.keyCode;
  if (key == 13) { // codigo da tecla enter
    vitrine.innerHTML = '';
  let API_URL_SEARCH = `https://api.mercadolibre.com/sites/MLB/search?q=${search.value}`;
  fetcherPC(API_URL_SEARCH);
  }
});

logo.addEventListener('click', () => {
  location.reload();
});

window.onload = () => {
  fetcherPC(API_URL);
  getLocalStorage();
};
