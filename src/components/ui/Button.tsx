import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost" | "whatsapp" | "outlineLight" | "light" | "dark";
type Size = "sm" | "md" | "lg";

const base =
  "group/btn relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-full font-semibold transition-all duration-300 ease-out select-none whitespace-nowrap focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 disabled:opacity-45 disabled:pointer-events-none active:scale-[0.97]";

// El botón primario usa texto oscuro sobre naranja: contraste 5.6:1 (WCAG AA).
const variants: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-ink-950 shadow-[0_8px_30px_-8px_rgb(241_90_35/0.65)] hover:bg-brand-400 hover:shadow-[0_12px_40px_-8px_rgb(241_90_35/0.8)] hover:-translate-y-0.5",
  secondary:
    "border border-ink-600 bg-white/[0.03] text-heading backdrop-blur hover:border-brand-500/70 hover:bg-brand-500/10 hover:text-white hover:-translate-y-0.5",
  ghost: "bg-transparent text-body-strong hover:bg-white/5 hover:text-white",
  whatsapp:
    "bg-whatsapp text-ink-950 shadow-[0_8px_30px_-10px_rgb(37_211_102/0.6)] hover:brightness-110 hover:-translate-y-0.5",
  outlineLight:
    "border border-white/25 bg-white/5 text-white backdrop-blur hover:bg-white/15 hover:-translate-y-0.5",
  light: "bg-white text-ink-950 hover:bg-brand-50 hover:-translate-y-0.5",
  dark: "bg-ink-950 text-white hover:bg-ink-800 hover:-translate-y-0.5",
};

const sizes: Record<Size, string> = {
  sm: "h-10 px-4 text-sm",
  md: "h-12 px-6 text-[15px]",
  lg: "h-14 px-8 text-base",
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

  const classes = cn(base, variants[variant], sizes[size], fullWidth && "w-full", className);

  const content = (
    <>
      {variant === "primary" && (
        <span
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-1/3 -translate-x-[120%] bg-gradient-to-r from-transparent via-white/40 to-transparent group-hover/btn:animate-shine"
        />
      )}
      {icon && iconPosition === "left" && (
        <span className="relative flex shrink-0">{icon}</span>
      )}
      <span className="relative">{children}</span>
      {icon && iconPosition === "right" && (
        <span className="relative flex shrink-0 transition-transform duration-300 group-hover/btn:translate-x-0.5">
          {icon}
        </span>
      )}
    </>
  );

  if ("href" in props && props.href) {
    const isExternal = props.href.startsWith("http");
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
