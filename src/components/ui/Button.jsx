// ✅ Correct Button.jsx
import React from "react";
import classNames from "classnames";

const baseStyles = "rounded-xl px-4 py-2 font-medium transition duration-200 focus:outline-none";

const variants = {
  primary: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-gray-200 text-gray-800 hover:bg-gray-300",
  danger: "bg-red-500 text-white hover:bg-red-600",
  ghost: "bg-transparent text-gray-700 hover:bg-gray-100",
};

const sizes = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
};

// ✅ Fix: declare function first
const Button = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  className = "",
  type = "button",
  ...props
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={classNames(baseStyles, variants[variant], sizes[size], className)}
      {...props}
    >
      {children}
    </button>
  );
};

// ✅ Then export after
export default Button;
