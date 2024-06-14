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
        console.error('Error al obtener los productos:', error);
        alert('No se pudieron cargar los productos: ' + error.message);
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
        console.error('Error al obtener las categorías:', error);
        alert('No se pudieron cargar las categorías: ' + error.message);
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
                            <th>Nombre</th>
                            <th>Descripción</th>
                            <th>Precio</th>
                            <th>Categoria</th>
                            <th>Estado</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                        </tr>`;
    
    products.forEach(product => {
        const categoryName = categories.find(category => category.id === product.category.id)?.name || 'Desconocida';
        const statusChecked = product.status === 'true' ? 'checked' : '';
        tableHTML += `<tr>
                        <td>${product.name}</td>
                        <td>${product.description}</td>
                        <td>${product.price} €</td>
                        <td>${categoryName}</td>
                        <td><label class="switch">
                              <input type="checkbox" ${statusChecked} onchange="toggleProductStatus(${product.id}, this.checked)">
                              <span class="slider round"></span>
                            </label></td>
                        <td><i class="fa-solid fa-pen" onclick="editProduct(${product.id}, '${product.name}', '${product.description}', ${product.price}, '${product.category.id}')"></i></td>
                        <td><i class="fa-solid fa-trash" onclick="confirmDeleteProduct(${product.id})"></i></td>
                      </tr>`;
    });
    
    tableHTML += `</table>`;
    container.innerHTML = tableHTML;
};

const toggleProductStatus = async (id, newStatus) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:8080/product/updateStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id, status: newStatus.toString() })
            //. El valor del estado se convierte a una cadena de caracteres mediante newStatus.toString() antes de ser enviado, para asegurar que sea una cadena.
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.mensaje || 'Error actualizando el estado del producto');
        }

        alert(responseData.mensaje || 'Estado del producto actualizado exitosamente');
        fetchProducts(token);
    } catch (error) {
        console.error('Error al actualizar el estado del producto:', error);
        alert('No se pudo actualizar el estado del producto: ' + error.message);
    }
};

const editProduct = (id, name, description, price, categoryId) => {
    const newName = prompt('Ingrese el nuevo nombre para el producto:', name);
    const newDescription = prompt('Ingrese la nueva descripción para el producto:', description);
    const newPrice = prompt('Ingrese el nuevo precio para el producto:', price);
    const newCategoryId = prompt('Ingrese el nuevo ID de la categoría para el producto:', categoryId);
    if (newName && newDescription && newPrice && newCategoryId) {
        updateProduct(id, newName, newDescription, newPrice, newCategoryId);
    }
};

const updateProduct = async (id, name, description, price, categoryId) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:8080/product/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id, name, description, price, category_fk: categoryId })
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.mensaje || 'Error actualizando el producto');
        }

        alert(responseData.mensaje || 'Producto actualizado exitosamente');
        fetchProducts(token);
    } catch (error) {
        console.error('Error al actualizar el producto:', error);
        alert('No se pudo actualizar el producto: ' + error.message);
    }
};

const confirmDeleteProduct = (id) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
        deleteProduct(id);
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
            throw new Error(responseData.mensaje || 'Error eliminando el producto');
        }

        const responseData = await response.json();
        alert(responseData.mensaje || 'Producto eliminado exitosamente');
        fetchProducts(token);
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
        alert('No se pudo eliminar el producto: ' + error.message);
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
            throw new Error(responseData.mensaje || 'Error añadiendo el producto');
        }

        alert(responseData.mensaje || 'Producto añadido exitosamente');
        document.getElementById('new-product-name').value = ''; // Clear input field
        document.getElementById('new-product-description').value = ''; // Clear input field
        document.getElementById('new-product-price').value = ''; // Clear input field
        document.getElementById('new-product-category').value = ''; // Clear input field
        fetchProducts(token);
    } catch (error) {
        console.error('Error al añadir el producto:', error);
        alert('No se pudo añadir el producto: ' + error.message);
    }
};

// Función para buscar productos
const searchProducts = () => {
    // Obtener el término de búsqueda del campo de entrada y convertirlo a minúsculas 
    const searchTerm = document.getElementById('search-input').value.toLowerCase();

    // Filtrar los productos basados en el término de búsqueda
    
const filteredProducts = products.filter(function(product) {
    return product.name.toLowerCase().includes(searchTerm);
})
    // Mostrar los productos filtrados
    displayProducts(filteredProducts);
};
