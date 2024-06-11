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
        
        categories = data; // Guardar todas las categorías en la variable global para buscar posteriormente

        displayCategories(data);
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        alert('No se pudieron cargar las categorías: ' + error.message);
    }
};

const displayCategories = (categories) => {
    const container = document.getElementById('categories-container');
    let tableHTML = `<table>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Editar</th>
                            <th>Eliminar</th>
                        </tr>`;
    
    categories.forEach(category => {
        tableHTML += `<tr>
                        <td>${category.id}</td>
                        <td>${category.name}</td>
                        <td><i class="fa-solid fa-pen" onclick="editCategory(${category.id}, '${category.name}')"></i></td>
                        <td><i class="fa-solid fa-trash" onclick="deleteCategory(${category.id})"></i></td>
                      </tr>`;
    });
    
    tableHTML += `</table>`;
    container.innerHTML = tableHTML;
};


const editCategory = (id, name) => {
    const newName = prompt('Ingrese el nuevo nombre para la categoría:', name);
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
            throw new Error(responseData.mensaje || 'Error actualizando la categoría');
        }

         fetchCategories(token);
    } catch (error) {
        console.error('Error al actualizar la categoría:', error);
        alert('No se pudo actualizar la categoría: ' + error.message);
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
            throw new Error(responseData.mensaje || 'Error eliminando la categoría');
        }

        const responseData = await response.json();
        alert(responseData.mensaje || 'Categoría eliminada exitosamente');
        fetchCategories(token);
    } catch (error) {
        console.error('Error al eliminar la categoría:', error);
        alert('No se pudo eliminar la categoría: ' + error.message);
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
            throw new Error(responseData.mensaje || 'Error añadiendo la categoría');
        }

        alert(responseData.mensaje || 'Categoría añadida exitosamente');
        document.getElementById('new-category-name').value = ''; // Clear input field
        fetchCategories(token);
    } catch (error) {
        console.error('Error al añadir la categoría:', error);
        alert('No se pudo añadir la categoría: ' + error.message);
    }
    
    
};

function searchCategories() {
    // Obtener el término de búsqueda del campo de entrada y convertirlo a minúsculas para facilitar la comparación
    var searchTerm = document.getElementById('search-input').value.toLowerCase();

    // Filtrar las categorías basadas en el término de búsqueda
    var filteredCategories = categories.filter(function(category) {
        return category.name.toLowerCase().includes(searchTerm);
    });

    // Mostrar las categorías filtradas
    displayCategories(filteredCategories);
}
