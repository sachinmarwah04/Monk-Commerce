import { useDispatch, useSelector } from "react-redux";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import {
  addEmptyProduct,
  removeProduct,
  setProductDiscount,
} from "../../redux/slice/productSlice";
import dragIcon from "../../assets/Icons/drag.svg";
import arrowIcon from "../../assets/Icons/arrowBlue.svg";
import removeIcon from "../../assets/Icons/closeIcon.svg";
import editIcon from "../../assets/Icons/edit.svg";
import { useState } from "react";
import { discountOption, truncateText } from "../../helper";
import VariantList from "../VariantList/VariantList";

const ProductList = ({ onOpenModal }) => {
  const dispatch = useDispatch();
  const selectedProducts = useSelector(
    (state) => state?.products?.selectedProducts || []
  );

  const [showVariants, setShowVariants] = useState(false);
  const [selectedDiscountType, setSelectedDiscountType] = useState("");
  const [isDiscountVisible, setIsDiscountVisible] = useState(false);

  const handleSelectDiscountType = (discountType, product) => {
    setSelectedDiscountType(discountType);
    dispatch(
      setProductDiscount({ productId: product.id, discount: discountType })
    );
  };

  return (
    <>
      <Droppable droppableId="product" type="product">
        {(provided) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className="flex flex-col gap-10"
          >
            {selectedProducts.length > 0 &&
              selectedProducts.map((product, index) => (
                <Draggable
                  key={product.id}
                  draggableId={product.id.toString()}
                  index={index}
                >
                  {(provided) => (
                    <div ref={provided.innerRef} {...provided.draggableProps}>
                      <div className="flex flex-col gap-8 border-b pb-6">
                        <div className="flex flex-col gap-3">
                          {" "}
                          <div className="flex items-center gap-5">
                            <img
                              className="w-2 h-3"
                              src={dragIcon}
                              alt="drag"
                              {...provided.dragHandleProps}
                            />

                            <div className="relative border border-black-100/7  flex items-center shadow-shadow justify-between bg-white-50 py-2 px-2 w-52 cursor-pointer text-sm text-black-100/50 font-normal">
                              {" "}
                              <button
                                className="absolute right-0.5 top-0.5 hover:bg-gray-200 p-2"
                                onClick={() => onOpenModal(product?.id || null)}
                              >
                                <img src={editIcon} alt="edit" />
                              </button>
                              {truncateText(product?.title, 20) ||
                                "Select Product"}
                            </div>

                            {!isDiscountVisible ? (
                              <button
                                className="text-sm font-semibold text-white-50 bg-green-50 rounded px-5 py-2"
                                onClick={() => setIsDiscountVisible(true)}
                              >
                                Add Discount
                              </button>
                            ) : (
                              <div className="flex items-center gap-2">
                                <DiscountInput />
                                <Dropdown
                                  placeholder="Select"
                                  options={discountOption}
                                  selectedOption={selectedDiscountType}
                                  onSelect={handleSelectDiscountType}
                                />
                                <button
                                  onClick={() =>
                                    dispatch(removeProduct(product.id))
                                  }
                                >
                                  <img
                                    className="w-3 h-3"
                                    src={removeIcon}
                                    alt="close"
                                  />
                                </button>
                              </div>
                            )}
                          </div>
                          {product?.variants?.length > 1 ? (
                            <>
                              <button
                                className="text-blue-50 text-right font-normal flex items-center gap-1 justify-end underline text-sm cursor-pointer"
                                onClick={() => setShowVariants((prev) => !prev)}
                              >
                                {showVariants
                                  ? "Hide Variants"
                                  : "Show Variants"}
                                <img
                                  src={arrowIcon}
                                  className={`w-2 h-2 transition-transform ${
                                    showVariants ? "" : "rotate-180"
                                  }`}
                                />
                              </button>
                              {showVariants && (
                                <VariantList product={product} />
                              )}
                            </>
                          ) : (
                            <VariantList product={product} />
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </Draggable>
              ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <div className="flex justify-end w-full">
        <button
          className="text-green-50 border-2 border-green-50 rounded text-sm font-semibold py-3 w-36"
          onClick={() => dispatch(addEmptyProduct())}
        >
          Add Product
        </button>
      </div>
    </>
  );
};

export default ProductList;
