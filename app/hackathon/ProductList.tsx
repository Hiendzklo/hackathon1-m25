"use client";

import { useEffect, useState } from 'react';
import AddProductForm from './AddProductForm';

interface Product {
  id: number;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => setProducts(data))
      .catch((error) => console.error('Error fetching products:', error));
  }, []);

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter((product) => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
  };

  const handleSave = async (updatedProduct: Product) => {
    try {
      const response = await fetch(`/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedProduct),
      });

      if (!response.ok) {
        throw new Error('Failed to update product');
      }

      const updatedProducts = products.map((product) =>
        product.id === updatedProduct.id ? updatedProduct : product
      );

      setProducts(updatedProducts);
      setEditingProduct(null);
    } catch (error) {
      console.error('Error updating product:', error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row space-x-4 p-4 min-h-screen">
      <div className="w-full md:w-2/3 h-full overflow-y-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow rounded-lg h-full">
          <thead>
            <tr>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">STT</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Tên sản phẩm</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Hình ảnh</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Giá</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Số lượng</th>
              <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 border-b">Chức năng</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-4 py-2 text-sm border-b">{index + 1}</td>
                <td className="px-4 py-2 text-sm border-b">{product.productName}</td>
                <td className="px-4 py-2 text-sm border-b">
                  <img src={product.image} alt={product.productName} className="w-26 h-24 object-cover" />
                </td>
                <td className="px-4 py-2 text-sm border-b">{product.price.toLocaleString()} VND</td>
                <td className="px-4 py-2 text-sm border-b">{product.quantity}</td>
                <td className="px-4 py-2 text-sm border-b">
                  <button
                    className="px-2 py-1 text-white bg-yellow-500 rounded"
                    onClick={() => handleEdit(product)}
                  >
                    Sửa
                  </button>
                  <button
                    className="px-2 py-1 text-white bg-red-500 rounded ml-2"
                    onClick={() => handleDelete(product.id)}
                  >
                    Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full md:w-1/3 h-full">
        <h1 className="text-lg font-semibold mb-4">Thêm mới sản phẩm</h1>
        <AddProductForm
          products={products}
          setProducts={setProducts}
          editingProduct={editingProduct}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}

export default ProductList;
