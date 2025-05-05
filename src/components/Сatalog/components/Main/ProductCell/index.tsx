import styles from './index.module.scss';
import show from '../../../../../assets/catalog/show.svg';
import cart from '../../../../../assets/cart.svg';
import { FC, useEffect, useRef, useState } from 'react';
import { PairSneakers, Point } from '../../../../../Types';
import ChoiceSize from '../ChoiceSize';
import { Link } from 'react-router';
import { useDispatch } from 'react-redux';
import { resetAddedProductId } from '../../../../../redux/reducers/cartReducer';
import * as THREE from 'three';

type Props = {
    pairSneakers: PairSneakers;
    addedProductId: number | null;
};

const ProductCell: FC<Props> = ({ pairSneakers, addedProductId }) => {
    const sneakersTitleUrl = pairSneakers.title.trim().replace(/\s+/g, '_').toLowerCase();
    const dispatch = useDispatch();

    const bottomDivAddCartRef = useRef<null | HTMLDivElement>(null);
    const topDivAddCartRef = useRef<null | HTMLDivElement>(null);
    const imgRef = useRef<null | HTMLImageElement>(null);
    const [visibleActions, setVisibleActions] = useState<React.CSSProperties>({ opacity: 0, pointerEvents: 'none' });
    const [choiceSizeDisplay, setChoiceSizeDisplay] = useState(false);
    const cardPersonRef = useRef<HTMLElement | null>(null);

    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
        if (cardPersonRef.current && !cardPersonRef.current.contains(event.target as Node)) {
            setVisibleActions({ opacity: 0, pointerEvents: 'none' });
        }
    };

    useEffect(() => {
        document.addEventListener('touchstart', handleClickOutside);
        return () => {
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, []);

    useEffect(() => {
        if (addedProductId === pairSneakers.id) {
            const cart = document.getElementById('cart');
            const img = imgRef.current;
            const bottomDivAddCart = bottomDivAddCartRef.current;
            const topDivAddCart = topDivAddCartRef.current;
            if (cart && img && bottomDivAddCart && topDivAddCart) {
                const cartRect = cart.getBoundingClientRect();
                const cartX = cartRect.left + cartRect.width / 2;
                const cartY = cartRect.top + cartRect.height / 2;

                const productRect = img.getBoundingClientRect();
                const productX = productRect.left + productRect.width / 2;
                const productY = productRect.top + productRect.height / 2;
                const productWidth = productRect.width;
                const productHeight = productRect.height;
                const productLeft = productRect.left;
                const productTop = productRect.top;
                const deltaX = cartX - productX;
                const deltaY = cartY - productY;

                const duration = 830;
                const easing = 'cubic-bezier(0.8, 0, 0.7, 1)';

                const scene = new THREE.Scene();
                const camera = new THREE.OrthographicCamera(
                    -window.innerWidth / 2,
                    window.innerWidth / 2,
                    window.innerHeight / 2,
                    -window.innerHeight / 2,
                    0.1,
                    1000
                );
                camera.position.z = 5;
                camera.lookAt(scene.position);
                camera.left = 0;
                camera.right = window.innerWidth;
                camera.top = 0;
                camera.bottom = -window.innerHeight;
                scene.scale.y = -1;
                camera.updateProjectionMatrix();

                const bottomRenderer = new THREE.WebGLRenderer({ alpha: true });
                const topRenderer = new THREE.WebGLRenderer({ alpha: true });
                bottomDivAddCart.appendChild(bottomRenderer.domElement);
                topDivAddCart.appendChild(topRenderer.domElement);
                bottomRenderer.setSize(window.innerWidth, window.innerHeight);
                topRenderer.setSize(window.innerWidth, window.innerHeight);

                const textureLoader = new THREE.TextureLoader();

                const texture = textureLoader.load(pairSneakers.imgUrl);
                texture.flipY = false;

                const geometry = new THREE.PlaneGeometry(productWidth, productHeight, 10, 10);
                const material = new THREE.MeshBasicMaterial({
                    color: 0xffffff,
                    map: texture,
                    side: THREE.DoubleSide,
                });
                const plane = new THREE.Mesh(geometry, material);

                scene.add(plane);

                const vertexes = geometry.attributes.position.array;

                const vertexGroups: Point[] = [];
                for (let i = 0; i < vertexes.length; i += 3) {
                    const proxy = {
                        get x() {
                            return vertexes[i];
                        },
                        set x(value: number) {
                            vertexes[i] = value;
                        },
                        get y() {
                            return vertexes[i + 1];
                        },
                        set y(value: number) {
                            vertexes[i + 1] = value;
                        },
                    };
                    vertexGroups.push(proxy);
                }

                vertexGroups.forEach((item) => {
                    item.x += productWidth / 2 + productLeft;
                    item.y += productHeight / 2 + productTop;
                });

                const initialVertices: Point[] = [];
                for (let i = 0; i < vertexes.length; i += 3) {
                    initialVertices.push({
                        x: vertexes[i],
                        y: vertexes[i + 1],
                    });
                }

                let animationProgress = 0;
                const animationDuration = (duration - 30) * 0.92;
                let startTime = Date.now();

                let nearestVertexNumber: number;
                let minDistance = Infinity;

                vertexGroups.forEach((item, index) => {
                    const dx = Math.abs(item.x - cartX);
                    const dy = Math.abs(item.y - cartY);
                    const distance = Math.sqrt(dx ** 2 + dy ** 2);

                    if (distance < minDistance) {
                        minDistance = distance;
                        nearestVertexNumber = index;
                    }
                });

                function calculateWeight(distance: number, maxDistance: number, factor: number) {
                    const weight = 1 - factor * (distance / maxDistance);
                    return weight;
                }

                let isFirstPhaseComplete = false;

                function animate() {
                    const currentTime = Date.now();
                    const elapsedTime = currentTime - startTime;

                    if (!isFirstPhaseComplete) {
                        if (elapsedTime < animationDuration) {
                            animationProgress = elapsedTime / animationDuration;
                            let maxDistanceFromTarget = 0;
                            let minDistanceFromTarget = Infinity;

                            vertexGroups.forEach((item, index) => {
                                const distanceFromTarget = (() => {
                                    const dx = item.x - cartX;
                                    const dy = item.y - cartY;
                                    const distance = Math.sqrt(dx ** 2 + dy ** 2);
                                    return distance;
                                })();

                                if (distanceFromTarget > maxDistanceFromTarget) {
                                    maxDistanceFromTarget = distanceFromTarget;
                                } else if (distanceFromTarget < minDistanceFromTarget) {
                                    minDistanceFromTarget = distanceFromTarget;
                                }

                                const weight = calculateWeight(
                                    distanceFromTarget,
                                    maxDistanceFromTarget,
                                    1 - animationProgress ** 3
                                );

                                item.x =
                                    initialVertices[index].x +
                                    (deltaX - (initialVertices[index].x - productX)) * animationProgress * weight;
                                item.y =
                                    initialVertices[index].y +
                                    (deltaY - (initialVertices[index].y - productY)) * animationProgress * weight;
                            });

                            geometry.attributes.position.needsUpdate = true;
                        } else {
                            isFirstPhaseComplete = true;
                            startTime = Date.now();
                        }
                    } else {
                        const secondPhaseDuration = (duration - 30) * 0.08;
                        const secondPhaseProgress = (Date.now() - startTime) / secondPhaseDuration;

                        if (secondPhaseProgress < 1) {
                            const mainVertexNumber = nearestVertexNumber;
                            const mainVertex = vertexGroups[mainVertexNumber];

                            vertexGroups.forEach((item, index) => {
                                if (index !== mainVertexNumber) {
                                    item.x = item.x + (mainVertex.x - item.x) * secondPhaseProgress;
                                    item.y = item.y + (mainVertex.y - item.y) * secondPhaseProgress;
                                }
                            });

                            geometry.attributes.position.needsUpdate = true;
                        }
                    }

                    requestAnimationFrame(animate);
                    bottomRenderer.render(scene, camera);
                    topRenderer.render(scene, camera);
                }

                setTimeout(() => {
                    animate();
                    bottomDivAddCart.style.zIndex = '10';
                    img.animate([{ opacity: 0.0 }, { opacity: 0.4 }, { opacity: 1 }], {
                        duration: duration,
                        easing: easing,
                    });
                    topDivAddCart.animate(
                        [
                            { opacity: 0.0 },
                            { opacity: 0.0 },
                            { opacity: 0.1 },
                            { opacity: 0.3 },
                            { opacity: 0.5 },
                            { opacity: 0.7 },
                            { opacity: 0.9 },
                            { opacity: 1 },
                            { opacity: 1 },
                        ],
                        {
                            duration: duration,
                            easing: easing,
                        }
                    );
                }, 30);

                setTimeout(() => {
                    bottomRenderer.dispose();
                    topRenderer.dispose();
                    bottomRenderer.forceContextLoss();
                    topRenderer.forceContextLoss();
                }, duration + 50);

                setTimeout(() => {
                    dispatch(resetAddedProductId());
                }, duration);
            }
        }
    }, [addedProductId]);

    return (
        <>
            <section
                ref={cardPersonRef}
                className={styles.cardPerson}
                onTouchStart={() => setVisibleActions({ opacity: 1, pointerEvents: 'all' })}
            >
                <figure>
                    <img src={pairSneakers.imgUrl} alt="Фото товара" ref={imgRef} />
                    {addedProductId === pairSneakers.id && (
                        <>
                            <div className={styles.bottomDivAddCart} ref={bottomDivAddCartRef}></div>
                            <div className={styles.topDivAddCart} ref={topDivAddCartRef}></div>
                        </>
                    )}

                    <div className={styles.actions} style={visibleActions}>
                        <Link to={`sneakers/${`${sneakersTitleUrl}`}_${pairSneakers.id}`}>
                            <img src={show} alt="Просмотреть" />
                        </Link>

                        <button id="cancelStyle" onClick={() => setChoiceSizeDisplay(true)}>
                            <img src={cart} alt="Добавить в корзину" />
                        </button>
                    </div>
                </figure>
                <p>{pairSneakers.title}</p>
                <p className="price">{pairSneakers.price} р</p>
            </section>

            {choiceSizeDisplay && (
                <ChoiceSize pairSneakers={pairSneakers} setChoiceSizeDisplay={setChoiceSizeDisplay} />
            )}
        </>
    );
};

export default ProductCell;
