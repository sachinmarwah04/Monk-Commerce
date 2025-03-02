import tick from "../../../assets/Icons/tick.svg";

const Checkbox = ({ checked, onChange, disabled }) => (
  <div
    className={`w-6 h-6 flex items-center justify-center cursor-pointer rounded min-w-4 ${
      checked ? "bg-green-50" : "bg-white-100 border border-black-100/80"
    } transition-colors cursor-pointer`}
    onClick={!disabled ? onChange : undefined}
  >
    {checked && (
      <img loading="lazy" className="w-3 h-3" src={tick} alt="tick" />
    )}
  </div>
);

export default Checkbox;
