import "@testing-library/jest-dom/vitest";
import React from "react";
import { vi } from "vitest";

vi.mock("next/image", () => ({
  default: function MockImage(
    props: React.ImgHTMLAttributes<HTMLImageElement> & { fill?: boolean },
  ) {
    const rest = { ...props };
    delete rest.fill;
    return React.createElement("img", rest);
  },
}));

vi.mock("next/link", () => ({
  default: function MockLink({
    children,
    href,
    ...rest
  }: React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
    return React.createElement("a", { href, ...rest }, children);
  },
}));
