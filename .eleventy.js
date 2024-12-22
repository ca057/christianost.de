// import { bundle, browserslistToTargets, transform } from "lightningcss";
// import browserslist from "browserslist";
// TODO: remove it
import pluginWebc from "@11ty/eleventy-plugin-webc";
import pluginFavicon from "eleventy-plugin-gen-favicons"
import { getBlurHashAverageColor } from "fast-blurhash";
import { Temporal } from "temporal-polyfill";

const environment =
  process.env.ELEVENTY_RUN_MODE === "serve" || process.env.ELEVENTY_RUN_MODE === "watch" ? "development" : "production";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginWebc, {
    components: ["src/**/_components/**/*.webc"],
  });
  eleventyConfig.addPlugin(pluginFavicon, {
    outputDir: "dist"
  })

  eleventyConfig.addBundle("css");
  eleventyConfig.addPassthroughCopy("src/_fonts");

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
