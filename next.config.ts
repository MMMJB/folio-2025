import type { NextConfig } from "next";

import createMDX from "@next/mdx";
import rehypeHighlight from "rehype-highlight";
import rehypeVideo from "rehype-video";

const nextConfig: NextConfig = {
  /* config options here */
  pageExtensions: ["tsx", "mdx"],
};

const withMDX = createMDX({
  options: {
    rehypePlugins: [rehypeHighlight, rehypeVideo],
  },
});

export default withMDX(nextConfig);
