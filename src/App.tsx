import Cart from './modules/Cart';
import { Navigate, Route, Routes } from 'react-router';
import Header from './modules/Header';
import Welcome from './modules/Welcome';
import Catalog from './modules/Сatalog';
import AboutUs from './modules/AboutUs';
import ProductSelection from './modules/ProductSelection';
import OurTeam from './modules/OurTeam';
import DeliveryAndPayment from './modules/DeliveryAndPayment';
import Contacts from './modules/Contacts';
import Ask from './modules/Ask';
import MakingOrder from './modules/MakingOrder';
import ProductCard from './modules/ProductCard';

function App() {
    window.onbeforeunload = () =>
        sessionStorage.setItem('scrollPos', document.getElementById('root')!.scrollTop.toString());
    window.onload = () => {
        const scrollPos = sessionStorage.getItem('scrollPos');
        if (scrollPos) document.getElementById('root')!.scrollTo(0, +scrollPos || 0);
    };
    return (
        <>
            {/* <Header />
            <main>
                <Routes>
                    <Route path="cart" element={<Cart />} />
                    <Route path="making-order" element={<MakingOrder />} />
                    <Route path={`sneakers/:name`} element={<ProductCard />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
                <Welcome />
                <Catalog />
                <AboutUs />
                <ProductSelection />
                <OurTeam />
                <DeliveryAndPayment />
                <Contacts />
                <Ask />
            </main> */}
        </>
    );
}

export default App;
