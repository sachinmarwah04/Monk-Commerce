import { useDispatch, useSelector } from "react-redux";
import { Droppable, Draggable } from "@hello-pangea/dnd";
import ProductItem from "../ProductItem/ProductItem";
import { addEmptyProduct } from "../../redux/slice/productSlice";

const ProductList = ({ onOpenModal }) => {
  const dispatch = useDispatch();
  const selectedProducts = useSelector(
    (state) => state?.products?.selectedProducts || []
  );

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
                      <ProductItem
                        product={product}
                        onOpenModal={onOpenModal}
                        dragHandleProps={provided.dragHandleProps}
                      />
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
