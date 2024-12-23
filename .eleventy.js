// import { bundle, browserslistToTargets, transform } from "lightningcss";
// import browserslist from "browserslist";
import pluginWebc from "@11ty/eleventy-plugin-webc";
import { getBlurHashAverageColor } from "fast-blurhash";
import { Temporal } from "temporal-polyfill";

const environment =
  process.env.ELEVENTY_RUN_MODE === "serve" || process.env.ELEVENTY_RUN_MODE === "watch" ? "development" : "production";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginWebc, {
    components: ["src/**/_components/**/*.webc"],
  });

  eleventyConfig.addBundle("css");
  eleventyConfig.addPassthroughCopy("src/fonts");
  eleventyConfig.addPassthroughCopy("src/favicon");
  eleventyConfig.addPassthroughCopy("src/**/images/*");

  eleventyConfig.addFilter("blurhashColorRgb", (blurhash) => `rgb(${getBlurHashAverageColor(blurhash).join(",")})`);
  eleventyConfig.addFilter("formatDate", (date, locale = "en-UK") => {
    return Temporal.PlainDate.from(date).toLocaleString(locale, { calendar: 'gregory', dateStyle: "long" })
  })

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
}
