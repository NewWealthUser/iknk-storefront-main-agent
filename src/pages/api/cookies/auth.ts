import { NextApiRequest, NextApiResponse } from 'next';
import { serialize, parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const isProduction = process.env.NODE_ENV === 'production';

  if (req.method === 'POST') {
    const { action, token, cartId } = req.body;

    if (action === 'setAuthToken' && token) {
      res.setHeader('Set-Cookie', serialize('_medusa_jwt', token, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'strict',
        secure: isProduction, // Use isProduction for secure flag
        path: '/',
      }));
      return res.status(200).json({ message: 'Auth token set' });
    } else if (action === 'removeAuthToken') {
      res.setHeader('Set-Cookie', serialize('_medusa_jwt', '', {
        maxAge: -1,
        path: '/',
      }));
      return res.status(200).json({ message: 'Auth token removed' });
    } else if (action === 'setCartId' && cartId) {
      res.setHeader('Set-Cookie', serialize('_medusa_cart_id', cartId, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'strict',
        secure: isProduction, // Use isProduction for secure flag
        path: '/',
      }));
      return res.status(200).json({ message: 'Cart ID set' });
    } else if (action === 'removeCartId') {
      res.setHeader('Set-Cookie', serialize('_medusa_cart_id', '', {
        maxAge: -1,
        path: '/',
      }));
      return res.status(200).json({ message: 'Cart ID removed' });
    } else {
      return res.status(400).json({ message: 'Invalid action or missing parameters' });
    }
  } else if (req.method === 'GET') {
    const cookies = parse(req.headers.cookie || '');
    const { action } = req.query;

    if (action === 'getAuthHeaders') {
      const token = cookies._medusa_jwt;
      if (!token) {
        return res.status(200).json({});
      }
      return res.status(200).json({ authorization: `Bearer ${token}` });
    } else if (action === 'getCartId') {
      const cartId = cookies._medusa_cart_id;
      return res.status(200).json({ cartId });
    } else {
      return res.status(400).json({ message: 'Invalid action' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}