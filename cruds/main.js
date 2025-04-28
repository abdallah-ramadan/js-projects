let mood = 'create';
let tempIndex;

// Selecting Elements
const inputName = document.querySelector(".name input");
const inputPrice = document.querySelector(".price .pric");
const inputTaxes = document.querySelector(".price .taxes");
const inputAds = document.querySelector(".price .ads");
const inputDiscount = document.querySelector(".price .discount");
const spanTotal = document.querySelector(".price .total");
const inputCategory = document.querySelector(".catig input");
const inputCount = document.querySelector(".count input");
const inputCreate = document.querySelector(".create input");
const inputSearch = document.querySelector(".search input");
const spanCount = document.querySelector(".spancount");
const tableBody = document.querySelector("table tbody");
const deleteAllBtn = document.querySelector('.pdelete button');


let products = JSON.parse(localStorage.getItem('products')) || [];

// Calculate Total
function getTotal() {
    if (inputPrice.value !== '') {
        const total = (+inputPrice.value + +inputTaxes.value + +inputAds.value) - +inputDiscount.value;
        spanTotal.textContent = total >= 0 ? total : 0;
    } else {
        spanTotal.textContent = '';
    }
}

// Clear Input Fields
function clearInputs() {
    inputName.value = '';
    inputPrice.value = '';
    inputTaxes.value = '';
    inputAds.value = '';
    inputDiscount.value = '';
    spanTotal.textContent = '';
    inputCategory.value = '';
    inputCount.value = '';
}

// Create or Update Product
inputCreate.addEventListener('click', () => {
    const newProduct = {
        id: Date.now(),
        name: inputName.value.trim(),
        price: inputPrice.value,
        taxes: inputTaxes.value,
        ads: inputAds.value,
        discount: inputDiscount.value,
        total: spanTotal.textContent,
        category: inputCategory.value.trim(),
    };

    if (inputName.value && inputPrice.value && inputCategory.value) {
        if (mood === 'create') {
            let count = inputCount.value > 1 ? +inputCount.value : 1;
            for (let i = 0; i < count; i++) {
                products.push({ ...newProduct, id: Date.now() + i });
            }
        } else {
            products[tempIndex] = newProduct;
            mood = 'create';
            inputCreate.value = "Create";
            inputCount.style.display = 'block';
        }
        localStorage.setItem('products', JSON.stringify(products));
        showData();
        clearInputs();
    }
});

// Display Data
function showData() {
    let rows = '';
    products.forEach((product, i) => {
        rows += `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.price}</td>
                <td>${product.taxes}</td>
                <td>${product.ads}</td>
                <td>${product.discount}</td>
                <td>${product.total}</td>
                <td>${product.category}</td>
                <td><button onclick="updateProduct(${i})">Update</button></td>
                <td><button onclick="deleteProduct(${i})">Delete</button></td>
            </tr>
        `;
    });
    tableBody.innerHTML = rows;
    spanCount.textContent = products.length;

    if (products.length > 0) {
        deleteAllBtn.parentElement.style.display = 'block';
    } else {
        deleteAllBtn.parentElement.style.display = 'none';
    }
}

// Delete Single Product
function deleteProduct(index) {
    products.splice(index, 1);
    localStorage.setItem('products', JSON.stringify(products));
    showData();
}

// Delete All Products
deleteAllBtn.addEventListener('click', () => {
    products = [];
    localStorage.removeItem('products');
    showData();
});

// Update Product
function updateProduct(index) {
    let product = products[index];
    inputName.value = product.name;
    inputPrice.value = product.price;
    inputTaxes.value = product.taxes;
    inputAds.value = product.ads;
    inputDiscount.value = product.discount;
    inputCategory.value = product.category;
    getTotal();
    inputCount.style.display = 'none';
    inputCreate.value = "Update";
    mood = 'update';
    tempIndex = index;
    scroll({
        top: 0,
        behavior: "smooth"
    });
}

// Search Products by Category
function search() {
    let searchValue = inputSearch.value.toLowerCase();
    let rows = '';
    products.forEach((product, i) => {
        if (product.category.toLowerCase().includes(searchValue)) {
            rows += `
                <tr>
                    <td>${product.id}</td>
                    <td>${product.name}</td>
                    <td>${product.price}</td>
                    <td>${product.taxes}</td>
                    <td>${product.ads}</td>
                    <td>${product.discount}</td>
                    <td>${product.total}</td>
                    <td>${product.category}</td>
                    <td><button onclick="updateProduct(${i})">Update</button></td>
                    <td><button onclick="deleteProduct(${i})">Delete</button></td>
                </tr>
            `;
        }
    });
    tableBody.innerHTML = rows;
}

inputSearch.addEventListener('input', search);

// Initial Display
showData();
