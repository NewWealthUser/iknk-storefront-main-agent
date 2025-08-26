import { NextApiRequest, NextApiResponse } from 'next';
import { serialize, parse } from 'cookie';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { action, token, cartId } = req.body;

    if (action === 'setAuthToken' && token) {
      res.setHeader('Set-Cookie', serialize('_medusa_jwt', token, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      }));
      console.log(`API: Set _medusa_jwt cookie for token: ${token ? 'present' : 'missing'}`); // LOG
      return res.status(200).json({ message: 'Auth token set' });
    } else if (action === 'removeAuthToken') {
      res.setHeader('Set-Cookie', serialize('_medusa_jwt', '', {
        maxAge: -1,
        path: '/',
      }));
      console.log('API: Removed _medusa_jwt cookie'); // LOG
      return res.status(200).json({ message: 'Auth token removed' });
    } else if (action === 'setCartId' && cartId) {
      res.setHeader('Set-Cookie', serialize('_medusa_cart_id', cartId, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        path: '/',
      }));
      console.log(`API: Set _medusa_cart_id cookie for cartId: ${cartId}`); // LOG
      return res.status(200).json({ message: 'Cart ID set' });
    } else if (action === 'removeCartId') {
      res.setHeader('Set-Cookie', serialize('_medusa_cart_id', '', {
        maxAge: -1,
        path: '/',
      }));
      console.log('API: Removed _medusa_cart_id cookie'); // LOG
      return res.status(200).json({ message: 'Cart ID removed' });
    } else {
      console.warn(`API: Invalid POST action or missing parameters. Action: ${action}, Token: ${token ? 'present' : 'missing'}, CartId: ${cartId ? 'present' : 'missing'}`); // LOG
      return res.status(400).json({ message: 'Invalid action or missing parameters' });
    }
  } else if (req.method === 'GET') {
    console.log(`API: GET request received. Headers.cookie: ${req.headers.cookie}`); // LOG
    const cookies = parse(req.headers.cookie || '');
    const { action } = req.query;

    if (action === 'getAuthHeaders') {
      const token = cookies._medusa_jwt;
      console.log(`API: getAuthHeaders - _medusa_jwt: ${token ? 'present' : 'missing'}`); // LOG
      if (!token) {
        return res.status(200).json({});
      }
      return res.status(200).json({ authorization: `Bearer ${token}` });
    } else if (action === 'getCartId') {
      const cartId = cookies._medusa_cart_id;
      console.log(`API: getCartId - _medusa_cart_id: ${cartId ? 'present' : 'missing'}, Value: ${cartId}`); // LOG
      return res.status(200).json({ cartId });
    } else {
      console.warn(`API: Invalid GET action. Action: ${action}`); // LOG
      return res.status(400).json({ message: 'Invalid action' });
    }
  } else {
    res.setHeader('Allow', ['POST', 'GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}