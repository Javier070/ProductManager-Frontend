document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        fetchProducts(token);
        fetchCategories(token);
    }

    const addProductForm = document.getElementById('add-product-form');
    addProductForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newProductName = document.getElementById('new-product-name').value;
        const newProductDescription = document.getElementById('new-product-description').value;
        const newProductPrice = document.getElementById('new-product-price').value;
        const newProductCategory = document.getElementById('new-product-category').value;
        addProduct(newProductName, newProductDescription, newProductPrice, newProductCategory);
    });
});

let products = []; // Variable global para almacenar todos los productos
let categories = []; // Variable global para almacenar todas las categorías

const fetchProducts = async (token) => {
    try {
        const response = await fetch('http://localhost:8080/product/getall', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.mensaje);
        }
        
        products = data; // Guardar todos los productos en la variable global

        displayProducts(data);
    } catch (error) {
        console.error('Error fetching products:', error);
        alert('Failed to load products: ' + error.mensaje);
    }
};

const fetchCategories = async (token) => {
    try {
        const response = await fetch('http://localhost:8080/category/getAll2', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.mensaje);
        }

        categories = data; // Guardar todas las categorías en la variable global
        populateCategoryOptions(data);
    } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to load categories: ' + error.mensaje);
    }
};

const populateCategoryOptions = (categories) => {
    const categorySelect = document.getElementById('new-product-category');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category.id;
        option.textContent = category.name;
        categorySelect.appendChild(option);
    });
};

const displayProducts = (products) => {
    const container = document.getElementById('products-container');
    let tableHTML = `<table>
                        <tr>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Status</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>`;
    
    products.forEach(product => {
        const categoryName = categories.find(category => category.id === product.category.id)?.name || 'Unknown';
        tableHTML += `<tr>
                        <td>${product.name}</td>
                        <td>${product.description}</td>
                        <td>${product.price}</td>
                        <td>${categoryName}</td>
                        <td>${product.status}</td>
                        <td><button onclick="editProduct(${product.id}, '${product.name}', '${product.description}', ${product.price}, '${product.category.id}', '${product.status}')">Edit</button></td>
                        <td><button onclick="deleteProduct(${product.id})">Delete</button></td>
                      </tr>`;
    });
    
    tableHTML += `</table>`;
    container.innerHTML = tableHTML;
};

const editProduct = (id, name, description, price, categoryId, status) => {
    const newName = prompt('Enter new name for the product:', name);
    const newDescription = prompt('Enter new description for the product:', description);
    const newPrice = prompt('Enter new price for the product:', price);
    const newCategoryId = prompt('Enter new category ID for the product:', categoryId);
    const newStatus = prompt('Enter new status for the product:', status);
    if (newName && newDescription && newPrice && newCategoryId && newStatus) {
        updateProduct(id, newName, newDescription, newPrice, newCategoryId, newStatus);
    }
};

const updateProduct = async (id, name, description, price, categoryId, status) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:8080/product/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id, name, description, price, category_fk: categoryId, status })
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.mensaje || 'Error updating product');
        }

        alert(responseData.mensaje || 'Product updated successfully');
        fetchProducts(token);
    } catch (error) {
        console.error('Error updating product:', error);
        alert('Failed to update product: ' + error.message);
    }
};

const deleteProduct = async (id) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:8080/product/delete${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.mensaje || 'Error deleting product');
        }

        const responseData = await response.json();
        alert(responseData.mensaje || 'Product deleted successfully');
        fetchProducts(token);
    } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product: ' + error.message);
    }
};

const addProduct = async (name, description, price, categoryId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:8080/product/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name, description, price, category_fk: categoryId })
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.mensaje || 'Error adding product');
        }

        alert(responseData.mensaje || 'Product added successfully');
        document.getElementById('new-product-name').value = ''; // Clear input field
        document.getElementById('new-product-description').value = ''; // Clear input field
        document.getElementById('new-product-price').value = ''; // Clear input field
        document.getElementById('new-product-category').value = ''; // Clear input field
        fetchProducts(token);
    } catch (error) {
        console.error('Error adding product:', error);
        alert('Failed to add product: ' + error.message);
    }
};

const searchProducts = () => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(searchTerm));
    displayProducts(filteredProducts);
};
