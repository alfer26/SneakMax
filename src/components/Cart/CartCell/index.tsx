import { FC } from 'react';
import trash from '../../../assets/cart/trash.svg';
import { SneakersCart } from '../../../Types';
import styles from './index.module.scss';
import { useDispatch } from 'react-redux';
import { deleteSneakersCart } from '../../../redux/reducers/cartReducer';
import { Link } from 'react-router-dom';

type Props = {
    pairSneakers: SneakersCart;
};

const CartCell: FC<Props> = ({ pairSneakers }) => {
    const dispatch = useDispatch();
    const sneakersTitleUrl = pairSneakers.title.trim().replace(/\s+/g, '_').toLowerCase();

    return (
        <section className={styles.cartCell}>
            <Link to={`/sneakers/${`${sneakersTitleUrl}`}_${pairSneakers.id}`}>
                <img src={pairSneakers.imgUrl} alt="Фото товара" />
            </Link>
            <div>
                <p>{pairSneakers.title}</p>
                <p className={styles.price}>{pairSneakers.price} р</p>
            </div>

            <button onClick={() => dispatch(deleteSneakersCart(pairSneakers.idCart))}>
                <img src={trash} alt="Удалить" />
            </button>
        </section>
    );
};

export default CartCell;
