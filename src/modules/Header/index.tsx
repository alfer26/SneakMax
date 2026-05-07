import styles from './index.module.scss';
import { useEffect, useRef, useState } from 'react';
import cart from '../../assets/cart.svg';
import burgerMenu from '../../assets/header/burgerMenu.svg';
import Cross from '../../assets/Cross';
import { CartReducer } from '../../Types';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const Header = () => {
    const headerDesktopRef = useRef<HTMLElement | null>(null);
    const headerMobileRef = useRef<HTMLElement | null>(null);
    const countRef = useRef<HTMLDivElement | null>(null);
    const [headerDisplay, setHeaderDisplay] = useState(document.body.clientWidth > 1024 ? 'desktop' : 'mobile');

    const [menuVisible, setMenuVisible] = useState(false);
    const [translateY, setTranslateY] = useState(-100);
    const [blur, setBlur] = useState(0);

    const cartLength = useSelector((reducer: CartReducer) => {
        return reducer.cart.data.length;
    });

    const menuDisplay = () => {
        if (!menuVisible) {
            setMenuVisible(true);
            setTranslateY(0);
            setBlur(2);
        }
        if (menuVisible) {
            setTranslateY(-100);
            setBlur(0);
            setTimeout(() => setMenuVisible(false), 400);
        }
    };
    function anchor(id: string) {
        document.getElementById(id)!.scrollIntoView();
    }

    useEffect(() => {
        const count = countRef.current;
        if (count) {
            count.animate([{ scale: 1 }, { scale: 1.2 }, { scale: 1 }], {
                duration: 500,
                easing: 'cubic-bezier(0, 0.5, 1, 1)',
                delay: 800,
            });
        }
    }, [cartLength]);

    useEffect(() => {
        function resize(e: UIEvent) {
            const target = e.target as Window;
            if (target.innerWidth > 1024) {
                setHeaderDisplay('desktop');
            }
            if (target.innerWidth <= 1024) {
                setHeaderDisplay('mobile');
            }
        }
        window.addEventListener('resize', resize);
        return () => window.removeEventListener('resize', resize);
    }, []);

    return (
        <>
            {headerDisplay === 'desktop' && (
                <header className={`${styles.header} ${styles.desktop}`} ref={headerDesktopRef}>
                    <div>
                        <h2>SneakMax</h2>
                        <nav className={`menu ${styles.nav}`}>
                            <button id="cancelStyle" onClick={() => anchor('catalog')}>
                                Каталог
                            </button>
                            <button id="cancelStyle" onClick={() => anchor('aboutUs')}>
                                О нас
                            </button>
                            <button id="cancelStyle" onClick={() => anchor('productSelection')}>
                                Подбор товара
                            </button>
                            <button id="cancelStyle" onClick={() => anchor('ourTeam')}>
                                Наша команда
                            </button>
                            <button id="cancelStyle" onClick={() => anchor('deliveryAndPayment')}>
                                Доставка и оплата
                            </button>
                            <button id="cancelStyle" onClick={() => anchor('contacts')}>
                                Контакты
                            </button>
                            <Link to="/cart">
                                <button className={styles.cartButton}>
                                    <span>Корзина</span>
                                    <div className={styles.cart}>
                                        <img src={cart} alt="" id="cart" />
                                        {cartLength !== 0 && (
                                            <div className={styles.count} ref={countRef}>
                                                {cartLength < 10 ? cartLength : '9+'}
                                            </div>
                                        )}
                                    </div>
                                </button>
                            </Link>
                        </nav>
                    </div>
                    <hr />
                </header>
            )}
            {headerDisplay === 'mobile' && (
                <header className={`${styles.header} ${styles.mobile}`} ref={headerMobileRef}>
                    <div>
                        <h2>SneakMax</h2>
                        <nav className={`menu ${styles.nav}`}>
                            <Link to="/cart">
                                <button className={styles.cartButton}>
                                    <img src={cart} alt="Корзина" id="cart" />
                                    {cartLength !== 0 && (
                                        <div className={styles.count}>{cartLength < 10 ? cartLength : '9+'}</div>
                                    )}
                                </button>
                            </Link>

                            <button onClick={menuDisplay}>
                                <img src={burgerMenu} alt="Меню" />
                            </button>
                        </nav>
                        {menuVisible && (
                            <div
                                className={styles.backgroundMenu}
                                style={{ backdropFilter: `blur(${blur}px)` }}
                                onClick={menuDisplay}
                            >
                                <section
                                    className={styles.menu}
                                    style={{ transform: `translateY(${translateY}%)` }}
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <h2>SneakMax</h2>
                                    <hr />
                                    <nav className={styles.navGeneral}>
                                        <button id="cancelStyle" onClick={() => anchor('catalog')}>
                                            Каталог
                                        </button>
                                        <button id="cancelStyle" onClick={() => anchor('aboutUs')}>
                                            О нас
                                        </button>
                                        <button id="cancelStyle" onClick={() => anchor('productSelection')}>
                                            Подбор товара
                                        </button>
                                        <button id="cancelStyle" onClick={() => anchor('ourTeam')}>
                                            Наша команда
                                        </button>
                                        <button id="cancelStyle" onClick={() => anchor('deliveryAndPayment')}>
                                            Доставка и оплата
                                        </button>
                                        <button id="cancelStyle" onClick={() => anchor('contacts')}>
                                            Контакты
                                        </button>
                                    </nav>
                                    <button className={styles.closeButton} onClick={menuDisplay}>
                                        <Cross fill={'white'} />
                                    </button>
                                </section>
                            </div>
                        )}
                    </div>
                    <hr />
                </header>
            )}
        </>
    );
};

export default Header;
