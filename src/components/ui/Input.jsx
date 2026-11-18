import React from "react";
const Input = ({
  label,
  error,
  leftIcon,
  rightSlot,
  id,
  className = "",
  ...rest
}) => {
  const generatedId = React.useId();
  const inputId = id || generatedId;
  const errorId = `${inputId}-error`;
  const describedBy = [rest["aria-describedby"], error ? errorId : null].filter(Boolean).join(" ") || undefined;
  return <div className="flex flex-col gap-1.5 w-full">
      {label && <label
    htmlFor={inputId}
    className="text-sm font-medium text-[#241B12] dark:text-[#E9E0CD]"
  >
          {label}
        </label>}
      <div className="relative flex items-center">
        {leftIcon && <span className="absolute left-4 text-[#5C4B3A] dark:text-[#BDAE97] pointer-events-none flex items-center">
            {leftIcon}
          </span>}
        <input
    id={inputId}
    aria-invalid={error ? true : undefined}
    aria-describedby={describedBy}
    className={`w-full min-h-[44px] rounded-2xl bg-[#FFFCF5] dark:bg-[#25251F] border text-sm text-[#241B12] dark:text-[#E9E0CD] placeholder:text-[#5C4B3A]/80 dark:placeholder:text-[#BDAE97]/70 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2F6B52]/70 dark:focus:ring-[#C9A24A]/70 ${error ? "border-[#B8453A] dark:border-[#E6867A]" : "border-[#241B12]/14 dark:border-[#E9E0CD]/14 focus:border-[#2F6B52] dark:focus:border-[#C9A24A]"} ${leftIcon ? "pl-11" : "pl-4"} ${rightSlot ? "pr-11" : "pr-4"} py-2.5 ${className}`}
    {...rest}
  />
        {rightSlot && <span className="absolute right-2.5 flex items-center">{rightSlot}</span>}
      </div>
      {error && <p id={errorId} className="text-xs font-medium text-[#9F352B] dark:text-[#E6867A]" role="alert">
          {error}
        </p>}
    </div>;
};
const Textarea = ({
  label,
  error,
  id,
  className = "",
  ...rest
}) => {
  const generatedId = React.useId();
  const textareaId = id || generatedId;
  const errorId = `${textareaId}-error`;
  const describedBy = [rest["aria-describedby"], error ? errorId : null].filter(Boolean).join(" ") || undefined;
  return <div className="flex flex-col gap-1.5 w-full">
      {label && <label
    htmlFor={textareaId}
    className="text-sm font-medium text-[#241B12] dark:text-[#E9E0CD]"
  >
          {label}
        </label>}
      <textarea
    id={textareaId}
    aria-invalid={error ? true : undefined}
    aria-describedby={describedBy}
    className={`w-full rounded-2xl bg-[#FFFCF5] dark:bg-[#25251F] border text-[15px] leading-relaxed text-[#241B12] dark:text-[#E9E0CD] placeholder:text-[#5C4B3A]/80 dark:placeholder:text-[#BDAE97]/70 p-4 transition-colors focus:outline-none focus:ring-2 focus:ring-[#2F6B52]/70 dark:focus:ring-[#C9A24A]/70 resize-y ${error ? "border-[#B8453A] dark:border-[#E6867A]" : "border-[#241B12]/14 dark:border-[#E9E0CD]/14 focus:border-[#2F6B52] dark:focus:border-[#C9A24A]"} ${className}`}
    {...rest}
  />
      {error && <p id={errorId} className="text-xs font-medium text-[#9F352B] dark:text-[#E6867A]" role="alert">
          {error}
        </p>}
    </div>;
};
export {
  Input,
  Textarea
};
