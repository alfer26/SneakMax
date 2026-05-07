import { FC, useState } from 'react';
import styles from './index.module.scss';
import { useDispatch } from 'react-redux';
import { deleteAllSneakersCart } from '../../../redux/reducers/cartReducer';

type Props = {
    setDisplayConfirmationClearCart: React.Dispatch<React.SetStateAction<boolean>>;
};

const ConfirmationClearCart: FC<Props> = ({ setDisplayConfirmationClearCart }) => {
    const dispatch = useDispatch();
    const [backgroundOpacity, setBackgroundOpacity] = useState(1);

    function closeWindow() {
        setBackgroundOpacity(0);
        setTimeout(() => {
            setDisplayConfirmationClearCart(false);
        }, 300);
    }

    return (
        <div className={styles.background} style={{ opacity: backgroundOpacity }} onClick={closeWindow}>
            <section
                onClick={(e) => {
                    e.stopPropagation();
                }}
            >
                <h3>Вы уверены что хотите очистить всю корзину?</h3>
                <div>
                    <button className="greyButton" onClick={closeWindow}>
                        Нет
                    </button>
                    <button
                        className="redButton"
                        onClick={() => {
                            dispatch(deleteAllSneakersCart());
                            closeWindow();
                        }}
                    >
                        Да
                    </button>
                </div>
            </section>
        </div>
    );
};

export default ConfirmationClearCart;
