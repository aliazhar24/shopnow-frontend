import { createPortal } from "react-dom";
import { useEffect } from "react";

const Modal = ({ children, onClose }) => {

     useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose} // click outside closes
    >
      <div
        className="relative bg-white rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()} // click inside does nothing
      >
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        {children}
      </div>
    </div>,
    document.body
  );
};

export default Modal;
