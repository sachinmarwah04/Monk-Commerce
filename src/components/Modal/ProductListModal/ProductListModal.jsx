import React, { useState, useEffect, useRef, useCallback } from "react";
import Modal from "..";
import searchIcon from "../../../assets/Icons/search.svg";
import Checkbox from "../../CoreComponents/Checkbox/Checkbox";
import axios from "axios";
import Spinner from "../../CoreComponents/Spinner";

const ProductListModal = ({
  isOpen,
  onClose,
  onSelect,
  preSelectedProducts = [],
  replacingProductId,
}) => {
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedVariants, setSelectedVariants] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [localSelectedProducts, setLocalSelectedProducts] = useState([]);
  const observer = useRef();
  const loadingRef = useRef(false);
  const hasMoreRef = useRef(true);

  useEffect(() => {
    if (isOpen) {
      setSelectedProducts(preSelectedProducts);
      setSelectedVariants(preSelectedProducts.flatMap((p) => p.variants || []));
    }
  }, [isOpen, preSelectedProducts]);

  const fetchProducts = useCallback(async (query = "", currentPage = 0) => {
    if (!hasMoreRef.current || loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);

    try {
      const response = await axios.get(
        "https://stageapi.monkcommerce.app/task/products/search",
        {
          params: { search: query, page: currentPage, limit: 10 },
          headers: { "x-api-key": "72njgfa948d9aS7gs5" },
        }
      );

      const newProducts = response.data || [];

      setProducts((prev) => {
        const uniqueProducts = [
          ...prev,
          ...newProducts.filter(
            (p) => !prev.some((prevP) => prevP.id === p.id)
          ),
        ];
        return currentPage === 0 ? newProducts : uniqueProducts;
      });

      hasMoreRef.current = newProducts.length > 0;
      setHasMore(newProducts.length > 0);
      setPage(currentPage + 1);
    } catch (err) {
      console.error(err);
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isOpen) {
      setProducts([]);
      setPage(0);
      setHasMore(true);
      fetchProducts(searchQuery, 0);
    }
  }, [isOpen, searchQuery, fetchProducts]);

  const lastProductRef = useCallback(
    (node) => {
      if (loading || !hasMore) return;

      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          fetchProducts(searchQuery, page);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, fetchProducts, searchQuery, page]
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
    setHasMore(true);
  };

  const toggleProductSelection = (product, event) => {
    event.stopPropagation();

    setSelectedProducts((prevSelectedProducts) => {
      const updatedProducts = prevSelectedProducts.filter(
        (p) => p.id !== replacingProductId
      );

      let updatedVariants = selectedVariants.filter(
        (v) =>
          !prevSelectedProducts
            .find((p) => p.id === replacingProductId)
            ?.variants.some((pv) => pv.id === v.id)
      );

      const isProductSelected = prevSelectedProducts.some(
        (p) => p.id === product.id
      );

      if (isProductSelected) {
        updatedVariants = updatedVariants.filter(
          (v) => !product.variants.some((pv) => pv.id === v.id)
        );
        setSelectedVariants(updatedVariants);
        return updatedProducts.filter((p) => p.id !== product.id);
      } else {
        updatedVariants = [...updatedVariants, ...product.variants];
        setSelectedVariants(updatedVariants);
        return [...updatedProducts, product];
      }
    });

    setLocalSelectedProducts((prevLocalSelected) =>
      prevLocalSelected.some((p) => p.id === product.id)
        ? prevLocalSelected.filter((p) => p.id !== product.id)
        : [...prevLocalSelected, product]
    );
  };

  const toggleVariantSelection = (product, variant, event) => {
    event.stopPropagation();

    setSelectedVariants((prevSelectedVariants) => {
      const isVariantSelected = prevSelectedVariants.some(
        (v) => v.id === variant.id
      );

      let updatedVariants;
      if (isVariantSelected) {
        updatedVariants = prevSelectedVariants.filter(
          (v) => v.id !== variant.id
        );
      } else {
        updatedVariants = [...prevSelectedVariants, variant];
      }

      setSelectedProducts((prevSelectedProducts) => {
        const isProductSelected = prevSelectedProducts.some(
          (p) => p.id === product.id
        );
        if (
          !isProductSelected &&
          updatedVariants.some((v) => product.variants.includes(v))
        ) {
          return [...prevSelectedProducts, product];
        }

        if (updatedVariants.every((v) => !product.variants.includes(v))) {
          return prevSelectedProducts.filter((p) => p.id !== product.id);
        }
        return prevSelectedProducts;
      });

      return updatedVariants;
    });
  };

  const handleAddProducts = () => {
    let updatedProducts = [...selectedProducts];

    const uniqueProducts = updatedProducts.filter(
      (product, index, self) =>
        index === self.findIndex((p) => p.id === product.id)
    );

    onSelect(uniqueProducts, selectedVariants);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="p-3 px-5 border-b border-black-100/10">
        <h1 className="text-black-100/90 font-medium text-lg">
          Select Products
        </h1>
      </div>

      <div
        onClick={(e) => e.stopPropagation()}
        className="border m-3 relative border-black-100/7 py-1.5 text-black-100/50 font-normal pl-12"
      >
        <img
          className="w-4 h-4 absolute left-4 top-2.5"
          src={searchIcon}
          alt="search"
        />
        <input
          className="border-none outline-none w-full"
          placeholder="Search Product"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="h-[24rem] overflow-auto">
        {" "}
        {products?.map((product, index) => (
          <div
            ref={index === products.length - 1 ? lastProductRef : null}
            key={product?.id}
          >
            <div className="flex items-center gap-4 p-3.5 px-5 border-t border-b border-black-100/10">
              <Checkbox
                checked={selectedProducts.some((p) => p.id === product.id)}
                onChange={(e) => toggleProductSelection(product, e)}
              />
              <img
                className="w-9 h-9 rounded"
                src={product.image.src}
                alt={product.title}
              />
              <p className="text-black-100/90 text-base font-normal">
                {product.title}
              </p>
            </div>

            {product.variants.map((variant) => (
              <div
                key={`${product.id}-${variant.id}`}
                className="items-center p-3.5 px-5 pl-16 border-b border-black-100/10"
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center gap-6">
                    <Checkbox
                      checked={selectedVariants.some(
                        (v) => v.id === variant.id
                      )}
                      onChange={(e) =>
                        toggleVariantSelection(product, variant, e)
                      }
                    />
                    <p className="text-black-100/90 text-base font-normal">
                      {variant.title}
                    </p>
                  </div>

                  <div className="flex items-center gap-6">
                    <p className="text-black-100/90 text-base font-normal">
                      {variant.available} available
                    </p>
                    <p className="text-black-100/90 text-base font-normal">
                      ${variant.price}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ))}
        {loading && (
          <div className="h-full flex items-center justify-center">
            <Spinner />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between p-4 py-4">
        <p className="text-black-100/90 font-normal text-base">
          {localSelectedProducts.length} product(s) selected
        </p>
        <div className="flex items-center gap-2.5">
          <button
            className="bg-white-50 rounded text-sm text-black-100/60 font-semibold px-8 p-1 border border-black-100/40"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            onClick={handleAddProducts}
            className="bg-green-50 text-white-50 text-sm font-semibold rounded px-6 p-1"
          >
            Add
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default ProductListModal;
