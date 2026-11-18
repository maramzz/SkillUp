const variantStyles = {
  primary: "bg-[#245A43] hover:bg-[#1E4D39] text-[#FFFDF9] dark:bg-[#C9A24A] dark:hover:bg-[#D8B354] dark:text-[#1B150F] shadow-[0_8px_18px_-10px_rgba(36,90,67,0.75)] dark:shadow-[0_8px_18px_-10px_rgba(201,162,74,0.55)]",
  secondary: "bg-[#E9E2D6] hover:bg-[#DDD4C5] text-[#241B12] border border-[#241B12]/6 dark:bg-[#303129] dark:hover:bg-[#3A3A31] dark:text-[#E9E0CD] dark:border-[#E9E0CD]/8",
  outline: "bg-transparent border border-[#241B12]/18 hover:border-[#2F6B52] hover:bg-[#2F6B52]/8 text-[#241B12] dark:border-[#E9E0CD]/18 dark:hover:border-[#C9A24A] dark:hover:bg-[#C9A24A]/12 dark:text-[#E9E0CD]",
  ghost: "bg-transparent hover:bg-[#241B12]/6 text-[#5C4B3A] hover:text-[#241B12] dark:text-[#BDAE97] dark:hover:text-[#E9E0CD] dark:hover:bg-[#E9E0CD]/8",
  danger: "bg-transparent hover:bg-[#B8453A]/10 text-[#9F352B] dark:text-[#E6867A] dark:hover:bg-[#E6867A]/12"
};
const sizeStyles = {
  sm: "min-h-[40px] px-3.5 py-2 text-[13px] rounded-xl gap-1.5",
  md: "min-h-[44px] px-5 py-2.5 text-sm rounded-2xl gap-2",
  lg: "min-h-[48px] px-6 py-3 text-[15px] rounded-2xl gap-2.5"
};
const Button = ({
  variant = "primary",
  size = "md",
  isLoading = false,
  leftIcon,
  rightIcon,
  children,
  disabled,
  className = "",
  type = "button",
  ...rest
}) => {
  const isDisabled = disabled || isLoading;
  return <button
    type={type}
    disabled={isDisabled}
    className={`inline-flex items-center justify-center font-medium whitespace-nowrap shrink-0 transition-all duration-150 ease-out cursor-pointer select-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#2F6B52] focus-visible:ring-offset-2 focus-visible:ring-offset-[#E9E0CD] dark:focus-visible:ring-[#C9A24A] dark:focus-visible:ring-offset-[#1B150F] disabled:opacity-45 disabled:cursor-not-allowed active:scale-[0.98] ${variantStyles[variant]} ${sizeStyles[size]} ${className}`}
    {...rest}
  >
      {leftIcon && <span className="shrink-0">{leftIcon}</span>}
      <span>{children}</span>
      {rightIcon && <span className="shrink-0">{rightIcon}</span>}
    </button>;
};
export {
  Button
};
