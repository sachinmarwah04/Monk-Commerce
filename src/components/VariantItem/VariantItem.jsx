import { useDispatch } from "react-redux";
import {
  removeVariant,
  addVariantDiscount,
} from "../../redux/slice/productSlice";
import dragIcon from "../../assets/Icons/drag.svg";
import closeIcon from "../../assets/Icons/closeIcon.svg";

import { discountOption } from "../../helper";

import { useState } from "react";
import DiscountInput from "../CoreComponents/DiscountInput/DiscountInput";
import Dropdown from "../CoreComponents/Dropdown/Dropdown";

const VariantItem = ({
  variant,
  productId,
  totalVariants,
  dragHandleProps,
}) => {
  const dispatch = useDispatch();
  const [selectedDiscountType, setSelectedDiscountType] = useState("");

  const handleSelectDiscountType = (discountType) => {
    setSelectedDiscountType(discountType);
    dispatch(
      addVariantDiscount({ productId, variantId: variant.id, discountType })
    );
  };

  return (
    <div className="flex items-center gap-5">
      <div className="flex items-center gap-3 pl-6">
        <img
          className="w-2 h-3"
          src={dragIcon}
          alt="drag"
          {...dragHandleProps}
        />
        <button className="border border-black-100/7 flex items-center shadow-shadow justify-between bg-white-50 px-4 py-1.5 w-52 cursor-pointer text-sm rounded-full text-black-100/50 font-normal">
          {variant.title}
        </button>
      </div>

      <DiscountInput />

      <Dropdown
        placeholder="Select"
        options={discountOption}
        selectedOption={selectedDiscountType}
        onSelect={handleSelectDiscountType}
      />

      {totalVariants > 1 && (
        <button
          onClick={() =>
            dispatch(removeVariant({ productId, variantId: variant.id }))
          }
        >
          <img className="w-3 h-3" src={closeIcon} alt="close" />
        </button>
      )}
    </div>
  );
};

export default VariantItem;
