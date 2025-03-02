import crossIcon from "../../assets/Icons/close.svg";

const Modal = ({ isOpen, children, onClose }) => {
  const modalClasses = isOpen
    ? "visible z-50 bg-black-100/40"
    : "invisible z-50";
  const modalAnimation = isOpen
    ? "scale-100 opacity-100"
    : "scale-125 opacity-0";

  return (
    <div
      onClick={onClose}
      className={`fixed inset-0 overflow-hidden transition-opacity ${modalClasses}`}
    >
      <div className="fixed inset-0 w-screen overflow-y-auto">
        <div className="flex items-end justify-center min-h-full p-4 text-center sm:items-center sm:p-0">
          <div
            className={`relative overflow-hidden text-left transition-all w-full max-w-2xl duration-500  ease-in-out transform  bg-white-50 rounded shadow-xl  ${modalAnimation}`}
          >
            <div className="bg-white-100 w-full relative">
              <div className="flex justify-end items-center w-full  px-4">
                <button
                  onClick={onClose}
                  className="cursor-pointer text-black-100 text-lg absolute top-[17px]"
                >
                  <img
                    loading="lazy"
                    className="w-4 h-4 cursor-pointer"
                    alt="closeIcon"
                    src={crossIcon}
                  />
                </button>
              </div>

              <div className="h-full">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
