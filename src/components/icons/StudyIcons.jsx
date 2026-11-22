const baseSvgProps = (size, className) => ({
  width: size,
  height: size,
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.5,
  strokeLinecap: "round",
  strokeLinejoin: "round",
  className,
  "aria-hidden": true
});
const SkillUpMark = ({ size = 24, className }) => <svg {...baseSvgProps(size, className)}>
    <path d="M4 19.5V6.5C4 5.4 4.9 4.5 6 4.5H11C11.6 4.5 12 4.9 12 5.5V19.5C12 18.7 11.3 18 10.5 18H5.5C4.7 18 4 18.7 4 19.5Z" />
    <path d="M20 19.5V6.5C20 5.4 19.1 4.5 18 4.5H13C12.4 4.5 12 4.9 12 5.5V19.5C12 18.7 12.7 18 13.5 18H18.5C19.3 18 20 18.7 20 19.5Z" />
    <path d="M7.5 9H9.5" />
    <path d="M14.5 9H16.5" />
    <path d="M14.5 12.5H16.5" />
  </svg>;
const HomeIcon = ({ size = 20, className }) => <svg {...baseSvgProps(size, className)}>
    <path d="M3.5 10.5L12 3.5L20.5 10.5" />
    <path d="M5.5 9V19C5.5 19.8 6.2 20.5 7 20.5H17C17.8 20.5 18.5 19.8 18.5 19V9" />
    <path d="M9.5 20.5V14.5C9.5 13.7 10.2 13 11 13H13C13.8 13 14.5 13.7 14.5 14.5V20.5" />
  </svg>;
const BooksIcon = ({ size = 20, className }) => <svg {...baseSvgProps(size, className)}>
    <rect x="4" y="4.5" width="4.5" height="15" rx="1.2" />
    <rect x="8.5" y="6" width="4.5" height="13.5" rx="1.2" />
    <path d="M13 7.2L17.3 5.8L20.8 17.8L16.5 19.2L13 7.2Z" />
    <path d="M5.5 8.5H7" />
    <path d="M10 10H11.5" />
  </svg>;
const HeartIcon = ({ size = 20, className, filled }) => <svg
  {...baseSvgProps(size, className)}
  fill={filled ? "currentColor" : "none"}
>
    <path d="M12 20.2C12 20.2 4 14.8 4 8.9C4 6.2 6.1 4.2 8.7 4.2C10.2 4.2 11.4 4.9 12 5.9C12.6 4.9 13.8 4.2 15.3 4.2C17.9 4.2 20 6.2 20 8.9C20 14.8 12 20.2 12 20.2Z" />
  </svg>;
const ChecklistIcon = ({ size = 20, className }) => <svg {...baseSvgProps(size, className)}>
    <rect x="4.5" y="4.5" width="15" height="15" rx="3" />
    <path d="M8.5 10L10.2 11.7L13.5 8.4" />
    <path d="M8.5 15.2H15.5" />
  </svg>;
const QuillIcon = ({ size = 20, className }) => <svg {...baseSvgProps(size, className)}>
    <path d="M19.5 4.5C15 4.5 10.2 7.2 7.8 12.2L6.2 17.8L11.8 16.2C16.8 13.8 19.5 9 19.5 4.5Z" />
    <path d="M4.5 19.5L13.5 10.5" />
    <path d="M10 16.5H15.5" />
  </svg>;
const SwatchIcon = ({ size = 20, className }) => <svg {...baseSvgProps(size, className)}>
    <path d="M5 4.5H10.5C11.3 4.5 12 5.2 12 6V17C12 18.7 10.7 20 9 20H7C5.3 20 4 18.7 4 17V5.5C4 4.9 4.4 4.5 5 4.5Z" />
    <path d="M12 7.5L15.8 5.3C16.5 4.9 17.4 5.1 17.8 5.8L19.8 9.2C20.2 9.9 20 10.8 19.3 11.2L12 15.5" />
    <path d="M12 15.5H19C19.8 15.5 20.5 16.2 20.5 17V18.5C20.5 19.3 19.8 20 19 20H9" />
    <circle cx="8" cy="16.2" r="1" />
  </svg>;
const SearchIcon = ({ size = 18, className }) => <svg {...baseSvgProps(size, className)}>
    <circle cx="10.8" cy="10.8" r="6.3" />
    <path d="M15.6 15.6L19.8 19.8" />
  </svg>;
const ArrowLeftIcon = ({ size = 18, className }) => <svg {...baseSvgProps(size, className)}>
    <path d="M19 12H5" />
    <path d="M10.5 6.5L5 12L10.5 17.5" />
  </svg>;
const ArrowRightIcon = ({ size = 18, className }) => <svg {...baseSvgProps(size, className)}>
    <path d="M5 12H19" />
    <path d="M13.5 6.5L19 12L13.5 17.5" />
  </svg>;
const PlusIcon = ({ size = 18, className }) => <svg {...baseSvgProps(size, className)}>
    <path d="M12 5V19" />
    <path d="M5 12H19" />
  </svg>;
const PencilIcon = ({ size = 18, className }) => <svg {...baseSvgProps(size, className)}>
    <path d="M12 5H6C4.9 5 4 5.9 4 7V18C4 19.1 4.9 20 6 20H17C18.1 20 19 19.1 19 18V12" />
    <path d="M15.5 4.5L19.5 8.5" />
    <path d="M9 15L10 11L17.5 3.5C18.3 2.7 19.5 2.7 20.3 3.5C21.1 4.3 21.1 5.5 20.3 6.3L12.8 13.8L9 15Z" />
  </svg>;
const TrashIcon = ({ size = 18, className }) => <svg {...baseSvgProps(size, className)}>
    <path d="M4.5 7H19.5" />
    <path d="M9.5 4.5H14.5" />
    <path d="M7 7L7.8 18.2C7.9 19.2 8.7 20 9.7 20H14.3C15.3 20 16.1 19.2 16.2 18.2L17 7" />
    <path d="M10.2 10.5V16" />
    <path d="M13.8 10.5V16" />
  </svg>;
const CheckIcon = ({ size = 16, className }) => <svg {...baseSvgProps(size, className)}>
    <path d="M5 12.5L9.5 17L19 7.5" />
  </svg>;
const SunIcon = ({ size = 18, className }) => <svg {...baseSvgProps(size, className)}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 3.5V5" />
    <path d="M12 19V20.5" />
    <path d="M5.6 5.6L6.7 6.7" />
    <path d="M17.3 17.3L18.4 18.4" />
    <path d="M3.5 12H5" />
    <path d="M19 12H20.5" />
    <path d="M5.6 18.4L6.7 17.3" />
    <path d="M17.3 6.7L18.4 5.6" />
  </svg>;
const MoonIcon = ({ size = 18, className }) => <svg {...baseSvgProps(size, className)}>
    <path d="M19.5 14.5C18.4 15 17.2 15.2 16 15.2C11.5 15.2 7.8 11.5 7.8 7C7.8 5.8 8 4.6 8.5 3.5C5.1 4.6 2.8 7.8 2.8 11.6C2.8 16.3 6.6 20.1 11.3 20.1C15.1 20.1 18.3 17.8 19.5 14.5Z" />
  </svg>;
const ClockIcon = ({ size = 18, className }) => <svg {...baseSvgProps(size, className)}>
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12L15 13.8" />
  </svg>;
const FlameIcon = ({ size = 18, className }) => <svg {...baseSvgProps(size, className)}>
    <path d="M12.3 3.5C12.3 3.5 17.5 7.3 17.5 12.6C17.5 16.3 14.9 19.5 12 19.5C9.1 19.5 6.5 16.6 6.5 13.2C6.5 10.6 8 8.4 9.5 7.2C9.5 9.2 10.7 10.2 11.8 10.2C11.8 7.6 12.3 3.5 12.3 3.5Z" />
  </svg>;
const SendIcon = ({ size = 18, className }) => <svg {...baseSvgProps(size, className)}>
    <path d="M20 4.5L10.5 14" />
    <path d="M20 4.5L14 20L10.5 14L4.5 10.5L20 4.5Z" />
  </svg>;
const CloseIcon = ({ size = 16, className }) => <svg {...baseSvgProps(size, className)}>
    <path d="M6 6L18 18" />
    <path d="M18 6L6 18" />
  </svg>;
const RefreshIcon = ({ size = 16, className }) => <svg {...baseSvgProps(size, className)}>
    <path d="M19.5 12A7.5 7.5 0 1 1 17.3 6.7" />
    <path d="M19.5 4.5V8.5H15.5" />
  </svg>;
const PlayIcon = ({ size = 18, className }) => <svg {...baseSvgProps(size, className)}>
    <path d="M7.5 5.5L18.5 12L7.5 18.5V5.5Z" />
  </svg>;
const PauseIcon = ({ size = 18, className }) => <svg {...baseSvgProps(size, className)}>
    <rect x="6.5" y="5.5" width="3.8" height="13" rx="1.2" />
    <rect x="13.7" y="5.5" width="3.8" height="13" rx="1.2" />
  </svg>;
const SkipIcon = ({ size = 18, className }) => <svg {...baseSvgProps(size, className)}>
    <path d="M5.5 6L13.5 12L5.5 18V6Z" />
    <path d="M17.5 6V18" />
  </svg>;
const EmptyShelfIllustration = ({ className }) => <svg
  viewBox="0 0 220 130"
  fill="none"
  className={className}
  aria-hidden="true"
>
    {
  /* Warm wooden shelf */
}
    <rect
  x="20"
  y="96"
  width="180"
  height="10"
  rx="4"
  stroke="currentColor"
  strokeWidth="1.5"
/>
    <path
  d="M42 106V116M178 106V116"
  stroke="currentColor"
  strokeWidth="1.5"
  strokeLinecap="round"
/>
    {
  /* Left brass bookend */
}
    <path
  d="M48 96V64C48 61.8 49.8 60 52 60H58V96"
  stroke="currentColor"
  strokeWidth="1.5"
  strokeLinecap="round"
  strokeLinejoin="round"
/>
    {
  /* Ghost outline of missing book */
}
    <rect
  x="72"
  y="46"
  width="26"
  height="50"
  rx="3"
  stroke="currentColor"
  strokeWidth="1.5"
  strokeDasharray="4 4"
  opacity="0.45"
/>
    <rect
  x="104"
  y="54"
  width="22"
  height="42"
  rx="3"
  stroke="currentColor"
  strokeWidth="1.5"
  strokeDasharray="4 4"
  opacity="0.35"
/>
    {
  /* Small ceramic cup / plant on right */
}
    <path
  d="M150 76H172L169 96H153L150 76Z"
  stroke="currentColor"
  strokeWidth="1.5"
  strokeLinejoin="round"
/>
    <path
  d="M161 76V58"
  stroke="currentColor"
  strokeWidth="1.5"
  strokeLinecap="round"
/>
    <path
  d="M161 67C154 67 151 61 153 56C158 56 161 61 161 67Z"
  stroke="currentColor"
  strokeWidth="1.5"
  strokeLinejoin="round"
/>
    <path
  d="M161 63C167 63 171 58 169 52C164 53 161 57 161 63Z"
  stroke="currentColor"
  strokeWidth="1.5"
  strokeLinejoin="round"
/>
  </svg>;
const ErrorShelfIllustration = ({ className }) => <svg
  viewBox="0 0 180 120"
  fill="none"
  className={className}
  aria-hidden="true"
>
    <path
  d="M36 92H144"
  stroke="currentColor"
  strokeWidth="1.5"
  strokeLinecap="round"
/>
    <rect
  x="52"
  y="42"
  width="24"
  height="50"
  rx="3"
  stroke="currentColor"
  strokeWidth="1.5"
/>
    <path
  d="M84 48L108 42L120 88L96 94L84 48Z"
  stroke="currentColor"
  strokeWidth="1.5"
  strokeLinejoin="round"
/>
    <circle cx="90" cy="26" r="11" stroke="currentColor" strokeWidth="1.5" />
    <path d="M90 21V27" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="90" cy="31" r="0.8" fill="currentColor" />
  </svg>;

export {
  ArrowLeftIcon,
  ArrowRightIcon,
  BooksIcon,
  CheckIcon,
  ChecklistIcon,
  ClockIcon,
  CloseIcon,
  EmptyShelfIllustration,
  ErrorShelfIllustration,
  FlameIcon,
  HeartIcon,
  HomeIcon,
  MoonIcon,
  PencilIcon,
  PauseIcon,
  PlayIcon,
  PlusIcon,
  QuillIcon,
  RefreshIcon,
  SearchIcon,
  SendIcon,
  SkillUpMark,
  SkipIcon,
  SunIcon,
  SwatchIcon,
  TrashIcon
};
