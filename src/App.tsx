import Cart from './components/Cart';
import { Navigate, Route, Routes } from 'react-router';
import Header from './components/Header';
import Welcome from './components/Welcome';
import Catalog from './components/Сatalog';
import AboutUs from './components/AboutUs';
import ProductSelection from './components/ProductSelection';
import OurTeam from './components/OurTeam';
import DeliveryAndPayment from './components/DeliveryAndPayment';
import Contacts from './components/Contacts';
import Ask from './components/Ask';
import MakingOrder from './components/MakingOrder';
import ProductCard from './components/ProductCard';

function App() {
    window.onbeforeunload = () =>
        sessionStorage.setItem('scrollPos', document.getElementById('root')!.scrollTop.toString());
    window.onload = () => {
        const scrollPos = sessionStorage.getItem('scrollPos');
        if (scrollPos) document.getElementById('root')!.scrollTo(0, +scrollPos || 0);
    };
    return (
        <>
            <Header />
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
            </main>
        </>
    );
}

export default App;
