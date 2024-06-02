// Selecciona el botón de registro en el documento HTML
let boton = document.getElementById("btnRegistro");

// Añade un evento 'click' al botón de registro
boton.addEventListener("click", async (event) => {
    event.preventDefault(); // Previene el envío por defecto del formulario
    await registroUser(); // Llama a la función de registro
});

// Comentario prueba

// Objeto para almacenar los datos del usuario
let camposUser = {};

// Función asíncrona para el registro del usuario
let registroUser = async () => {
    // Asigna los valores de los campos del formulario al objeto camposUser
    camposUser.name = document.getElementById("name").value;
    camposUser.password = document.getElementById("password").value;
    camposUser.email = document.getElementById("email").value;
    camposUser.contactNumber = document.getElementById("contactNumber").value;

    try {
        // Realiza una solicitud POST a la URL especificada con los datos del usuario
        const response = await fetch("http://localhost:8080/user/registro", {
            method: "POST", // Método HTTP de la solicitud
            headers: {
                "Content-Type": "application/json", // Especifica que el cuerpo de la solicitud está en formato JSON
            },
            body: JSON.stringify(camposUser), // Convierte el objeto camposUser a una cadena JSON
        });
        // Convierte la respuesta en formato JSON
        const responseData = await response.json();

        if (!response.ok) {
            // Si la respuesta no es OK, lanza un error con el mensaje del cuerpo de la respuesta (muestra el mensaje de data)
            throw new Error(responseData.mensaje || 'Error en la solicitud');
        }

        console.log(responseData);
        // Muestra una alerta indicando que el inicio de sesión fue exitoso y si se recibió un token
        alert('Inicio de sesión exitoso: ' + (responseData.token ? 'Token recibido' : ''));
        // Almacena el token en el localStorage si es necesario
        localStorage.setItem('token', responseData.token);

        // Almacena el email del usuario en el localStorage
        localStorage.setItem('userEmail', camposUser.email);
    } catch (error) {
        // En caso de error, muestra el error en la consola y una alerta al usuario con el mensaje del error
        console.error('Error:', error);
        alert(error.message);
    }
};
