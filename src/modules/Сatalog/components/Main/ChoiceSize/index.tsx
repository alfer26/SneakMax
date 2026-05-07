import { FC, useState } from 'react';
import styles from './index.module.scss';
import { CartReducer, PairSneakers, SneakersCart } from '../../../../../Types';
import { useDispatch, useSelector } from 'react-redux';
import { addSneakersCart } from '../../../../../redux/reducers/cartReducer';

type Props = {
    pairSneakers: PairSneakers;
    setChoiceSizeDisplay: React.Dispatch<React.SetStateAction<boolean>>;
};

const ChoiceSize: FC<Props> = ({ pairSneakers, setChoiceSizeDisplay }) => {
    const dispatch = useDispatch();
    const cartLength = useSelector((reducer: CartReducer) => {
        return reducer.cart.data.length;
    });
    const [backgroundOpacity, setBackgroundOpacity] = useState(1);

    function addSneakersToCart(size: number) {
        const sneakerCart: SneakersCart = {
            id: pairSneakers.id,
            idCart: cartLength,
            imgUrl: pairSneakers.imgUrl,
            price: pairSneakers.price,
            size: size,
            title: pairSneakers.title,
            vendorСode: pairSneakers.vendorСode,
        };
        dispatch(addSneakersCart(sneakerCart));
        closeWindow();
    }

    function closeWindow() {
        setBackgroundOpacity(0);
        setTimeout(() => {
            setChoiceSizeDisplay(false);
        }, 300);
    }

    return (
        <div className={styles.background} style={{ opacity: backgroundOpacity }} onClick={closeWindow}>
            <section
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <h3>Выберите размер</h3>
                <div>
                    {pairSneakers.inStock.map((item, index) => {
                        if (item.quantity > 0)
                            return (
                                <button
                                    className="sizeButton"
                                    key={index}
                                    onClick={() => {
                                        addSneakersToCart(item.size);
                                    }}
                                >
                                    {item.size}
                                </button>
                            );
                    })}
                </div>
            </section>
        </div>
    );
};

export default ChoiceSize;
