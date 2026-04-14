const DB_KEY = "toptanci_veritabani";

// LocalStorage'dan veriyi çeken fonksiyon
export const getDB = () => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem(DB_KEY);
  return data ? JSON.parse(data) : null;
};

// LocalStorage'a veriyi kaydeden fonksiyon
export const saveDB = (data) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(DB_KEY, JSON.stringify(data));
  }
};

// Sistem ilk kez açıldığında yüklenecek boş tablo yapısı
export const initialData = {
  categories: [
    { id: 1, name: "Gıda" },
    { id: 2, name: "Temizlik" }
  ],
  products: [
    { id: 1, name: "Pilavlık Pirinç", price: 150, stock: 50, categoryId: 1 }
  ],
  customers: [],
  orders: [],
  orderDetails: []
};