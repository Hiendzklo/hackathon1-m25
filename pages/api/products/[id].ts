import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('database/products.json');

function readProducts() {
  const fileData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileData);
}

function writeProducts(products: any) {
  fs.writeFileSync(filePath, JSON.stringify(products, null, 2));
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { id } = req.query;

  const products = readProducts();
  const productIndex = products.findIndex((p: any) => p.id === Number(id));

  if (req.method === 'DELETE') {
    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    products.splice(productIndex, 1);
    writeProducts(products);

    return res.status(200).json({ message: 'Product deleted' });
  } else if (req.method === 'PUT') {
    const { productName, price, image, quantity } = req.body;

    if (productIndex === -1) {
      return res.status(404).json({ message: 'Product not found' });
    }

    products[productIndex] = { id: Number(id), productName, price, image, quantity };
    writeProducts(products);

    return res.status(200).json(products[productIndex]);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
