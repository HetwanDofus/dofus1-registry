import type { NextConfig } from "next";
import { createMDX } from "fumadocs-mdx/next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || "",
  images: { unoptimized: true },
  webpack(config) {
    // Find and disable Next.js default SVG handling in all rule sets
    for (const rule of config.module.rules) {
      if (rule?.oneOf) {
        for (const oneOfRule of rule.oneOf) {
          if (
            oneOfRule?.test instanceof RegExp &&
            oneOfRule.test.test(".svg")
          ) {
            oneOfRule.exclude = /\.svg$/;
          }
          if (oneOfRule?.issuer?.and) {
            for (const condition of oneOfRule.issuer.and) {
              if (
                typeof condition === "object" &&
                condition?.test instanceof RegExp &&
                condition.test.test(".svg")
              ) {
                oneOfRule.exclude = /\.svg$/;
              }
            }
          }
        }
      }
    }

    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: "@svgr/webpack",
          options: {
            svgoConfig: {
              plugins: [
                {
                  name: "preset-default",
                  params: { overrides: { removeViewBox: false } },
                },
                "prefixIds",
              ],
            },
            svgProps: {
              imageRendering: "optimizeQuality",
              shapeRendering: "geometricPrecision",
            },
          },
        },
      ],
    });
    return config;
  },
};

const withMDX = createMDX();

export default withMDX(nextConfig);
