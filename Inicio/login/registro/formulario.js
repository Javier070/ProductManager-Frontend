// Selecciona el botón de registro en el documento HTML
let boton = document.getElementById("btnRegistro");

// Función asíncrona para el registro del usuario
let registroUser = async () => {
    // Objeto para almacenar los datos del usuario
    let camposUser = {
        name: document.getElementById("name").value,
        password: document.getElementById("password").value,
        email: document.getElementById("email").value,
        contactNumber: document.getElementById("contactNumber").value
    };

    if (!camposUser.name || !camposUser.password || !camposUser.email || !camposUser.contactNumber) {
        alert("Todos los campos son obligatorios.");
        return;
    }
    
    try {
        // Realiza una solicitud POST a la URL especificada con los datos del usuario
        const response = await fetch("http://localhost:8080/user/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(camposUser),
        });

        if (!response.ok) {
            const responseData = await response.json();
            throw new Error(responseData.mensaje || 'Error en la solicitud');
        }

        const responseData = await response.json();
        console.log(responseData);


        alert("Registro exitoso");

        
    } catch (error) {
        console.error('Error:', error);
        alert(error.message);
    }
};

// Añade un evento 'click' al botón de registro
boton.addEventListener("click", async (event) => {
    event.preventDefault(); // Previene la acción por defecto del formulario
    await registroUser(); // Llama a la función de registro
});
