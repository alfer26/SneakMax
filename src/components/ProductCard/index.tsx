import styles from './index.module.scss';
import star from '../../assets/productCard/star.svg';
import starEmpty from '../../assets/productCard/starEmpty.svg';
import chechMark from '../../assets/productCard/checkMark.svg';
import Cross from '../../assets/Cross';
import { CartReducer, PairSneakers, SneakersCart, SneakersReducer } from '../../Types';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { addSneakersCart } from '../../redux/reducers/cartReducer';
import { useNavigate, useParams } from 'react-router';
import { initial } from '../../axios/initial';
import { updatePairSneakersData } from '../../redux/reducers/sneakersReducer';

const ProductCard = () => {
    const dispatch = useDispatch();
    const { name } = useParams();
    const pairSneakersId = +name!.slice(name!.lastIndexOf('_') + 1);
    const data = useSelector((reducer: SneakersReducer) => {
        return reducer.sneakers.data;
    });
    const pairSneakersPlug = {
        id: 0,
        vendorСode: '',
        inStock: [],
        title: '',
        description: '',
        imgUrl: '',
        stars: 0,
        price: 0,
        oldPrice: 0,
        gender: '',
        color: '',
        compound: '',
        country: '',
    };
    const navigate = useNavigate();
    const [pairSneakersData, setPairSneakersData] = useState<PairSneakers>(
        data.find((item) => item.id === pairSneakersId) ?? pairSneakersPlug
    );
    const [backgroundOpacity, setBackgroundOpacity] = useState(1);
    const [chosenSize, setChosenSize] = useState<null | number>(null);
    const cartLength = useSelector((reducer: CartReducer) => {
        return reducer.cart.data.length;
    });
    const [inStock, setInStock] = useState(pairSneakersData.inStock.reduce((acc, item) => acc + item.quantity, 0));

    function addSneakersToCart(size: number) {
        const pairSneakersDataAs = pairSneakersData as PairSneakers;
        const sneakerCart: SneakersCart = {
            id: pairSneakersDataAs.id,
            idCart: cartLength,
            imgUrl: pairSneakersDataAs.imgUrl,
            price: pairSneakersDataAs.price,
            size: size,
            title: pairSneakersDataAs.title,
            vendorСode: pairSneakersDataAs.vendorСode,
        };
        dispatch(addSneakersCart(sneakerCart));
    }

    function link(path: string) {
        setBackgroundOpacity(0);
        setTimeout(() => {
            navigate(path);
        }, 300);
    }

    useEffect(() => {
        async function getData() {
            try {
                const pairSneakersDataKeys = Object.keys(pairSneakersData);
                const pairSneakersPlugKeys = Object.keys(pairSneakersPlug);
                const uniqueValues = [...pairSneakersDataKeys, ...pairSneakersPlugKeys].filter((key) => {
                    return !(pairSneakersDataKeys.includes(key) && pairSneakersPlugKeys.includes(key));
                });
                if (uniqueValues.length) {
                    const request = `sneakers/${pairSneakersId}?_select=${uniqueValues.reduce(
                        (acc, item, index, array) => {
                            if (index != array.length - 1) {
                                return (acc += `${item},`);
                            } else {
                                return (acc += `${item}`);
                            }
                        },
                        ''
                    )}`;
                    const response = await initial.get(request);
                    const updatedPairSneakersData = {
                        ...pairSneakersData,
                        ...response.data,
                    };
                    setPairSneakersData(updatedPairSneakersData);
                    dispatch(updatePairSneakersData([pairSneakersId, updatedPairSneakersData]));
                    navigate(
                        `/sneakers/${updatedPairSneakersData.title.trim().replace(/\s+/g, '_').toLowerCase()}_${
                            updatedPairSneakersData.id
                        }`
                    );
                } else {
                    const request = `sneakers/${pairSneakersId}`;
                    const response = await initial.get(request);
                    const updatedPairSneakersData: PairSneakers = {
                        ...pairSneakersData,
                        ...response.data,
                    };
                    setPairSneakersData(updatedPairSneakersData);
                    setInStock(updatedPairSneakersData.inStock.reduce((acc, item) => acc + item.quantity, 0));
                    navigate(
                        `/sneakers/${updatedPairSneakersData.title.trim().replace(/\s+/g, '_').toLowerCase()}_${
                            updatedPairSneakersData.id
                        }`
                    );
                }
            } catch (error) {
                navigate('/');
                console.error(error);
            }
        }
        getData();
    }, []);

    useEffect(() => {
        const inStock = pairSneakersData.inStock.find((item) => item.size === chosenSize);
        if (inStock) {
            const inStockSize = inStock.quantity;
            setInStock(inStockSize);
        }
    }, [chosenSize]);

    return (
        <div className={styles.background} style={{ opacity: backgroundOpacity }} onClick={() => link('/')}>
            <section className={styles.productCard} onClick={(e) => e.stopPropagation()}>
                <button className={styles.close} onClick={() => link('/')}>
                    <Cross fill={'black'} />
                </button>
                {pairSneakersData && (
                    <>
                        <img src={pairSneakersData.imgUrl} alt="Фото товара" />
                        <div className={styles.actions}>
                            <div className={styles.sideInfo}>
                                <p className={styles.vendorСode}>
                                    <span>Артикул:</span>
                                    <span>{pairSneakersData.vendorСode}</span>
                                </p>
                                <p className={styles.inStock}>
                                    <span>В наличии:</span>
                                    <span>
                                        {inStock} шт
                                        {inStock ===
                                            pairSneakersData.inStock.reduce((acc, item) => acc + item.quantity, 0) &&
                                            ' всего'}
                                    </span>
                                </p>
                            </div>
                            <h3 className={styles.title}>{pairSneakersData.title}</h3>
                            <div className={styles.stars}>
                                {new Array(5).fill(0).map((_, index) => {
                                    if (index < pairSneakersData.stars)
                                        return <img src={star} alt="Звезда оценки" key={index} />;
                                    return <img src={starEmpty} alt="Неактивная звезда оценки" key={index} />;
                                })}
                            </div>
                            <div className={styles.choiceSize}>
                                <p>Выберите размер</p>
                                <div>
                                    {pairSneakersData.inStock.map((item, index) => {
                                        return (
                                            <button
                                                key={index}
                                                className="sizeButton"
                                                disabled={item.quantity === 0}
                                                style={{
                                                    backgroundColor: chosenSize === item.size ? '#f14f4f' : '',
                                                    color: chosenSize === item.size ? 'white' : '',
                                                }}
                                                onClick={() => setChosenSize(item.size)}
                                            >
                                                {item.size}
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                            <div className={styles.price}>
                                <h2>{pairSneakersData.price} р</h2>
                                <p>{pairSneakersData.oldPrice} р</p>
                            </div>
                            <button
                                className={`${styles.addCartButton} redButton`}
                                disabled={!chosenSize}
                                onClick={() => {
                                    link('/');
                                    addSneakersToCart(chosenSize!);
                                }}
                            >
                                Добавить в корзину
                            </button>
                            <div className={styles.advantages}>
                                <div>
                                    <img src={chechMark} alt="Галочка" />
                                    <p>Бесплатная доставка до двери</p>
                                </div>
                                <div>
                                    <img src={chechMark} alt="Галочка" />
                                    <p>Оплата заказа при получении</p>
                                </div>
                                <div>
                                    <img src={chechMark} alt="Галочка" />
                                    <p>Обмен в течении двух недель</p>
                                </div>
                            </div>
                        </div>
                        <div className={styles.description}>
                            <h3>Описание</h3>
                            <p>{pairSneakersData.description}</p>
                        </div>
                        <div className={styles.characteristic}>
                            <h3>Характеристики</h3>
                            <p>Пол: {pairSneakersData.gender}</p>
                            <p>Цвета: {pairSneakersData.color}</p>
                            <p>Состав: {pairSneakersData.compound}</p>
                            <p>Страна: {pairSneakersData.country}</p>
                        </div>
                    </>
                )}
            </section>
        </div>
    );
};

export default ProductCard;
