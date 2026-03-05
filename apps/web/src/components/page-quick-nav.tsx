"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type QuickNavItem = {
  href: string;
  label: string;
  hint?: string;
};

type PageQuickNavProps = {
  title: string;
  items: QuickNavItem[];
};

export function PageQuickNav({ title, items }: PageQuickNavProps) {
  const storageKey = useMemo(
    () => `edunexus_page_quick_nav_collapsed_${encodeURIComponent(title)}`,
    [title]
  );
  const [collapsed, setCollapsed] = useState(false);
  const [activeHref, setActiveHref] = useState("");

  useEffect(() => {
    try {
      setCollapsed(window.localStorage.getItem(storageKey) === "1");
    } catch {
      setCollapsed(false);
    }
  }, [storageKey]);

  useEffect(() => {
    try {
      window.localStorage.setItem(storageKey, collapsed ? "1" : "0");
    } catch {
      // ignore persistence failures
    }
  }, [collapsed, storageKey]);

  useEffect(() => {
    const ids = items
      .map((item) => item.href.replace(/^#/, ""))
      .filter((item) => item.length > 0);
    if (ids.length === 0) {
      return;
    }
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((item): item is HTMLElement => item instanceof HTMLElement);
    if (elements.length === 0) {
      return;
    }

    const updateFromHash = () => {
      const hash = window.location.hash;
      if (hash) {
        setActiveHref(hash);
      }
    };
    updateFromHash();
    window.addEventListener("hashchange", updateFromHash);

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        const topEntry = visibleEntries[0];
        if (!topEntry) {
          return;
        }
        const id = topEntry.target.getAttribute("id");
        if (!id) {
          return;
        }
        setActiveHref(`#${id}`);
      },
      { rootMargin: "-20% 0px -62% 0px", threshold: [0, 0.2, 0.5, 1] }
    );
    elements.forEach((element) => observer.observe(element));

    return () => {
      window.removeEventListener("hashchange", updateFromHash);
      observer.disconnect();
    };
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  const visibleItems = collapsed ? items.slice(0, 4) : items;

  return (
    <nav
      className={`page-quick-nav panel wide${collapsed ? " is-collapsed" : ""}`}
      aria-label={`${title} 页面快速导航`}
    >
      <header>
        <strong>{title}</strong>
        <div className="page-quick-nav-tools">
          <span>快速定位到关键区块，减少无效滚动</span>
          {items.length > 4 ? (
            <button type="button" onClick={() => setCollapsed((prev) => !prev)}>
              {collapsed ? "展开全部" : "折叠导航"}
            </button>
          ) : null}
        </div>
      </header>
      <div className="page-quick-nav-row">
        {visibleItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={activeHref === item.href ? "active" : ""}
          >
            {item.label}
            {item.hint ? <em>{item.hint}</em> : null}
          </Link>
        ))}
      </div>
    </nav>
  );
}
