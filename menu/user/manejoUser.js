document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        fetchUsers(token);
    }
});

let users = []; // Variable global para almacenar todos los usuarios

const fetchUsers = async (token) => {
    try {
        const response = await fetch('http://localhost:8080/user/getAll', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.mensaje);
        }
        
        users = data; // Guardar todos los usuarios en la variable global

        displayUsers(data);
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to load users: ' + error.mensaje);
    }
};

const displayUsers = (users) => {
    const container = document.getElementById('users-container');
    let tableHTML = `<table>
                        <tr>
                            <th>Nombre</th>
                            <th>Teléfono</th>
                            <th>Mail</th>
                            <th>Rol</th>
                            <th>Estatus</th>
                        </tr>`;
    
    users.forEach(user => {
        const role = user.role === 'admin' ? 'Admin' : 'User';
        const statusChecked = user.status === 'true' ? 'checked' : '';
        tableHTML += `<tr>
                        <td>${user.name}</td>
                        <td>${user.contactNumber}</td>
                        <td>${user.email}</td>
                        <td>${role}</td>
                        <td><label class="switch">
                              <input type="checkbox" ${statusChecked} data-user-id="${user.id}" onchange="toggleUserStatus(${user.id}, this.checked)">
                              <span class="slider round"></span>
                            </label></td>
                      </tr>`;
    });
    
    tableHTML += `</table>`;
    container.innerHTML = tableHTML;
};

const toggleUserStatus = async (id, status) => {
    const token = localStorage.getItem('token');
    const checkbox = document.querySelector(`input[data-user-id="${id}"]`);
    checkbox.disabled = true;  // Desactivar el checkbox temporalmente
    
    try {
        const response = await fetch('http://localhost:8080/user/updateStatus', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ id, status })
        });

        const responseData = await response.json();

        if (!response.ok) {
            throw new Error(responseData.mensaje || 'Error actualizando el usuario');
        }

        alert(responseData.mensaje || 'Usuario actualizado exitosamente');
        fetchUsers(token); // Assuming this function fetches and updates the list of users
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        alert('No se pudo actualizar el usuario: ' + error.message);

        // Revertir el cambio del checkbox si estba en azul lo pone gris y si es gris en azul
        //en el parametro cambios el valor al hacer click y con !status lo devolvemos a su estado original 
        
        checkbox.checked = !status; 
    } finally {
        checkbox.disabled = false; // Volver a habilitar el checkbox
    }
};




const searchUsers = () => {
    const searchTerm = document.getElementById('search-input').value.toLowerCase();
    const filteredUsers = users.filter(user => user.name.toLowerCase().includes(searchTerm));
    displayUsers(filteredUsers);
};
