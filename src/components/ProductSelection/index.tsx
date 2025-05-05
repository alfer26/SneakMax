import { useLayoutEffect, useRef, useState } from 'react';
import FirstStep from './components/FirstStep';
import SecondStep from './components/SecondStep';
import ThirdStep from './components/ThirdStep';
import styles from './index.module.scss';
import { DataProductSelection, DataTakeOffer } from '../../Types';
import { initial } from '../../axios/initial';

const ProductSelection = () => {
    const [responseZIndex, setResponseZIndex] = useState(-1);
    const [responseOpacity, setResponseOpacity] = useState(0);
    const [response, setResponse] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [emptyWarningUpdate, setEmptyWarningUpdate] = useState<null | number>(null);
    const [height, setHeight] = useState<number>(0);
    const firstStepRef = useRef<null | HTMLDivElement>(null);
    const takeOfferRef = useRef<null | HTMLFormElement>(null);
    const [takeOfferWindowDisplay, setTakeOfferWindowDisplay] = useState(false);
    const [dataProductSelection, setDataProductSelection] = useState<DataProductSelection>({
        types: [],
        sizes: [],
        correction: '',
    });
    const [dataTakeOffer, setDataTakeOffer] = useState<DataTakeOffer>({
        name: '',
        email: '',
    });

    const handleSubmitProductSelection = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setTakeOfferWindowDisplay(true);
    };

    function nextStep() {
        if (currentStep < 3) {
            if (
                (currentStep === 1 && dataProductSelection?.types.length === 0) ||
                (currentStep === 2 && dataProductSelection?.sizes.length === 0)
            ) {
                setEmptyWarningUpdate(Date.now());
            } else {
                setCurrentStep(currentStep + 1);
            }
        }
    }

    async function handleSubmitTakeOffer(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        try {
            await initial.post('productSelection', {
                ...dataTakeOffer,
                ...dataProductSelection,
            });
            setResponse(true);
            setResponseOpacity(1);
            setResponseZIndex(1);
            setTimeout(() => {
                setDataProductSelection({ types: [], sizes: [], correction: '' });
                setDataTakeOffer({ name: '', email: '' });
            }, 700);
        } catch (error) {
            console.error(error);
            setResponse(false);
            setResponseOpacity(1);
            setResponseZIndex(1);
            setTimeout(() => setResponseOpacity(0), 3000);
            setTimeout(() => setResponseZIndex(-1), 3700);
        }
    }

    useLayoutEffect(() => {
        if (!firstStepRef.current) return;
        const observer = new ResizeObserver(() => {
            if (!firstStepRef.current) return;
            setHeight(firstStepRef.current.offsetHeight);
        });
        observer.observe(firstStepRef.current);
        return () => {
            observer.disconnect();
        };
    });
    return (
        <section className={styles.productSelection} id="productSelection">
            {!takeOfferWindowDisplay && (
                <form onSubmit={(e) => handleSubmitProductSelection(e)} ref={takeOfferRef}>
                    <div className={styles.title}>
                        <h2>Мы подберем идеальную пару для вас</h2>
                        <p>Ответьте на три вопроса и мы вышлем каталог с самыми подходящими для вас моделями</p>
                    </div>
                    <hr />
                    <div className={styles.main}>
                        <FirstStep
                            emptyWarningUpdate={emptyWarningUpdate}
                            takeOfferRef={takeOfferRef}
                            dataProductSelection={dataProductSelection}
                            setDataProductSelection={setDataProductSelection}
                            left={(currentStep - 1) * 105}
                            className={currentStep === 1 ? 'current' : ''}
                            firstStepRef={firstStepRef}
                        />
                        <SecondStep
                            emptyWarningUpdate={emptyWarningUpdate}
                            takeOfferRef={takeOfferRef}
                            dataProductSelection={dataProductSelection}
                            setDataProductSelection={setDataProductSelection}
                            left={(currentStep - 2) * 105}
                            className={currentStep === 2 ? 'current' : ''}
                            height={height}
                        />
                        <ThirdStep
                            dataProductSelection={dataProductSelection}
                            setDataProductSelection={setDataProductSelection}
                            left={(currentStep - 2) * 105}
                            className={currentStep === 3 ? 'current' : ''}
                            height={height}
                        />
                    </div>
                    <hr />
                    <div className={styles.nav}>
                        <p>{currentStep} из 3</p>
                        <nav>
                            <button
                                style={{
                                    opacity: currentStep === 1 ? 0 : 1,
                                    pointerEvents: currentStep === 1 ? 'none' : 'auto',
                                }}
                                className={`transparentButton ${styles.prevStep}`}
                                onClick={() => currentStep > 1 && setCurrentStep(currentStep - 1)}
                                type="button"
                            >
                                Предыдущий шаг
                            </button>

                            {currentStep < 3 && (
                                <button
                                    className={`transparentButton ${styles.nextStep}`}
                                    onClick={nextStep}
                                    type="button"
                                >
                                    Следующий шаг
                                </button>
                            )}
                            {currentStep === 3 && (
                                <button className={`redButton ${styles.nextStep}`} type="submit">
                                    Завершить
                                </button>
                            )}
                        </nav>
                    </div>
                </form>
            )}
            {takeOfferWindowDisplay && (
                <form onSubmit={(e) => handleSubmitTakeOffer(e)}>
                    <div className={styles.title}>
                        <h2>Ваша подборка готова!</h2>
                        <p>
                            Оставьте свои контактные данные, чтобы бы мы могли отправить подготовленный для вас каталог
                        </p>
                    </div>
                    <hr />
                    <div className={styles.takeOffer}>
                        <h2>Получить предложение</h2>
                        <p>Получите подборку подходящих для вас моделей на почту</p>
                        <input
                            type="text"
                            placeholder="Ваше имя"
                            name="name"
                            required
                            defaultValue={dataTakeOffer.name}
                            onChange={(e) => {
                                dataTakeOffer.name = e.currentTarget.value;
                                setDataTakeOffer(dataTakeOffer);
                            }}
                        />
                        <input
                            type="email"
                            placeholder="E-mail"
                            name="email"
                            required
                            defaultValue={dataTakeOffer.email}
                            onChange={(e) => {
                                dataTakeOffer.email = e.currentTarget.value;
                                setDataTakeOffer(dataTakeOffer);
                            }}
                        />
                        <nav>
                            <button
                                className={`greyButton ${styles.prevStep}`}
                                type="button"
                                onClick={() => {
                                    setTakeOfferWindowDisplay(!takeOfferWindowDisplay);
                                    setCurrentStep(3);
                                }}
                            >
                                Вернуться
                            </button>
                            <button className={`redButton ${styles.nextStep}`} type="submit">
                                Получить
                            </button>
                        </nav>
                        <div className={styles.response} style={{ opacity: responseOpacity, zIndex: responseZIndex }}>
                            {response ? (
                                <>
                                    <h2>{'Ожидайте. Предложение прийдёт вам на почту.'}</h2>
                                    <button
                                        className={`greyButton  ${styles.return}`}
                                        type="button"
                                        onClick={() => {
                                            setTakeOfferWindowDisplay(!takeOfferWindowDisplay);
                                            setCurrentStep(1);
                                            setResponseOpacity(0);
                                            setResponseZIndex(-1);
                                        }}
                                    >
                                        Новое предложение
                                    </button>
                                </>
                            ) : (
                                <>
                                    <h2>{'Какая-то ошибка... Попробуйте ещё раз!'}</h2>
                                </>
                            )}
                        </div>
                    </div>
                </form>
            )}
        </section>
    );
};

export default ProductSelection;
