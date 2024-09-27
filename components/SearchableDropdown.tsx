import { useEffect, useRef, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

const SearchableDropdown = ({
  options,
  label,
  id,
  selectedVal,
  handleChange,
  filterEnabled = false, // Control filtering
  placeholder = "Select an option", // Default placeholder value
}: any) => {
  const [query, setQuery] = useState<any>("");
  const [isOpen, setIsOpen] = useState<any>(false);

  const inputRef = useRef<any>(null);

  useEffect(() => {
    const toggle = (e: any) => {
      if (e.target !== inputRef.current) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", toggle);
    return () => document.removeEventListener("click", toggle);
  }, []);

  const selectOption = (option: any) => {
    setQuery("");
    handleChange(option[label]);
    setIsOpen(false);
  };

  const getDisplayValue = () => {
    if (query) return query;
    if (selectedVal) return selectedVal;
    return "";
  };

  // Conditionally apply filtering
  const getOptions = () => {
    if (filterEnabled) {
      return options.filter((option: any) =>
        option[label].toLowerCase().includes(query.toLowerCase())
      );
    }
    return options; // If filtering is disabled, return all options
  };

  return (
    <div className="relative w-full md:w-1/2">
      <div className="flex items-center border border-gray-300 rounded px-1 focus-within:ring-2 focus-within:ring-green-500 transition duration-150 ease-in-out">
        {/* Input Field */}
        <input
          placeholder={placeholder} // Use the placeholder prop
          className="flex-grow px-2 py-1 focus:outline-none"
          ref={inputRef}
          type="text"
          value={getDisplayValue()}
          onChange={(e: any) => {
            setQuery(e.target.value);
            handleChange(null);
            setIsOpen(true); // Open dropdown when typing
          }}
          onClick={() => setIsOpen(!isOpen)} // Toggle dropdown on input click
        />
        {/* Dropdown Arrow */}
        <div
          className={`ml-2 cursor-pointer transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          onClick={() => setIsOpen(!isOpen)} // Toggle dropdown on arrow click
        >
          <IoIosArrowDown />
        </div>
      </div>

      {/* Dropdown options */}
      {isOpen && (
        <div className="absolute z-10 w-full mt-1 max-h-48 overflow-y-auto bg-white border border-gray-300 rounded shadow-lg">
          {getOptions().map((option: any, index: any) => (
            <div
              key={`${id}-${index}`}
              className={`cursor-pointer p-2 hover:bg-gray-100 ${
                option[label] === selectedVal ? "bg-green-100" : ""
              }`}
              onClick={() => selectOption(option)}
            >
              {option[label]}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
