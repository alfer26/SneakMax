import CartCell from './CartCell';
import styles from './index.module.scss';
import { useSelector } from 'react-redux';
import { CartReducer } from '../../Types';
import { useNavigate } from 'react-router';
import { useState } from 'react';

const Cart = () => {
    const data = useSelector((reducer: CartReducer) => {
        return reducer.cart.data;
    });
    const navigate = useNavigate();
    const [backgroundOpacity, setBackgroundOpacity] = useState(1);

    function link(path: string) {
        setBackgroundOpacity(0);
        setTimeout(() => {
            navigate(path);
        }, 300);
    }

    return (
        <div className={styles.background} style={{ opacity: backgroundOpacity }} onClick={() => link('/')}>
            <section
                className={styles.cart}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <div className={styles.cartContent}>
                    {data.length === 0 ? (
                        <h3 className={styles.cartEmpty}>Корзина пуста...</h3>
                    ) : (
                        data.map((item, index) => {
                            return <CartCell key={index} pairSneakers={item} />;
                        })
                    )}
                </div>
                <div className={styles.menu}>
                    <div>
                        <p>Итого:</p>
                        <p className={styles.totalAmount}>{data.reduce((acc, item) => acc + item.price, 0)} р</p>
                    </div>
                    <button className={`${styles.mackingOrderButton} redButton`} disabled={data.length === 0} onClick={() => link('/making-order')}>
                        К оформллению заказа
                    </button>
                </div>
            </section>
        </div>
    );
};

export default Cart;
