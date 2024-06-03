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

const displayCategoryCount = (count) => {
    const container = document.getElementById('categories-count');
    container.textContent = `Total de categorías: ${count}`;
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

const displayUserCount = (count) => {
    const container = document.getElementById('users-count');
    container.textContent = `Total de usuarios: ${count}`;
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
        
        displayProductCount(data.length);
        updateChart();
    } catch (error) {
        console.error('Error al obtener los productos:', error);
        alert('No se pudieron cargar los productos: ' + error.message);
    }
};

const displayProductCount = (count) => {
    const container = document.getElementById('products-count');
    container.textContent = `Total de productos: ${count}`;
};

const updateChart = () => {
    if (!categories.length || !products.length) return;

    const categoryProductCount = categories.map(category => {
        return {
            name: category.name,
            count: products.filter(product => product.category.id === category.id).length
        };
    });

    const ctx = document.getElementById('categoryChart').getContext('2d');
    const categoryNames = categoryProductCount.map(item => item.name);
    const productCounts = categoryProductCount.map(item => item.count);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: categoryNames,
            datasets: [{
                label: 'Cantidad de productos',
                data: productCounts,
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
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
};
;
