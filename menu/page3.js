document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        fetchCategories(token);
    }

    const addCategoryForm = document.getElementById('add-category-form');
    addCategoryForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const newCategoryName = document.getElementById('new-category-name').value;
        addCategory(newCategoryName);
    });
});

let categories = []; // Variable global para almacenar todas las categorías


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
        
        categories = data; // Guardar todas las categorías en la variable global para buscar posteriormebte

        displayCategories(data);
    } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to load categories: ' + error.mensaje);
    }
};

const displayCategories = (categories) => {
    const container = document.getElementById('categories-container');
    let tableHTML = `<table>
                        <tr>
                            <th>Name</th>
                            <th>Edit</th>
                            <th>Delete</th>
                        </tr>`;
    
    categories.forEach(category => {
        tableHTML += `<tr>
                        <td>${category.name}</td>
                        <td><button onclick="editCategory(${category.id}, '${category.name}')">Edit</button></td>
                        <td><button onclick="deleteCategory(${category.id})">Delete</button></td>
                      </tr>`;
    });
    
    tableHTML += `</table>`;
    container.innerHTML = tableHTML;
};

const editCategory = (id, name) => {
    const newName = prompt('Enter new name for the category:', name);
    if (newName) {
        updateCategory(id, newName);
    }
};

const updateCategory = async (id, name) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:8080/category/update', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id, name })
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.mensaje || 'Error updating category');
        }

        alert(responseData.mensaje || 'Category updated successfully');
        fetchCategories(token);
    } catch (error) {
        console.error('Error updating category:', error);
        alert('Failed to update category: ' + error.message);
    }
};

const deleteCategory = async (id) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch(`http://localhost:8080/category/delete${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.mensaje || 'Error deleting category');
        }

        const responseData = await response.json();
        alert(responseData.mensaje || 'Category deleted successfully');
        fetchCategories(token);
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category: ' + error.message);
    }
};

const addCategory = async (name) => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:8080/category/agregar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ name })
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.mensaje || 'Error adding category');
        }

        alert(responseData.mensaje || 'Category added successfully');
        document.getElementById('new-category-name').value = ''; // Clear input field
        fetchCategories(token);
    } catch (error) {
        console.error('Error adding category:', error);
        alert('Failed to add category: ' + error.message);
    }
};
const searchCategories = () => {
    //: Obtiene el valor del campo de entrada y lo convierte a minúsculas para facilitar la comparación.
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    //: Utiliza el método filter() para crear un nuevo array filteredCategories que contiene solo las categorías cuyo nombre incluye el término de búsqueda ingresado por el usuario.
    const filteredCategories = categories.filter(category => category.name.toLowerCase().includes(searchTerm));
    displayCategories(filteredCategories);
};
