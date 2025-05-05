import store from './redux/store';

export type OurTeamData = CardPerson[];

type CardPerson = {
    id: number;
    imgUrl: string;
    name: string;
    role: string;
};

export type InStock = {
    size: number;
    quantity: number;
};

export type PairSneakers = {
    id: number;
    vendorСode: string;
    inStock: InStock[];
    title: string;
    description: string;
    imgUrl: string;
    stars: number;
    price: number;
    oldPrice: number;
    gender: string;
    color: string;
    compound: string;
    country: string;
};

export type Filter = {
    price: {
        min: string | null;
        max: string | null;
    };
    gender: 'Женский' | 'Мужской' | null;
    sizes: string[];
};

export type SneakersInitialState = {
    data: PairSneakers[];
    status: string;
    totalPages: number;
    currentPage: number;
    filter: Filter;
};

export type SneakersReducer = {
    sneakers: SneakersInitialState;
};

type Range = {
    min: number;
    max: number;
};

export type RangesInitialState = {
    priceRange: Range;
    sizeRange: Range;
    priceRangeStatus: string;
    sizeRangeStatus: string;
};

export type RangesReducer = {
    ranges: RangesInitialState;
};

export type Person = {
    id: number;
    imgUrl: string;
    name: string;
    role: string;
};

export type TeamInitialState = {
    data: Person[];
    status: string;
};

export type TeamReducer = {
    team: TeamInitialState;
};

export type SneakersCart = {
    id: number;
    idCart: number;
    vendorСode: string;
    title: string;
    imgUrl: string;
    size: number;
    price: number;
};

export type CartInitialState = {
    data: SneakersCart[];
    addedProductId: number | null;
};

export type CartReducer = {
    cart: CartInitialState;
};

export type DataProductSelection = {
    types: FormDataEntryValue[];
    sizes: FormDataEntryValue[];
    correction: FormDataEntryValue;
};

export type Point = { x: number; y: number };

export type DataTakeOffer = { name: string; email: string };

export type CurrentPageAndFilter = [number, Filter];

export type AppDispatch = typeof store.dispatch;
