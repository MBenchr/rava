"use client";

import {
  createContext,
  type PropsWithChildren,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  getFinishPriceCents,
  normalizeFinishForProduct,
  normalizeFinishId,
  normalizeProductId,
  type FinishId,
  type ProductId,
} from "@/lib/isandre/catalog";

export type CartLine = {
  productId: ProductId;
  finishId: FinishId;
  quantity: number;
};

type CartContextValue = {
  items: CartLine[];
  totalItems: number;
  subtotalCents: number;
  isCartOpen: boolean;
  addItem: (item: Omit<CartLine, "finishId"> & { finishId: FinishId }, replace?: boolean) => void;
  removeItem: (productId: ProductId, finishId: FinishId) => void;
  replaceItem: (
    productId: ProductId,
    finishId: FinishId,
    nextProductId: ProductId,
    nextFinishId: FinishId,
  ) => void;
  setQuantity: (productId: ProductId, finishId: FinishId, quantity: number) => void;
  clearCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  setCartOpen: (open: boolean) => void;
};

const STORAGE_KEY = "isandre-bag-v1";

const CartContext = createContext<CartContextValue | null>(null);

function sanitizeQuantity(quantity: number) {
  return Math.min(12, Math.max(1, Math.floor(quantity)));
}

function makeLineKey(productId: ProductId, finishId: FinishId) {
  return `${productId}:${finishId}`;
}

function sanitizeItems(value: unknown): CartLine[] {
  if (!Array.isArray(value)) return [];

  return value.flatMap((item) => {
    if (!item || typeof item !== "object") return [];

    const candidate = item as {
      productId?: unknown;
      finishId?: unknown;
      quantity?: unknown;
    };
    const productId =
      typeof candidate.productId === "string"
        ? normalizeProductId(candidate.productId)
        : null;
    const finishId =
      typeof candidate.finishId === "string"
        ? normalizeFinishId(candidate.finishId)
        : null;

    if (!productId || !finishId || typeof candidate.quantity !== "number") {
      return [];
    }

    return [{
      productId,
      finishId: normalizeFinishForProduct(productId, finishId),
      quantity: sanitizeQuantity(candidate.quantity),
    }];
  });
}

export function CartProvider({ children }: PropsWithChildren) {
  const [items, setItems] = useState<CartLine[]>([]);
  const [hydrated, setHydrated] = useState(false);
  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;

    window.queueMicrotask(() => {
      if (cancelled) {
        return;
      }

      try {
        const saved = window.localStorage.getItem(STORAGE_KEY);

        if (!saved) {
          return;
        }

        const parsed: unknown = JSON.parse(saved);

        if (Array.isArray(parsed)) {
          const normalized = sanitizeItems(parsed);
          setItems(normalized);
          window.localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        }
      } catch {
        window.localStorage.removeItem(STORAGE_KEY);
      } finally {
        if (!cancelled) {
          setHydrated(true);
        }
      }
    });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const value = useMemo<CartContextValue>(() => {
    const subtotalCents = items.reduce((sum, item) => {
      const unitAmount = getFinishPriceCents(item.productId, item.finishId) ?? 0;

      return sum + unitAmount * item.quantity;
    }, 0);
    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

    return {
      items,
      totalItems,
      subtotalCents,
      isCartOpen,
      addItem(item, replace = false) {
        setItems((current) => {
          const finishId = normalizeFinishForProduct(item.productId, item.finishId);
          const quantity = sanitizeQuantity(item.quantity);
          const itemKey = makeLineKey(item.productId, finishId);
          const existing = current.find((entry) => makeLineKey(entry.productId, entry.finishId) === itemKey);

          if (!existing) {
            return sanitizeItems([...current, { productId: item.productId, finishId, quantity }]);
          }

          return sanitizeItems(
            current.map((entry) => {
              if (makeLineKey(entry.productId, entry.finishId) !== itemKey) {
                return entry;
              }

              return {
                ...entry,
                quantity: replace ? quantity : sanitizeQuantity(entry.quantity + quantity),
              };
            }),
          );
        });
      },
      removeItem(productId, finishId) {
        setItems((current) =>
          current.filter((item) => makeLineKey(item.productId, item.finishId) !== makeLineKey(productId, finishId)),
        );
      },
      replaceItem(productId, finishId, nextProductId, nextFinishId) {
        setItems((current) => {
          const currentKey = makeLineKey(productId, finishId);
          const normalizedNextFinish = normalizeFinishForProduct(nextProductId, nextFinishId);
          const nextKey = makeLineKey(nextProductId, normalizedNextFinish);
          const source = current.find((item) => makeLineKey(item.productId, item.finishId) === currentKey);

          if (!source || currentKey === nextKey) {
            return current;
          }

          const remaining = current.filter(
            (item) => makeLineKey(item.productId, item.finishId) !== currentKey,
          );
          const existing = remaining.find(
            (item) => makeLineKey(item.productId, item.finishId) === nextKey,
          );

          if (existing) {
            return sanitizeItems(
              remaining.map((item) =>
                makeLineKey(item.productId, item.finishId) === nextKey
                  ? { ...item, quantity: item.quantity + source.quantity }
                  : item,
              ),
            );
          }

          return sanitizeItems([
            ...remaining,
            {
              productId: nextProductId,
              finishId: normalizedNextFinish,
              quantity: source.quantity,
            },
          ]);
        });
      },
      setQuantity(productId, finishId, quantity) {
        setItems((current) =>
          sanitizeItems(
            current.map((item) => {
              if (makeLineKey(item.productId, item.finishId) !== makeLineKey(productId, finishId)) {
                return item;
              }

              return {
                ...item,
                quantity: sanitizeQuantity(quantity),
              };
            }),
          ),
        );
      },
      clearCart() {
        setItems([]);
      },
      openCart() {
        setCartOpen(true);
      },
      closeCart() {
        setCartOpen(false);
      },
      toggleCart() {
        setCartOpen((current) => !current);
      },
      setCartOpen(open) {
        setCartOpen(open);
      },
    };
  }, [isCartOpen, items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error("useCart doit être utilisé à l’intérieur de CartProvider.");
  }

  return context;
}
