import { useEffect, useState } from 'react'
import './App.css'
import ProductList from './ProductList';
import ErrorBoundary from './ErrorBoundary';
import CategoryFilter from './CategoryFilter';

function App() {
  const [products, setProducts] = useState([]);
  const [categories, setCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  useEffect(() => {
    // Fetch products with error handling
    fetch('http://localhost:8080/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setProducts(data))
      .catch(error => {
        console.error('Error fetching products:', error);
      });

    // Fetch categories with error handling
    fetch('http://localhost:8080/api/categories')
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => setCategory(data))
      .catch(error => {
        console.error('Error fetching categories:', error);
      });
  }, []);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };
  const handleSortChange = (event) => {
    setSortOrder(event.target.value);
  };
  const handleCategorySelect = (categoryId) => {
    setSelectedCategory(categoryId ? Number(categoryId) : null);
  };

  const filterProducts = products
    .filter(product => {
      // First check if the product exists
      if (!product) return false;

      // Category filter
      if (selectedCategory) {
        // Make sure category exists before checking its id
        if (!product.category) return false;
        return product.category.id === selectedCategory;
      }
      return true;
    })
    .filter(product => {
      // Search filter
      if (!searchTerm) return true;

      const name = product?.name?.toLowerCase() || '';
      const description = product?.description?.toLowerCase() || '';
      const searchLower = searchTerm.toLowerCase();

      return name.includes(searchLower) || description.includes(searchLower);
    })
    .sort((a, b) => {
      // Sort by price with null checks
      const priceA = a?.price ?? 0;
      const priceB = b?.price ?? 0;
      return sortOrder === "asc" ? priceA - priceB : priceB - priceA;
    })
  return (
    <div className='container'>
      <h1 className='my-4'>Product catalog</h1>
      <div className='row align-items-center mb-4'>
        <div className='col-md-3 col-sm-12 mb-2'>
          <CategoryFilter categories={categories} onSelect={handleCategorySelect} />
        </div>
        <div className='col-md-5 col-sm-12 mb-2'>
          <input
            type='text'
            className='form-control'
            placeholder='Search for products'
            onChange={handleSearchChange}
          />
        </div>
        <div className='col-md-4 col-sm-12 mb-2'>
          <select className='form-control' onChange={handleSortChange}>
            <option value={"asc"}>Sort by price : Low to Hight</option>
            <option value={"desc"}>Sort by price : Hight to Low</option>
          </select>
        </div>
      </div>
      <div>
        {filterProducts.length ? (
          // Display products
          <ErrorBoundary>
            <ProductList products={filterProducts} />
          </ErrorBoundary>
        ) : (
          <p>No Products Found</p>
        )}
      </div>
    </div>
  );
}

export default App;
