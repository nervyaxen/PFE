import { NavLink as RouterNavLink, NavLinkProps } from "react-router-dom";
import { forwardRef } from "react";
import { cn } from "@/lib/utils";

interface NavLinkCompatProps extends Omit<NavLinkProps, "className"> {
  className?: string;
  activeClassName?: string;
  pendingClassName?: string;

  // 🔒 NEW OPTIONAL PROP
  locked?: boolean;
}

// 🔒 unlock state (global)
const isUnlocked = () => {
  return localStorage.getItem("payment_success") === "true";
};

const NavLink = forwardRef<HTMLAnchorElement, NavLinkCompatProps>(
  (
    {
      className,
      activeClassName,
      pendingClassName,
      to,
      locked,
      onClick,
      ...props
    },
    ref
  ) => {

    const isLocked = locked && !isUnlocked();

    return (
      <RouterNavLink
        ref={ref}
        to={to}

        // ✅ HARD BLOCK NAVIGATION
        onClick={(e) => {
          if (isLocked) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }

          // keep original behavior if exists
          onClick?.(e);
        }}

        className={({ isActive, isPending }) =>
          cn(
            className,

            // existing states
            isActive && activeClassName,
            isPending && pendingClassName,

            // 🔒 locked style (visual only)
            isLocked && "opacity-40 cursor-not-allowed"
          )
        }

        // ✅ IMPORTANT: block pointer events on DOM level
        aria-disabled={isLocked}
        {...props}
      />
    );
  }
);

NavLink.displayName = "NavLink";

export { NavLink };