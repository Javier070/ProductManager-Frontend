document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        fetchCategories(token);
    }

 
});

const fetchCategories = async (token) => {
    try {
        const response = await fetch('http://localhost:8080/category/getAll2', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message);
        }

        displayCategories(data);
    } catch (error) {
        console.error('Error fetching categories:', error);
        alert('Failed to load categories: ' + error.message);
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
                'Authorization': `Bearer ${token}`
            }
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.mensaje || 'Error deleting category');
        }

        alert(responseData.mensaje || 'Category deleted successfully');
        fetchCategories(token);
    } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category: ' + error.message);
    }
};
