import { createBrowserRouter } from 'react-router';
import App from './App';
import Cart from './modules/Cart';
import MakingOrder from './modules/MakingOrder';
import ProductCard from './modules/ProductCard';

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
