import { Droppable, Draggable } from "@hello-pangea/dnd";
import VariantItem from "../VariantItem/VariantItem";

const VariantList = ({
  product,
  selectedVariantDiscounts,
  setSelectedVariantDiscounts,
  onRemoveVariant,
}) => {
  return (
    <Droppable
      droppableId={`variant-${product?.id}`}
      type={`variant-${product?.id}`}
    >
      {(provided) => (
        <div
          className="flex flex-col gap-3"
          ref={provided.innerRef}
          {...provided.droppableProps}
        >
          {product?.variants?.map((variant, index) => (
            <Draggable
              key={variant.id}
              draggableId={`variant-${variant.id}`}
              index={index}
            >
              {(provided) => (
                <div ref={provided.innerRef} {...provided.draggableProps}>
                  <VariantItem
                    variant={variant}
                    productId={product.id}
                    selectedVariantDiscounts={selectedVariantDiscounts}
                    setSelectedVariantDiscounts={setSelectedVariantDiscounts}
                    onRemoveVariant={onRemoveVariant}
                    totalVariants={product.variants.length}
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
  );
};

export default VariantList;
