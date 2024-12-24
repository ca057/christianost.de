// import { bundle, browserslistToTargets, transform } from "lightningcss";
// import browserslist from "browserslist";
// TODO: remove it
import pluginFavicon from "eleventy-plugin-gen-favicons"
import { VentoPlugin } from "eleventy-plugin-vento"
import { decodeBlurHash, getBlurHashAverageColor } from "fast-blurhash";
import sharp from "sharp";
import { Temporal } from "temporal-polyfill";
import { readFile } from "node:fs/promises"

const environment =
  process.env.ELEVENTY_RUN_MODE === "serve" || process.env.ELEVENTY_RUN_MODE === "watch" ? "development" : "production";

/**
*
* @param {string} blurHash
*/
async function blurhashToFavicon(blurHash, outputPath) {
  const size = 32
  const pixels = decodeBlurHash(blurHash, size, size)
  const pixelBuffer = Buffer.from(pixels)

  await sharp(pixelBuffer, {
    raw: {
      width: size,
      height: size,
      channels: 4
    }
  }).toFormat("png").toFile("./faaaaa.png")
}

export default async function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginFavicon, {
    outputDir: "dist"
  })
  eleventyConfig.addPlugin(VentoPlugin)

  eleventyConfig.addBundle("css");
  eleventyConfig.addPassthroughCopy("src/_fonts");

  eleventyConfig.addFilter("blurhashColorRgb", (blurhash) => `rgb(${getBlurHashAverageColor(blurhash).join(",")})`);
  eleventyConfig.addFilter("formatDate", (date, locale = "en-UK") => {
    return Temporal.PlainDate.from(date).toLocaleString(locale, { calendar: 'gregory', dateStyle: "long" })
  })

  const coffees = await readFile("src/_data/coffees.json", { encoding: "utf-8" }).then(f => JSON.parse(f))
  // TODO: use zod or similar
  await blurhashToFavicon(coffees.images[0].images.blurhash)

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
}
