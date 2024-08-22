import React from 'react'
import AddProductForm from './hackathon/AddProductForm'
import ProductList from './hackathon/ProductList'

export default function page() {
  return (
    <div>
      <h1 className="text-lg font-semibold mb-4">Quản lý sản phẩm</h1>
      <ProductList />
    </div>
  )
}
