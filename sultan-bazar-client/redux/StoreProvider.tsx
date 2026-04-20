"use client";

import { useEffect } from "react";
import { store } from "./store";
import { Provider } from "react-redux";
import { loadLocalCart } from "./features/localCartSlice";

function CartHydrator({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        store.dispatch(loadLocalCart());
    }, []);
    return <>{children}</>;
}

export default function StoreProvider({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <Provider store={store}>
            <CartHydrator>{children}</CartHydrator>
        </Provider>
    );
}
