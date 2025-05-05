import styles from './index.module.scss';
import 'nouislider/distribute/nouislider.css';
import Slider from './Slider';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Filter as FilterType, RangesReducer, SneakersReducer } from '../../../../Types';
import { applyFilters } from '../../../../redux/reducers/sneakersReducer';

const Filter = () => {
    const dispatch = useDispatch();

    const priceRange = useSelector((reducer: RangesReducer) => {
        return reducer.ranges.priceRange;
    });
    const sizeRange = useSelector((reducer: RangesReducer) => {
        return reducer.ranges.sizeRange;
    });
    const filter = useSelector((reducer: SneakersReducer) => {
        return reducer.sneakers.filter;
    });
    const filterContainer = useRef<HTMLDivElement | null>(null);
    const [prevFilterCurrent, setPrevFilterCurrent] = useState<FilterType>(filter);
    const [filterCurrent, setFilterCurrent] = useState<FilterType>(filter);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const [filterContainerHeight, setFilterContainerHeight] = useState<string | number>('auto');
    const [filterContainerDisplay, setFilterContainerDisplay] = useState(false);
    const filterFormRef = useRef<null | HTMLFormElement>(null);
    const [confirmButtonDisabled, setConfirmButtonDisabled] = useState(false);
    const [resize, setResize] = useState(0);
    const [priceInterval, setPriceInterval] = useState<{ min: number | string; max: number | string }>({
        min: priceRange.min,
        max: priceRange.max,
    });
    const [selectedRadio, setSelectedRadio] = useState<null | string>(null);

    function checkСhangeFilter(prevFilterCurrent: FilterType, filterCurrent: FilterType) {
        if (filterFormRef.current) {
            if (
                prevFilterCurrent.gender !== filterCurrent.gender ||
                prevFilterCurrent.price.min !== filterCurrent.price.min ||
                prevFilterCurrent.price.max !== filterCurrent.price.max ||
                !(() => {
                    if (prevFilterCurrent.sizes.length !== filterCurrent.sizes.length) {
                        return false;
                    }

                    for (let i = 0; i < prevFilterCurrent.sizes.length; i++) {
                        if (prevFilterCurrent.sizes[i] !== filterCurrent.sizes[i]) {
                            return false;
                        }
                    }
                    return true;
                })()
            ) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setPrevFilterCurrent(filterCurrent);
        dispatch(applyFilters(filterCurrent));
        setConfirmButtonDisabled(true);
        setTimeout(() => {
            document.getElementById('catalog')!.scrollIntoView();
        });
    }

    function changeTracker() {
        if (filterFormRef.current) {
            const formData = new FormData(filterFormRef.current);
            const updateFilter: FilterType = {
                price: {
                    min: `${formData.get('minPrice')}`,
                    max: `${formData.get('maxPrice')}`,
                },
                gender: formData.get('gender') ? `${formData.get('gender') as 'Женский' | 'Мужской'}` : null,
                sizes: formData.getAll('sizes').map((item) => {
                    return `${item}`;
                }),
            };
            setConfirmButtonDisabled(!checkСhangeFilter(prevFilterCurrent, updateFilter));
            setFilterCurrent(updateFilter);
        }
    }

    function handleReset() {
        const filter = {
            price: {
                min: `${priceRange.min}`,
                max: `${priceRange.max}`,
            },
            gender: null,
            sizes: [],
        };
        setPriceInterval(priceRange);
        setSelectedRadio(null);
        setFilterCurrent(filter);
        setConfirmButtonDisabled(true);
        if (
            prevFilterCurrent.gender !== null ||
            prevFilterCurrent.price.min !== `${priceRange.min}` ||
            prevFilterCurrent.price.max !== `${priceRange.max}` ||
            prevFilterCurrent.sizes.length !== 0
        ) {
            setPrevFilterCurrent(filter);
            dispatch(applyFilters(filter));
            document.getElementById('catalog')!.scrollIntoView();
        }
    }

    const handleRadioChange = (e: React.MouseEvent<HTMLInputElement, MouseEvent>) => {
        const target = e.target as HTMLInputElement;
        const value = target.value;
        if (selectedRadio === value) {
            setSelectedRadio(null);
        } else {
            setSelectedRadio(value);
        }
    };

    const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.id === 'min') setPriceInterval({ min: e.target.value, max: priceInterval.max });
        if (e.target.id === 'max') setPriceInterval({ min: priceInterval.min, max: e.target.value });
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
        if (e.target.id === 'min') {
            if (+e.target.value < priceRange.min) {
                setPriceInterval({ min: priceRange.min, max: priceInterval.max });
            } else if (+e.target.value > +priceInterval.max) {
                setPriceInterval({ min: priceInterval.max, max: priceInterval.max });
            }
        }
        if (e.target.id === 'max') {
            if (+e.target.value > priceRange.max) {
                setPriceInterval({ min: priceInterval.min, max: priceRange.max });
            } else if (+e.target.value < +priceInterval.min) {
                setPriceInterval({ min: priceInterval.min, max: priceInterval.min });
            }
        }
    };
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            const eModified = e as unknown;
            handleBlur(eModified as React.FocusEvent<HTMLInputElement>);
        }
    };

    useEffect(() => {
        changeTracker();
    }, [selectedRadio, priceInterval]);

    useEffect(() => {
        if (!filterContainerDisplay) {
            const animation = document.getElementById('animationOpen');
            if (animation instanceof SVGAnimateElement) animation.beginElement();
        }
        if (filterContainerDisplay) {
            const animation = document.getElementById('animationClose');
            if (animation instanceof SVGAnimateElement) animation.beginElement();
        }
    }, [filterContainerDisplay]);

    useEffect(() => {
        setIsMobile(window.innerWidth <= 768);
        if (filterContainer.current) setFilterContainerHeight(filterContainer.current.scrollHeight);
    }, [resize]);

    useEffect(() => {
        setPriceInterval(priceRange);
        setPrevFilterCurrent(filterCurrent);
    }, [priceRange]);

    useEffect(() => {
        function resize() {
            setResize(Math.random);
        }
        window.addEventListener('resize', resize);
        return () => {
            window.removeEventListener('resize', resize);
        };
    }, []);
    return (
        <form className={styles.filter} onSubmit={handleSubmit} onReset={handleReset} ref={filterFormRef}>
            {isMobile && (
                <button
                    type="button"
                    onClick={() => setFilterContainerDisplay(!filterContainerDisplay)}
                    className={styles.mobileTitle}
                >
                    <h3>Подбор по параметрам</h3>
                    <svg width="12" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
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
            )}
            {!isMobile && <h3 className={styles.desktopTitle}>Подбор по параметрам</h3>}
            <div style={{ maxHeight: isMobile ? (filterContainerDisplay ? filterContainerHeight : 0) : '' }}>
                <div ref={filterContainer}>
                    <section className={styles.price}>
                        <p>Цена, руб</p>
                        <div>
                            <label aria-label="Минимальная цена">
                                <input
                                    type="number"
                                    value={priceInterval.min}
                                    onInput={handleInput}
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                    id="min"
                                    name="minPrice"
                                    min={priceRange.min}
                                    max={priceInterval.max}
                                ></input>
                            </label>
                            <label aria-label="Максимальная цена">
                                <input
                                    type="number"
                                    value={priceInterval.max}
                                    onInput={handleInput}
                                    onBlur={handleBlur}
                                    onKeyDown={handleKeyDown}
                                    id="max"
                                    name="maxPrice"
                                    max={priceRange.max}
                                    min={priceInterval.min}
                                ></input>
                            </label>
                        </div>
                        <Slider range={priceRange} value={priceInterval} setValue={setPriceInterval} />
                    </section>
                    <section className={styles.gender}>
                        <p>Пол</p>
                        <div>
                            <label className="checkbox">
                                <input
                                    type="radio"
                                    className="radioCheckbox"
                                    name="gender"
                                    value="Мужской"
                                    checked={selectedRadio === 'Мужской'}
                                    onClick={handleRadioChange}
                                    onChange={() => {}}
                                />
                                <span>мужской</span>
                            </label>
                            <label className="checkbox">
                                <input
                                    type="radio"
                                    className="radioCheckbox"
                                    name="gender"
                                    value="Женский"
                                    checked={selectedRadio === 'Женский'}
                                    onClick={handleRadioChange}
                                    onChange={() => {}}
                                />
                                <span>женский</span>
                            </label>
                        </div>
                    </section>
                    <section className={styles.size}>
                        <p>Размер</p>
                        <div>
                            {Array.from({ length: sizeRange.max - sizeRange.min + 1 }, (_, i) => sizeRange.min + i).map(
                                (item, index) => {
                                    return (
                                        <label key={index} id="cancelStyle">
                                            <p>{item}</p>
                                            <input type="checkbox" name="sizes" value={item} onInput={changeTracker} />
                                        </label>
                                    );
                                }
                            )}
                        </div>
                    </section>
                    <button className="greyButton" disabled={confirmButtonDisabled}>
                        {confirmButtonDisabled ? 'Применено' : 'Применить'}
                    </button>
                    <button type="reset">сбросить</button>
                </div>
            </div>
        </form>
    );
};

export default Filter;
