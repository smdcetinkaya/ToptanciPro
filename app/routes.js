import { index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.jsx"),
  route("customers", "routes/customers.jsx"),
  route("products", "routes/products.jsx"),
  route("categories", "routes/categories.jsx"),
  route("orders", "routes/orders.jsx"),
];