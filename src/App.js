import { useState } from "react";
import "./App.css";

const API_RESPONSE = [
  { category: "Fruits", price: "$1", stocked: true, name: "Apple" },
  { category: "Fruits", price: "$1", stocked: true, name: "Dragonfruit" },
  { category: "Fruits", price: "$2", stocked: false, name: "Passionfruit" },
  { category: "Vegetables", price: "$2", stocked: true, name: "Spinach" },
  { category: "Vegetables", price: "$4", stocked: false, name: "Pumpkin" },
  { category: "Vegetables", price: "$1", stocked: true, name: "Peas" },
];

const SearchBar = ({
  filterText,
  inStockOnly,
  onFilterTextChange,
  onInStockOnlyChange,
}) => {
  return (
    <form>
      <input
        type="text"
        placeholder="Search..."
        value={filterText}
        onChange={({ target: { value } }) => onFilterTextChange(value)}
      />
      <label>
        <input
          type="checkbox"
          value={inStockOnly}
          onChange={({ target: { checked } }) => onInStockOnlyChange(checked)}
        />{" "}
        Only show products in stock
      </label>
    </form>
  );
};

const ProductCategoryRow = ({ category }) => (
  <tr style={{ fontWeight: "bold" }}>
    <td colSpan={2}>{category}</td>
  </tr>
);

const ProductRow = ({ product }) => (
  <tr style={{ color: product.stocked ? "" : "red" }}>
    <td>{product.name}</td>
    <td>{product.price}</td>
  </tr>
);

const ProductTable = ({ products, filterText, inStockOnly }) => {
  const [sort, setSort] = useState('');

  const rows = products
    .filter((product) => {
      if (
        filterText &&
        !product.name.toLowerCase().includes(filterText.toLowerCase())
      ) {
        return false;
      }
      if (inStockOnly && !product.stocked) {
        return false;
      }
      return true;
    })
    .sort((a, b) => {
      if (!sort) {
        return 0;
      }
      const nameA = a.name.toUpperCase();
      const nameB = b.name.toUpperCase();
      if (nameA < nameB) {
        return sort === 'asc' ? -1 : 1;
      }
      if (nameA > nameB) {
        return sort === 'asc' ? 1 : -1;
      }
      return 0;
    })
    .reduce((acc, product, index, originalProducts) => {
      const categoryRow = (
        <ProductCategoryRow
          key={product.category}
          category={product.category}
        />
      );
      const row = <ProductRow key={product.name} product={product} />;
      const newCategory =
        !sort && (index === 0 || product.category !== originalProducts[index - 1].category);
      if (newCategory) {
        return [...acc, categoryRow, row];
      }

      return [...acc, row];
    }, []);

  function onSort() {
    setSort(!sort ? 'asc' : (sort === 'asc' ? 'desc' : ''))
  }

  return (
    <table>
      <thead>
        <tr>
          <th onClick={onSort}>Name {sort ? `(${sort})` : ''}</th>
          <th>Price</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </table>
  );
};

/*
FilterableProductTable
SearchBar
ProductTable
ProductCategoryRow
ProductRow
 */
const FilterableProductTable = ({ products }) => {
  const [filterText, setFilterText] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  return (
    <div>
      <SearchBar
        filterText={filterText}
        inStockOnly={inStockOnly}
        onFilterTextChange={setFilterText}
        onInStockOnlyChange={setInStockOnly}
      />
      <ProductTable
        products={products}
        filterText={filterText}
        inStockOnly={inStockOnly}
      />
    </div>
  );
};
function App() {
  return (
    <div>
      <FilterableProductTable products={API_RESPONSE} />
    </div>
  );
}

export default App;
