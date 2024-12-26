// import { bundle, browserslistToTargets, transform } from "lightningcss";
// import browserslist from "browserslist";
import tinyCSS from "@sardine/eleventy-plugin-tinycss";
import tinyHTML from "@sardine/eleventy-plugin-tinyhtml";
import { VentoPlugin } from "eleventy-plugin-vento";
import { decodeBlurHash, getBlurHashAverageColor } from "fast-blurhash";
import sharp from "sharp";
import { Temporal } from "temporal-polyfill";
import { readFile } from "node:fs/promises";
import pluginMultipleFavicons from "./eleventy-plugin-multiple-favicons.js";

const environment =
  process.env.ELEVENTY_RUN_MODE === "serve" || process.env.ELEVENTY_RUN_MODE === "watch" ? "development" : "production";

/**
 *
 * @param {string} blurHash
 */
async function blurhashToFavicon(blurHash, outputPath) {
  const size = 32;
  const pixels = decodeBlurHash(blurHash, size, size);

  const roundedCorners = Buffer.from(`<svg><rect x="0" y="0" width="${size}" height="${size}" rx="8" ry="8"/></svg>`);
  await sharp(Buffer.from(pixels), {
    raw: {
      width: size,
      height: size,
      channels: 4,
    },
  })
    .composite([{ input: roundedCorners, blend: "dest-in" }])
    .toFormat("png")
    .toFile(outputPath);
}

export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(VentoPlugin);

  const coffees = await readFile("src/_data/coffees.json", { encoding: "utf-8" }).then((f) => JSON.parse(f));
  await blurhashToFavicon(coffees.images[0].images.blurhash, "src/coffee/favicon.png");

  await eleventyConfig.addPlugin(pluginMultipleFavicons, { configNamePattern: /_favicon\.json/ });
  eleventyConfig.addWatchTarget("src/**/_favicon.json");

  eleventyConfig.addBundle("css");
  eleventyConfig.addPassthroughCopy("src/_fonts");

  eleventyConfig.addFilter("blurhashColorRgb", (blurhash) => `rgb(${getBlurHashAverageColor(blurhash).join(",")})`);
  eleventyConfig.addFilter("formatDate", (date, locale = "en-UK") => {
    return Temporal.PlainDate.from(date).toLocaleString(locale, { calendar: "gregory", dateStyle: "long" });
  });

  eleventyConfig.addPlugin(tinyCSS);
  eleventyConfig.addPlugin(tinyHTML);

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
}
