document.addEventListener('DOMContentLoaded', () => {
    const token = localStorage.getItem('token');
    if (token) {
        fetchCategories(token);
        fetchUsers(token);
        fetchProducts(token);
    }
});

let categories = [];
let users = [];
let products = [];

const displayCategoryCount = (count) => {
    const container = document.getElementById('categories-count');
    container.textContent = `Total de categorías: ${count}`;
};

const displayUserCount = (count) => {
    const container = document.getElementById('users-count');
    container.textContent = `Total de usuarios: ${count}`;
};

const displayProductCount = (count) => {
    const container = document.getElementById('products-count');
    container.textContent = `Total de productos: ${count}`;
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
        
        categories = data;
        displayCategoryCount(data.length);
        updateChart();
    } catch (error) {
        console.error('Error al obtener las categorías:', error);
        alert('No se pudieron cargar las categorías: ' + error.message);
    }
};



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
        
        users = data;
        displayUserCount(data.length);
    } catch (error) {
        console.error('Error fetching users:', error);
        alert('Failed to load users: ' + error.mensaje);
    }
};



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
        
        products = data;
        displayProductCount(data.length);
        updateChart();
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        alert('No se pudieron cargar los productos: ' + error.message);
    }
};




function updateChart() {
    if (!categories.length || !products.length) return;

    // Filtrar productos que tengan el estado "true"
    const activeProducts = products.filter(product => product.status === 'true');

    // Crear un objeto para almacenar el recuento de productos por categoría
    const categoryProductCount = {};

    // Iterar sobre las categorías para inicializar el recuento en 0
    // funcion anonima que se pasa como argu
    //objeto que contiene las categorias.foreach
    categories.forEach(
        
        function(category) {
         /**
          *  category representa cada elemento del array categories durante cada iteración del bucle forEach(), y category.name es la propiedad name del objeto category, que se utiliza para inicializar el recuento en 0 en el objeto categoryProductCount. */ 
        categoryProductCount[category.name] = 0; // prepara el objeto categoryProductCount con contadores de categoría inicializados en 0.
    });
    

    // Contar productos por categoría
    activeProducts.forEach(
        function(product) {
        categoryProductCount[product.category.name]++;
    });

    // Preparar datos para el gráfico
    const categoryNames = Object.keys(categoryProductCount);
    const productCounts = Object.values(categoryProductCount);
    //'Electrónica': 10, 'Ropa': 5, 'Juguetes': 8

    // Obtener el contexto del gráfico
    const ctx = document.getElementById('categoryChart');

    // Crear el gráfico de barras
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categoryNames,  //las letras de abajo
            datasets: [{
                label: 'Cantidad de productos por validados por categoria',
                data: productCounts, //letras dentro de  las barras
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1 //grosor de la barra
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1 // Establecer el tamaño del paso en 1 para valores enteros en el eje y
                    }
                }
            }
        }
    });
}
