"use client";

import { useState, useEffect } from 'react';

interface Product {
  id: number;
  productName: string;
  price: number;
  image: string;
  quantity: number;
}

interface AddProductFormProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  editingProduct: Product | null;
  onSave: (updatedProduct: Product) => void;
}

function AddProductForm({ products, setProducts, editingProduct, onSave }: AddProductFormProps) {
  const [productName, setProductName] = useState('');
  const [image, setImage] = useState('');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (editingProduct) {
      setProductName(editingProduct.productName);
      setImage(editingProduct.image);
      setPrice(editingProduct.price.toString());
      setQuantity(editingProduct.quantity);
    } else {
      // Reset form if not editing
      setProductName('');
      setImage('');
      setPrice('');
      setQuantity(1);
    }
  }, [editingProduct]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newProduct = {
      id: editingProduct ? editingProduct.id : Date.now(),
      productName,
      price: Number(price),
      image,
      quantity: Number(quantity),
    };

    if (editingProduct) {
      onSave(newProduct);
    } else {
      try {
        const response = await fetch('/api/products', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newProduct),
        });

        if (!response.ok) {
          throw new Error('Failed to add product');
        }

        const data = await response.json();
        setProducts([...products, data]);

        // Reset form
        setProductName('');
        setImage('');
        setPrice('');
        setQuantity(1);

      } catch (error) {
        console.error('Error adding product:', error);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-white shadow rounded-lg">
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Tên</label>
        <input
          type="text"
          value={productName}
          onChange={(e) => setProductName(e.target.value)}
          placeholder="Tên sản phẩm"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Hình ảnh</label>
        <input
          type="text"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          placeholder="Hình ảnh"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Giá</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Giá"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-700">Số lượng</label>
        <input
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
          min="1"
          placeholder="Số lượng"
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
        />
      </div>
      <button type="submit" className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded">
        {editingProduct ? 'Lưu' : 'Thêm'}
      </button>
    </form>
  );
}

export default AddProductForm;
