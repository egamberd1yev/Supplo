// Figma'dan "Logo/Full" ni SVG qilib eksport qiling va public/logo-full.svg ga qo'ying.
export default function Logo({ className = "h-14 w-[196px]" }) {
  return <img src="/logo-full.svg" alt="Supplo" className={className} />;
}
