import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "whatsapp" | "outlineLight";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 ease-out select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";

const variants: Record<Variant, string> = {
  primary:
    "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 hover:-translate-y-0.5 hover:from-blue-500 hover:to-blue-600 active:translate-y-0 active:shadow-md",
  secondary:
    "bg-white text-blue-600 border-2 border-blue-600 hover:bg-blue-50 hover:-translate-y-0.5 active:translate-y-0",
  ghost:
    "bg-transparent text-slate-700 hover:bg-slate-100 hover:-translate-y-0.5 active:translate-y-0",
  whatsapp:
    "bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 hover:brightness-105 hover:-translate-y-0.5 active:translate-y-0",
  outlineLight:
    "border border-white/30 text-white bg-white/5 backdrop-blur hover:bg-white/15 hover:-translate-y-0.5 active:translate-y-0",
};

const sizes: Record<Size, string> = {
  sm: "px-4 py-2 text-sm",
  md: "px-6 py-3 text-base",
  lg: "px-8 py-4 text-lg",
};

type CommonProps = {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  className?: string;
  children: ReactNode;
};

type ButtonAsButton = CommonProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    href?: undefined;
  };

type ButtonAsLink = CommonProps & {
  href: string;
  target?: string;
  rel?: string;
  onClick?: () => void;
};

type ButtonProps = ButtonAsButton | ButtonAsLink;

export function Button(props: ButtonProps) {
  const {
    variant = "primary",
    size = "md",
    fullWidth,
    icon,
    iconPosition = "left",
    className,
    children,
  } = props;

  const classes = cn(
    base,
    variants[variant],
    sizes[size],
    fullWidth && "w-full",
    className
  );

  const content = (
    <>
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </>
  );

  if ("href" in props && props.href) {
    const isExternal =
      props.href.startsWith("http") || props.href.startsWith("https://wa.me");
    return (
      <Link
        href={props.href}
        target={props.target ?? (isExternal ? "_blank" : undefined)}
        rel={props.rel ?? (isExternal ? "noopener noreferrer" : undefined)}
        onClick={props.onClick}
        className={classes}
      >
        {content}
      </Link>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- se extraen para excluirlas del <button> nativo
  const { variant: _variant, size: _size, fullWidth: _fullWidth, icon: _icon, iconPosition: _iconPosition, className: _className, children: _children, ...nativeButtonProps } =
    props as ButtonAsButton;

  return (
    <button {...nativeButtonProps} className={classes}>
      {content}
    </button>
  );
}
