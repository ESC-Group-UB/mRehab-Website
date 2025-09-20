import React, { useEffect, useRef, useState, useCallback } from "react";
import "./Navbar.css";
import { jwtDecode } from "jwt-decode";

export function Navbar() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [providerDashboard, setProviderDashboard] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [initials, setInitials] = useState<string>("");

  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const menuPanelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const idToken = localStorage.getItem("idToken");
    if (!idToken) return;

    try {
      const decoded: any = jwtDecode(idToken);
      const groups = decoded["cognito:groups"] || [];
      if (groups.includes("provider") || groups.includes("Provider")) {
        setProviderDashboard(true);
      }
      setLoggedIn(true);

      const picture = decoded?.picture || decoded?.avatar_url || null;
      const name: string =
        decoded?.name ||
        [decoded?.given_name, decoded?.family_name].filter(Boolean).join(" ") ||
        decoded?.email ||
        "";

      setAvatarUrl(picture || null);
      if (name) {
        const parts = name.trim().split(/\s+/);
        const first = parts[0]?.[0] || "";
        const second = parts.length > 1 ? parts[1]?.[0] || "" : "";
        setInitials((first + second).toUpperCase());
      }
    } catch {
      /* ignore decode issues */
    }
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 2);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const avatarHref = loggedIn
    ? providerDashboard
      ? "/dashboard"
      : "/patient-dashboard"
    : "/login";

  const closeMenu = useCallback(() => setMenuOpen(false), []);

  // Outside click to close
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const t = e.target as Node;
      if (
        menuOpen &&
        t &&
        !menuPanelRef.current?.contains(t) &&
        !menuBtnRef.current?.contains(t)
      ) {
        closeMenu();
      }
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [menuOpen, closeMenu]);

  // Escape to close
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [closeMenu]);

  const onMenuKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      setMenuOpen((v) => !v);
    }
  };

  const onMenuLinkClick = () => closeMenu();

  return (
    <header className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-left">
        <a href="/" className="logo" aria-label="Go to Home">
          <img src="/mrehabIcon.png" alt="mRehab Logo" height="35" />
        </a>
      </div>

      {/* Single, unified actions for ALL breakpoints */}
      <div className="actions">
        <button
          ref={menuBtnRef}
          type="button"
          className="menu-button"
          aria-haspopup="menu"
          aria-expanded={menuOpen}
          aria-controls="main-menu"
          onClick={() => setMenuOpen((v) => !v)}
          onKeyDown={onMenuKeyDown}
        >
          <span className="menu-label">Menu</span>
          <svg
            className={`chevron ${menuOpen ? "open" : ""}`}
            width="16"
            height="16"
            viewBox="0 0 20 20"
            aria-hidden="true"
          >
            <path d="M5 7l5 5 5-5" fill="none" stroke="currentColor" strokeWidth="2" />
          </svg>
        </button>

        <a href={avatarHref} className="avatar-btn" aria-label="Profile">
          {avatarUrl ? (
            <img className="avatar-img" src={avatarUrl} alt="" />
          ) : initials ? (
            <span className="avatar-initials" aria-hidden="true">{initials}</span>
          ) : (
            <svg
              className="avatar-icon"
              width="22"
              height="22"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                d="M12 12c2.761 0 5-2.462 5-5.5S14.761 1 12 1 7 3.462 7 6.5 9.239 12 12 12zm0 2c-4.418 0-8 3.134-8 7v1h16v-1c0-3.866-3.582-7-8-7z"
                fill="currentColor"
              />
            </svg>
          )}
        </a>
      </div>

      {/* Dropdown panel */}
      <div
        id="main-menu"
        ref={menuPanelRef}
        role="menu"
        aria-label="Main navigation"
        className={`dropdown-panel ${menuOpen ? "open" : ""}`}
      >
        <a role="menuitem" tabIndex={-1} href="/how-it-works" onClick={onMenuLinkClick}>
          How It Works
        </a>
        <a role="menuitem" tabIndex={-1} href="/for-providers" onClick={onMenuLinkClick}>
          For Providers
        </a>
        <a role="menuitem" tabIndex={-1} href="/buy-now" onClick={onMenuLinkClick}>
          Buy Now
        </a>

        {/* When logged out, show Login quick action aligned with palette */}
        {!loggedIn ? (
          <a role="menuitem" tabIndex={-1} href="/login" className="menu-cta" onClick={onMenuLinkClick}>
            Login
          </a>
        ) : (
          <a
            role="menuitem"
            tabIndex={-1}
            href={providerDashboard ? "/dashboard" : "/patient-dashboard"}
            className="menu-cta"
            onClick={onMenuLinkClick}
          >
            Dashboard
          </a>
        )}
      </div>
    </header>
  );
}
