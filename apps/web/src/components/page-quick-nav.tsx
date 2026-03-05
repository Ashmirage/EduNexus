import Link from "next/link";

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
  if (items.length === 0) {
    return null;
  }
  return (
    <nav className="page-quick-nav panel wide" aria-label={`${title} 页面快速导航`}>
      <header>
        <strong>{title}</strong>
        <span>快速定位到关键区块，减少无效滚动</span>
      </header>
      <div className="page-quick-nav-row">
        {items.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
            {item.hint ? <em>{item.hint}</em> : null}
          </Link>
        ))}
      </div>
    </nav>
  );
}

