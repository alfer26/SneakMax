import { createBrowserRouter } from 'react-router';
import App from './App';
import Cart from './components/Cart';
import MakingOrder from './components/MakingOrder';
import ProductCard from './components/ProductCard';

const router = createBrowserRouter(
    [
        {
            path: '/*',
            element: <App />,
            children: [
                {
                    path: 'cart',
                    element: <Cart />,
                },
                {
                    path: 'making-order',
                    element: <MakingOrder />,
                },
                {
                    path: 'sneakers/:name',
                    element: <ProductCard />,
                },
            ],
        },
    ],
    {
        basename: '/sneakmax/',
    }
);

export default router;
