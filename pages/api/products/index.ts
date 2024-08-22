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
  if (req.method === 'GET') {
    const products = readProducts();
    res.status(200).json(products);
  } else if (req.method === 'POST') {
    const { id, productName, price, image, quantity } = req.body;

    if (!id || !productName || !price || !image || !quantity) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const products = readProducts();
    const newProduct = { id, productName, price: Number(price), image, quantity: Number(quantity) };
    products.push(newProduct);
    writeProducts(products);

    res.status(201).json(newProduct);
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
