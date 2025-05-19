import { createSelector } from 'reselect';

const productListSelector = (state) => state?.product?.product || [];

export const specialProductsSelector = createSelector(
  [productListSelector],
  (products) => products.filter((p) => p?.tags?.includes("Special")).slice(0, 4)
);

export const popularProductsSelector = createSelector(
  [productListSelector],
  (products) => products.filter((p) => p?.tags?.includes("Popular")).slice(0, 4)
);
