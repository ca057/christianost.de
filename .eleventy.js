// import { bundle, browserslistToTargets, transform } from "lightningcss";
// import browserslist from "browserslist";
import pluginFavicon from "eleventy-plugin-gen-favicons";
import { VentoPlugin } from "eleventy-plugin-vento";
import { decodeBlurHash, getBlurHashAverageColor } from "fast-blurhash";
import sharp from "sharp";
import { Temporal } from "temporal-polyfill";
import { readFile } from "node:fs/promises";

const environment =
  process.env.ELEVENTY_RUN_MODE === "serve" || process.env.ELEVENTY_RUN_MODE === "watch" ? "development" : "production";

/**
 *
 * @param {string} blurHash
 */
async function blurhashToFavicon(blurHash, outputPath) {
  const size = 64;
  const pixels = decodeBlurHash(blurHash, size, size);
  const pixelBuffer = Buffer.from(pixels);

  const roundedCorners = Buffer.from(`<svg><rect x="0" y="0" width="${size}" height="${size}" rx="8" ry="8"/></svg>`);
  await sharp(pixelBuffer, {
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
  eleventyConfig.addPlugin(pluginFavicon, {
    outputDir: "dist",
  });
  eleventyConfig.addPlugin(VentoPlugin);

  eleventyConfig.addBundle("css");
  eleventyConfig.addPassthroughCopy("src/_fonts");

  eleventyConfig.addFilter("blurhashColorRgb", (blurhash) => `rgb(${getBlurHashAverageColor(blurhash).join(",")})`);
  eleventyConfig.addFilter("formatDate", (date, locale = "en-UK") => {
    return Temporal.PlainDate.from(date).toLocaleString(locale, { calendar: "gregory", dateStyle: "long" });
  });

  const coffees = await readFile("src/_data/coffees.json", { encoding: "utf-8" }).then((f) => JSON.parse(f));
  await blurhashToFavicon(coffees.images[0].images.blurhash, "src/coffee/favicon.png");

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
}
