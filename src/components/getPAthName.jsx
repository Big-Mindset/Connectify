"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function PathHandler() {
  const pathname = usePathname();

  useEffect(() => {

    // You can do anything with the path here (e.g., send to analytics)
  }, [pathname]);

  return null; // Or return some JSX if needed
}

