"use client";

import { usePathname } from "next/navigation";
import Footer from "@/app/components/Footer";

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideFooter = pathname.startsWith("/admin");

  return (
    <>
      {children}
      {!hideFooter && <Footer />}
    </>
  );
}
