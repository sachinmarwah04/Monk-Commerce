import { useDispatch, useSelector } from "react-redux";
import { useCallback, useState } from "react";
import { DragDropContext } from "@hello-pangea/dnd";
import {
  openModal,
  closeModal,
  selectIsModalOpen,
} from "./redux/slice/modalSlice";
import {
  reorderProducts,
  reorderVariants,
  replaceProduct,
} from "./redux/slice/productSlice";
import { PRODUCT_LIST_MODAL } from "./constant";
import ProductListModal from "./components/Modal/ProductListModal/ProductListModal";
import ProductList from "./components/ProductList/ProductList";

function App() {
  const dispatch = useDispatch();

  const selectedProducts = useSelector(
    (state) => state?.products?.selectedProducts || []
  );

  const isOpenProductListModal = useSelector(
    selectIsModalOpen(PRODUCT_LIST_MODAL)
  );

  const [replacingProductId, setReplacingProductId] = useState(null);

  const handleOpenProductListModal = useCallback(
    (productId = null) => {
      setReplacingProductId(productId);
      dispatch(openModal({ modalName: PRODUCT_LIST_MODAL }));
    },
    [dispatch]
  );

  const handleCloseProductListModal = useCallback(() => {
    setReplacingProductId(null);
    dispatch(closeModal({ modalName: PRODUCT_LIST_MODAL }));
  }, [dispatch]);

  const handleSelectProducts = (newProducts) => {
    dispatch(replaceProduct({ newProducts, replacingProductId }));
    setReplacingProductId(null);
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const { source, destination, type } = result;

    if (type === "product") {
      dispatch(
        reorderProducts({
          sourceIndex: source.index,
          destinationIndex: destination.index,
        })
      );
    } else if (type.startsWith("variant-")) {
      const productId = type.split("-")[1];
      dispatch(
        reorderVariants({
          productId,
          sourceIndex: source.index,
          destinationIndex: destination.index,
        })
      );
    }
  };

  return (
    <div className="flex justify-center items-center h-screen w-full">
      <div className="flex flex-col gap-8">
        <h1 className="text-black-50 text-base font-semibold">Add Products</h1>

        <DragDropContext onDragEnd={onDragEnd}>
          <ProductList onOpenModal={handleOpenProductListModal} />
        </DragDropContext>
      </div>

      <ProductListModal
        isOpen={isOpenProductListModal}
        onClose={handleCloseProductListModal}
        onSelect={handleSelectProducts}
        preSelectedProducts={selectedProducts}
        replacingProductId={replacingProductId}
      />
    </div>
  );
}

export default App;
