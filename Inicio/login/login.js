document.getElementById("btnLogin").addEventListener("click", async (event) => {
    event.preventDefault(); // Previene el envío por defecto del formulario
    await loginUser(); // Llama a la función de inicio de sesión
});

let loginUser = async () => { // Función para iniciar sesión asincrona
    let camposLogin = {
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
    };

    console.log("Datos de login:", camposLogin); // Verifica los datos antes de enviarlos

    try {
        const response = await fetch("http://localhost:8080/user/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            //Convierte el objeto camposLogin a una cadena JSON para enviarlo en el cuerpo de la solicitud.
            body: JSON.stringify(camposLogin),
        });

        // Lee el cuerpo de la respuesta como JSON
        const responseData = await response.json();

        if (!response.ok) {
            // Si la respuesta no es OK, lanza un error con el mensaje del cuerpo de la respuesta (muestra el mensaje de data)
            throw new Error(responseData.mensaje || 'Error en la solicitud');
        }

        console.log(responseData);
        alert('Inicio de sesión exitoso: ' + (responseData.token ? 'Token recibido' : ''));
        // Aquí puedes almacenar el token en el localStorage o sessionStorage si es necesario
        localStorage.setItem('token', responseData.token);

        // Almacena el email del usuario en el localStorage
        localStorage.setItem('userEmail', camposLogin.email);

        // Redirigir a la nueva página usando una ruta relativa
        window.location.href = '/menu/menu.html';
    } catch (error) {
        console.error('Error:', error);
        // Muestra el mensaje de error al usuario
        alert(error.message);
    }
};
