import { useDispatch, useSelector } from 'react-redux';
import styles from './index.module.scss';
import ProductCell from './ProductCell';
import { CartReducer, SneakersReducer } from '../../../../Types';
import { incPageCount } from '../../../../redux/reducers/sneakersReducer';
import { useAppDispatch } from '../../../../hooks/useAppDispatch';
import { useEffect } from 'react';
import { getSneakers } from '../../../../redux/asyncThunks/getSneakers';
import { getPriceRange } from '../../../../redux/asyncThunks/getPriceRange';
import { getSizeRange } from '../../../../redux/asyncThunks/getSizeRange';

const Main = () => {
    const appDispatch = useAppDispatch();
    const dispatch = useDispatch();

    const addedProductId = useSelector((reducer: CartReducer) => {
        return reducer.cart.addedProductId;
    });
    const data = useSelector((reducer: SneakersReducer) => {
        return reducer.sneakers.data;
    });
    const filter = useSelector((reducer: SneakersReducer) => {
        return reducer.sneakers.filter;
    });
    const currentPage = useSelector((reducer: SneakersReducer) => {
        return reducer.sneakers.currentPage;
    });
    const totalPages = useSelector((reducer: SneakersReducer) => {
        return reducer.sneakers.totalPages;
    });

    useEffect(() => {
        appDispatch(getPriceRange());
        appDispatch(getSizeRange());
    }, []);

    useEffect(() => {
        appDispatch(getSneakers([currentPage, filter]));
    }, [currentPage]);

    useEffect(() => {
        appDispatch(getSneakers([1, filter]));
    }, [filter]);

    return (
        <section className={styles.main}>
            <div>
                {data.map((pairSneakers, index) => {
                    return <ProductCell key={index} pairSneakers={pairSneakers} addedProductId={addedProductId} />;
                })}
            </div>
            {currentPage < totalPages && (
                <button className={`redButton ${styles.showMore}`} onClick={() => dispatch(incPageCount())}>
                    Показать ещё
                </button>
            )}
        </section>
    );
};

export default Main;
