import { NextApiRequest, NextApiResponse } from 'next';
import fs from 'fs';
import path from 'path';

const filePath = path.resolve('database/products.json');

function readProducts() {
  const fileData = fs.readFileSync(filePath, 'utf8');
  return JSON.parse(fileData);
}

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { name } = req.query;
  const products = readProducts(); 

  const filteredProducts = products.filter((p: any) =>
    p.productName.toLowerCase().includes((name as string).toLowerCase())
  );

  if (filteredProducts.length > 0) {
    res.status(200).json(filteredProducts);
  } else {
    res.status(404).json({ message: 'No products found' });
  }
}
