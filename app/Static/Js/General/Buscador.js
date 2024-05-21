import debounce from 'lodash.debounce';

const searchBar = document.getElementById('search-bar');
const categorySelect = document.getElementById('category-select');
const searchResults = document.getElementById('search-results');
const noResultsMessage = document.createElement('p');
noResultsMessage.className = 'no-results-message';
noResultsMessage.textContent = 'No se encontraron resultados.';

// Helper functions
const getSearchTerm = () => searchBar.value.trim().toLowerCase();
const getSelectedCategory = () => categorySelect.value.toLowerCase();

// Filter results
const filterResults = debounce(() => {
    const searchTerm = getSearchTerm();
    const selectedCategory = getSelectedCategory();

    // Get data from external source (e.g., API)
    fetch('/api/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudieron obtener los datos de la API');
            }
            return response.json();
        })
        .then(data => {
            const filteredResults = filterProductsBySearch(data, searchTerm, selectedCategory);
            displayResults(filteredResults);
        })
        .catch(error => {
            searchResults.innerHTML = '';
            searchResults.appendChild(noResultsMessage);
            console.error('Error al obtener los datos:', error);
        });
}, 500);

// Filter products by search term and category
const filterProductsBySearch = (products, searchTerm, selectedCategory) => {
    return products.filter(item => {
        const itemNameLower = item.name.toLowerCase();
        const itemCategoryLower = item.category.toLowerCase();
        const matchesSearchTerm = itemNameLower.includes(searchTerm);
        const matchesCategory = selectedCategory === 'all' || itemCategoryLower === selectedCategory;
        return matchesSearchTerm && matchesCategory;
    });
};

// Display results
const displayResults = results => {
    searchResults.innerHTML = '';
    if (results.length === 0) {
        searchResults.appendChild(noResultsMessage);
    } else {
        const categorySections = groupResultsByCategory(results);
        for (const category in categorySections) {
            const categorySection = document.createElement('div');
            categorySection.className = 'category-section';
            const categoryHeader = document.createElement('h3');
            categoryHeader.textContent = category;
            categorySection.appendChild(categoryHeader);
            const resultList = document.createElement('ul');
            categorySections[category].forEach(result => {
                const li = document.createElement('li');
                const highlightedResult = highlightSearchTerm(result.name, getSearchTerm());
                li.innerHTML = `
                    <span class="result-name">${highlightedResult}</span>
                    <span class="result-category">(${result.category})</span>
                `;
                resultList.appendChild(li);
            });
            categorySection.appendChild(resultList);
            searchResults.appendChild(categorySection);
        }
    }
};

// Group results by category
const groupResultsByCategory = results => {
    const categorySections = {};
    results.forEach(result => {
        const category = result.category;
        if (!categorySections[category]) {
            categorySections[category] = [];
        }
        categorySections[category].push(result);
    });
    return categorySections;
};

// Highlight search term in results
const highlightSearchTerm = (text, searchTerm) => {
    const regex = new RegExp(searchTerm, 'gi');
    return text.replace(regex, match => `<span class="highlight">${match}</span>`);
};

// Search suggestion functionality
const searchSuggestions = document.getElementById('search-suggestions');

searchBar.addEventListener('input', () => {
    const searchTerm = getSearchTerm();
    if (searchTerm.length > 2) {
        fetch('/api/suggestions?term=' + searchTerm)
            .then(response => response.json())
            .then(suggestions => {
                displaySuggestions(suggestions);
            })
            .catch(error => {
                console.error('Error al obtener sugerencias:', error);
            });
    } else {
        searchSuggestions.innerHTML = '';
    }
});

const displaySuggestions = suggestions => {
    searchSuggestions.innerHTML = '';
    suggestions.forEach(suggestion => {
        const li = document.createElement('li');
        li.textContent = suggestion;
        li.addEventListener('click', () => {
            searchBar.value = suggestion;
            searchSuggestions.innerHTML = '';
            filterResults();
        });
        searchSuggestions.appendChild(li);
    });
};

// Advanced filtering functionality
const priceRangeInput = document.getElementById('price-range');
const ratingSelect = document.getElementById('rating');

priceRangeInput.addEventListener('input', filterAdvancedResults);
ratingSelect.addEventListener('change', filterAdvancedResults);

const filterAdvancedResults = () => {
    const searchTerm = getSearchTerm();
    const selectedCategory = getSelectedCategory();
    const priceRange = priceRangeInput.value.split(',').map(Number);
    const minPrice = priceRange[0];
    const maxPrice = priceRange[1];
    const minRating = ratingSelect.value;

    // Get data from external source (e.g., API)
    fetch('/api/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('No se pudieron obtener los datos de la API');
            }
            return response.json();
        })
        .then(data => {
            const filteredResults = filterProductsBySearch(data, searchTerm, selectedCategory);
            const advancedFilteredResults = filterProductsByPriceAndRating(filteredResults, minPrice, maxPrice, minRating);
            displayResults(advancedFilteredResults);
        })
        .catch(error => {
            searchResults.innerHTML = '';
            searchResults.appendChild(noResultsMessage);
            console.error('Error al obtener los datos:', error);
        });
};

// Filter products by price range and rating
const filterProductsByPriceAndRating = (products, minPrice, maxPrice, minRating) => {
    return products.filter(item => {
        const matchesPriceRange = item.price >= minPrice && item.price <= maxPrice;
        const matchesRating = item.rating >= minRating;
        return matchesPriceRange && matchesRating;
    });
};
