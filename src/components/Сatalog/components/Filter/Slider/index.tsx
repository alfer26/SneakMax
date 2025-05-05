import styles from './index.module.scss';
import { FC, useEffect, useRef, useState } from 'react';

type Props = {
    range: {
        min: number | string;
        max: number | string;
    };
    value: {
        min: number | string;
        max: number | string;
    };
    setValue: React.Dispatch<
        React.SetStateAction<{
            min: number | string;
            max: number | string;
        }>
    >;
};

const Slider: FC<Props> = ({ range, value, setValue }) => {
    if (range.min > range.max) {
        throw new Error('min должен быть меньше max');
    }

    const [widthSideMargin, setWidthSideMargin] = useState({ min: 0, max: 0 });
    const sliderRef = useRef<null | HTMLElement>(null);
    const [isDragging, setIsDragging] = useState<null | string>(null);
    const minPriceMarkerRef = useRef<null | HTMLDivElement>(null);
    const maxPriceMarkerRef = useRef<null | HTMLDivElement>(null);
    const [lastTouchX, setLastTouchX] = useState<number | null>(null);

    const handlePressSlider = (e: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>) => {
        if (!sliderRef.current) return;
        let x;
        const sliderRect = sliderRef.current.getBoundingClientRect();

        if (e.type === 'mousedown') {
            e = e as React.MouseEvent<HTMLElement>;
            x = e.clientX - sliderRect.left;
            setLastTouchX(e.clientX);
        }
        if (e.type === 'touchstart') {
            e = e as React.TouchEvent<HTMLElement>;
            const touch = e.touches[0];
            x = touch.clientX - sliderRect.left;
            setLastTouchX(e.touches[0].clientX);
        }

        if (sliderRef.current && minPriceMarkerRef.current && maxPriceMarkerRef.current) {
            const widthSlider = sliderRef.current.clientWidth;
            const intervalRange = +range.max - +range.min;
            const clickRate = x! / widthSlider;
            const minPriceMarkerRate = minPriceMarkerRef.current.offsetLeft / widthSlider;
            const maxPriceMarkerRate = maxPriceMarkerRef.current.offsetLeft / widthSlider;
            const differenceMinPriceMarker = clickRate - minPriceMarkerRate;
            const differenceMaxPriceMarker = maxPriceMarkerRate - clickRate;
            if (differenceMinPriceMarker < differenceMaxPriceMarker) {
                const min = Math.round(+range.min + intervalRange * clickRate);
                setIsDragging('min');
                if (min < +range.min) {
                    setValue({ min: range.min, max: value.max });
                } else if (min > +value.max) {
                    setValue({ min: value.max, max: value.max });
                } else setValue({ min: min, max: value.max });
            }
            if (differenceMaxPriceMarker < differenceMinPriceMarker) {
                const max = Math.round(+range.min + intervalRange * clickRate);
                setIsDragging('max');
                if (max > +range.max) {
                    setValue({ min: value.min, max: range.max });
                } else if (max < +value.min) {
                    setValue({ min: value.min, max: value.min });
                } else setValue({ min: value.min, max: max });
            }
        }
    };

    const handlePressEnd = () => {
        setIsDragging(null);
    };

    const handleMove = (e: MouseEvent | TouchEvent) => {
        if (e.cancelable) e.preventDefault();
        if (sliderRef.current && lastTouchX) {
            const widthSlider = sliderRef.current.clientWidth;
            const intervalRange = +range.max - +range.min;
            const rate = intervalRange / widthSlider;
            const currentTouchX = e instanceof TouchEvent ? e.touches[0].clientX : e.clientX;
            const deltaX = currentTouchX - lastTouchX;

            if (isDragging === 'min') minPriceEdit(deltaX, rate);
            if (isDragging === 'max') maxPriceEdit(deltaX, rate);
            setLastTouchX(currentTouchX);
        }
    };

    const minPriceEdit = (deltaX: number, rate: number) => {
        const min = Math.round(+value.min + deltaX * rate);
        if (min < +range.min) {
            setValue({ min: range.min, max: value.max });
        } else if (min > +value.max) {
            setValue({ min: value.max, max: value.max });
        } else setValue({ min: min, max: value.max });
    };

    const maxPriceEdit = (deltaX: number, rate: number) => {
        const max = Math.round(+value.max + deltaX * rate);
        if (max > +range.max) {
            setValue({ min: value.min, max: range.max });
        } else if (max < +value.min) {
            setValue({ min: value.min, max: value.min });
        } else setValue({ min: value.min, max: max });
    };

    useEffect(() => {
        if (
            sliderRef.current &&
            +value.min >= +range.min &&
            +value.max <= +range.max &&
            +value.min <= +value.max &&
            +value.max >= +value.min
        ) {
            const widthSlider = sliderRef.current.clientWidth;
            const intervalRange = +range.max - +range.min;
            const rate = intervalRange / widthSlider;
            const min = ((+value.min - +range.min) / rate / widthSlider) * 100;
            const max = ((+range.max - +value.max) / rate / widthSlider) * 100;
            setWidthSideMargin({ min: min, max: max });
        }
    }, [value]);

    useEffect(() => {
        if (isDragging) {
            document.body.classList.add(styles.resizeCursor);
            document.addEventListener('mousemove', handleMove);
            document.addEventListener('mouseup', handlePressEnd);
            document.addEventListener('touchmove', handleMove, { passive: false });
            document.addEventListener('touchend', handlePressEnd);
        } else {
            document.body.classList.remove(styles.resizeCursor);
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handlePressEnd);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('touchend', handlePressEnd);
        }
        return () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handlePressEnd);
            document.removeEventListener('touchmove', handleMove);
            document.removeEventListener('touchend', handlePressEnd);
        };
    }, [isDragging]);

    return (
        <section
            className={styles.slider}
            ref={sliderRef}
            onMouseDown={handlePressSlider}
            onTouchStart={handlePressSlider}
        >
            <div
                className={styles.range}
                style={{
                    gridTemplateColumns: `${widthSideMargin.min}% 0px 1fr 0px ${widthSideMargin.max}%`,
                }}
            >
                <div className={styles.minPriceMargin} />
                <div className={styles.marker} ref={minPriceMarkerRef}>
                    <div id="min" />
                </div>
                <div className={styles.generalPriceMargin} />
                <div className={styles.marker} ref={maxPriceMarkerRef}>
                    <div id="max" />
                </div>
                <div className={styles.maxPriceMargin} />
            </div>
            <div className={styles.line} />
        </section>
    );
};

export default Slider;
