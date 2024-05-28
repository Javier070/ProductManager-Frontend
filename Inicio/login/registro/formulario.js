let boton = document.getElementById("btnRegistro");
boton.addEventListener("click", async (event) => {
    event.preventDefault(); // Previene el envío por defecto del formulario
    await registroUser(); // Llama a la función de registro
});

//comentario prueba

let camposUser = {};

let registroUser = async () => {
    camposUser.name = document.getElementById("name").value;
    camposUser.password = document.getElementById("password").value;
    camposUser.email = document.getElementById("email").value;
    camposUser.contactNumber = document.getElementById("contactNumber").value;

    try {
        const response = await fetch("http://localhost:8080/user/registro", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(camposUser),
        });
        const responseData = await response.json();

        if (!response.ok) {
            // Si la respuesta no es OK, lanza un error con el mensaje del cuerpo de la respuesta (muestra el mensaje de data)
            throw new Error(responseData.mensaje || 'Error en la solicitud');
        }

        console.log(responseData);
        alert('Inicio de sesión exitoso: ' + (responseData.token ? 'Token recibido' : ''));
        // Aquí puedes almacenar el token en el localStorage o sessionStorage si es necesario
         localStorage.setItem('token', responseData.token);

            // Almacenar el email en localStorage
        localStorage.setItem('userEmail', camposUser.email);
    } catch (error) {
        console.error('Error:', error);
        // Muestra el mensaje de error al usuario
        alert(error.message);
    }
};
