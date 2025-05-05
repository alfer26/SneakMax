import { useEffect, useRef, useState } from 'react';
import CartCell from '../Cart/CartCell';
import Cross from '../../assets/Cross';
import styles from './index.module.scss';
import { CartReducer } from '../../Types';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { initial } from '../../axios/initial';
import { deleteAllSneakersCart } from '../../redux/reducers/cartReducer';
import ConfirmationClearCart from './ConfirmationClearCart';

const MakingOrder = () => {
    const productsListRef = useRef<HTMLParagraphElement | null>(null);
    const [displayProducts, setDisplayProducts] = useState(true);
    const [displayConfirmationClearCart, setDisplayConfirmationClearCart] = useState(false);
    const [productsListHeight, setProductsListHeight] = useState(0);
    const formRef = useRef<null | HTMLFormElement>(null);
    const orderNumber = useRef(getOrderNumber(1000000, 9999999));
    const [backgroundOpacity, setBackgroundOpacity] = useState(1);
    const [responseOpacity, setResponseOpacity] = useState(0);
    const [responseZIndex, setResponseZIndex] = useState(-1);
    const [response, setResponse] = useState(<></>);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const data = useSelector((reducer: CartReducer) => {
        return reducer.cart.data;
    });

    function getOrderNumber(min: number, max: number) {
        const randomBuffer = new Uint32Array(1);
        window.crypto.getRandomValues(randomBuffer);
        const randomNumber = randomBuffer[0] / (0xffffffff + 1);
        min = Math.ceil(min);
        max = Math.floor(max);
        const croppedNumber = `${Math.floor(randomNumber * (max - min + 1)) + min}`;
        const number =
            croppedNumber.slice(0, -2) + ' ' + croppedNumber.slice(croppedNumber.length - 2, croppedNumber.length);
        return number;
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        try {
            await initial.post('orders', {
                orderNumber: orderNumber.current,
                name: formData.get('name'),
                phoneNumber: formData.get('phoneNumber'),
                email: formData.get('email'),
                orderContent: data,
            });
            setResponseOpacity(1);
            setResponseZIndex(1);
            dispatch(deleteAllSneakersCart());
            setResponse(
                <>
                    <h2>Заказ успешно оформлен. </h2>
                    <p>
                        Номер заказа: <strong>{orderNumber.current}</strong>
                    </p>
                    <p>
                        Вам позвонят для того чтобы подтвердить заказ либо подтвердите его самостоятельно по пришедшему
                        на почту письму.
                    </p>
                </>
            );
        } catch (error) {
            console.error(error);
            setResponseOpacity(1);
            setResponseZIndex(1);
            setResponse(
                <>
                    <h2>Заказ оформить не удалось</h2>
                    <h3>Попробуйте ещё раз</h3>
                </>
            );
            setTimeout(() => {
                setResponseOpacity(0);
            }, 3000);
            setTimeout(() => {
                setResponseZIndex(-1);
            }, 3500);
        }
    }

    function link(path: string) {
        setBackgroundOpacity(0);
        setTimeout(() => {
            navigate(path);
        }, 300);
    }

    useEffect(() => {
        if (!displayProducts) {
            const animation = document.getElementById('animationOpen');
            if (animation instanceof SVGAnimateElement) animation.beginElement();
        }
        if (displayProducts) {
            const animation = document.getElementById('animationClose');
            if (animation instanceof SVGAnimateElement) animation.beginElement();
        }
    }, [displayProducts]);

    useEffect(() => {
        const element = productsListRef.current;
        if (element) {
            const observer = new ResizeObserver(() => {
                if (productsListRef.current) setProductsListHeight(productsListRef.current.scrollHeight);
            });
            observer.observe(element);
            return () => {
                observer.disconnect();
            };
        }
    }, []);
    return (
        <div className={styles.background} style={{ opacity: backgroundOpacity }} onClick={() => link('/')}>
            <section
                className={styles.makingOrder}
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <button className={styles.close} onClick={() => link('/')}>
                    <Cross fill={'black'} />
                </button>

                <div className={styles.title}>
                    <h2>Оформление заказа</h2>
                    <p>Заказ {orderNumber.current}</p>
                </div>
                <div className={styles.generalInfo}>
                    <p>
                        <span>Товаров в заказе:</span>
                        <span>{data.length} шт</span>
                    </p>
                    <p>
                        <span>Общая сумма заказа:</span>
                        <span>{data.reduce((acc, item) => acc + item.price, 0)} р</span>
                    </p>
                    <div>
                        <div className={styles.actions}>
                            <button id="cancelStyle" onClick={() => setDisplayProducts(!displayProducts)}>
                                Состав заказа
                                <svg width="8" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        stroke="#444B58"
                                        strokeLinecap="round"
                                        d="M0.5 3.5L6.29289 9.29289C6.68342 9.68342 7.31658 9.68342 7.70711 9.29289L13.5 3.5"
                                    >
                                        <animate
                                            id="animationClose"
                                            begin="indefinite"
                                            attributeName="d"
                                            to="M0.5 3.5L6.29289 9.29289C6.68342 9.68342 7.31658 9.68342 7.70711 9.29289L13.5 3.5"
                                            dur="170ms"
                                            fill="freeze"
                                        />
                                        <animate
                                            id="animationOpen"
                                            begin="indefinite"
                                            attributeName="d"
                                            to="M0.5 10L6.29289 4.20711C6.68342 3.81658 7.31658 3.81658 7.70711 4.20711L13.5 10"
                                            dur="170ms"
                                            fill="freeze"
                                        />
                                    </path>
                                </svg>
                            </button>
                            {data.length !== 0 && (
                                <button id="cancelStyle" onClick={() => setDisplayConfirmationClearCart(true)}>
                                    Очистить корзину
                                </button>
                            )}
                        </div>

                        <div
                            className={styles.productsList}
                            ref={productsListRef}
                            style={{ maxHeight: displayProducts ? `${productsListHeight}px` : '0px' }}
                        >
                            <div>
                                {data.length === 0 ? (
                                    <p className={styles.cartEmpty}>Корзина пуста...</p>
                                ) : (
                                    data.map((item, index) => {
                                        return <CartCell key={index} pairSneakers={item} />;
                                    })
                                )}
                            </div>
                        </div>
                    </div>
                </div>
                <form onSubmit={handleSubmit} ref={formRef}>
                    <input type="text" placeholder="Ваше имя" name="name" required />
                    <input type="text" placeholder="Номер телефона" name="phoneNumber" required />
                    <input type="email" placeholder="E-mail" name="email" required />
                    <button type="submit" className="redButton" disabled={data.length === 0}>
                        {data.length === 0 ? 'Добавьте товар в корзину' : 'Оформить заказ'}
                    </button>
                </form>
                <div className={styles.response} style={{ opacity: responseOpacity, zIndex: responseZIndex }}>
                    {response}
                </div>
                {displayConfirmationClearCart && (
                    <ConfirmationClearCart setDisplayConfirmationClearCart={setDisplayConfirmationClearCart} />
                )}
            </section>
        </div>
    );
};

export default MakingOrder;
