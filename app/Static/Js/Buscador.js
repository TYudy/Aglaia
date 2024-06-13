<<<<<<< HEAD
const username = document.getElementById('username');
const password = document.getElementById('password');
const button = document.getElementById('button');

button.addEventListener('click', (e) => {
    e.preventDefault();
    const data = {
        username: username.value,
        password: password.value
    };

    console.log(data);
});

>>>>>>> 401e367ca5ce7fbf712af22e0c508eb672273133
document.addEventListener('DOMContentLoaded', function () {
    const searchBar = document.getElementById('search-bar');
    const categorySelect = document.getElementById('category-select');
    const searchResults = document.getElementById('search-results');

    categorySelect.addEventListener('change', function () {
        filterResults();
    });

    searchBar.addEventListener('input', function () {
        filterResults();
    });

    function filterResults() {
        const searchTerm = searchBar.value.trim().toLowerCase();
        const selectedCategory = categorySelect.value.toLowerCase();
        const filteredResults = fakeData.filter(item => {
            return item.name.toLowerCase().includes(searchTerm) &&
                (selectedCategory === 'all' || item.category.toLowerCase() === selectedCategory);
        });

        displayResults(filteredResults);
    }

    function displayResults(results) {
        searchResults.innerHTML = '';

        results.forEach(result => {
            const li = document.createElement('li');
            li.textContent = result.name;
            searchResults.appendChild(li);
        });
    }

    const fakeData = [
        { name: 'Producto 1', category: 'Electrónica' },
        { name: 'Producto 2', category: 'Ropa' },
        { name: 'Producto 3', category: 'Hogar' },
        { name: 'Producto 4', category: 'Electrónica' },
        { name: 'Producto 5', category: 'Ropa' },
    ];
});
