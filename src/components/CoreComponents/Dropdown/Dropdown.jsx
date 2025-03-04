import { useEffect, useRef, useState } from "react";
import downArrow from "../../../assets/Icons/arrow.svg";

const Dropdown = ({
  options,
  onSelect,
  selectedOption,
  placeholder,
  custom,
}) => {
  const dropdownRef = useRef();
  const [showOptions, setShowOptions] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option) => {
    onSelect(option);
    setShowOptions(false);
  };

  const handleToggleDropdown = () => {
    setShowOptions(!showOptions);
  };

  return (
    <div ref={dropdownRef} className="relative w-auto">
      <button
        onClick={handleToggleDropdown}
        className={` ${custom} border border-black-100/7 items-center flex justify-between shadow-shadow bg-white-50 px-2 py-1.5 w-24 cursor-pointer text-sm text-black-100/50 font-normal`}
      >
        <p
          className={`font-normal ${
            !selectedOption ? "text-black-100" : "text-black-100"
          }  text-sm`}
        >
          {selectedOption ? selectedOption : placeholder}
        </p>

        <img loading="lazy" className="w-5 h-5" src={downArrow} />
      </button>

      {showOptions && (
        <div className="dropdown-menu z-50">
          <div
            className={` bg-white-50 z-50 absolute top-11 h-auto overflow-auto w-full rounded-md shadow-shadow`}
          >
            <div
              className={`${
                options?.length > 4 ? "h-40" : "h-full"
              } overflow-auto`}
            >
              <div className="flex flex-col">
                {options?.map((option, index) => {
                  return (
                    <p
                      key={index}
                      className="cursor-pointer text-black-100 font-normal text-xs p-2 hover:bg-gray-100 hover:transition-all hover:ease-in-out hover:duration-200"
                      onClick={() => handleOptionClick(option)}
                    >
                      {option}
                    </p>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
