const variantClasses = {
  surface: "bg-[#FFFCF5] dark:bg-[#25251F] border border-[#241B12]/8 dark:border-[#E9E0CD]/8 warm-shadow",
  elevated: "bg-[#FFFEFA] dark:bg-[#2B2B24] border border-[#241B12]/9 dark:border-[#E9E0CD]/10 warm-shadow",
  note: "note-card-ruled border border-[#2F6B52]/22 dark:border-[#C9A24A]/22 warm-shadow",
  outlined: "bg-[#FFFCF5]/70 dark:bg-[#25251F]/70 border border-[#241B12]/12 dark:border-[#E9E0CD]/12"
};
const paddingClasses = {
  none: "",
  sm: "p-4",
  md: "p-6",
  lg: "p-6 sm:p-8"
};
const Card = ({
  variant = "surface",
  hoverable = false,
  padding = "md",
  className = "",
  children,
  ...rest
}) => {
  return <div
    className={`rounded-[24px] ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverable ? "warm-shadow-hover" : ""} ${className}`}
    {...rest}
  >
      {children}
    </div>;
};
export {
  Card
};
