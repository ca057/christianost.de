import tinyCSS from "@sardine/eleventy-plugin-tinycss";
import tinyHTML from "@sardine/eleventy-plugin-tinyhtml";
import { VentoPlugin } from "eleventy-plugin-vento";
import { decodeBlurHash, getBlurHashAverageColor } from "fast-blurhash";
import sharp from "sharp";
import { Temporal } from "temporal-polyfill";
import { readFile, writeFile } from "node:fs/promises";
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

async function createCoffeeFavicon() {
  // TODO: lazy!
  const coffees = await readFile("src/_data/coffees.json", { encoding: "utf-8" }).then((f) => JSON.parse(f));
  await blurhashToFavicon(coffees.images.at(-1).images.blurhash, "src/coffee/_favicon.png");
}

export default async function (eleventyConfig) {
  await createCoffeeFavicon();

  eleventyConfig.addWatchTarget("src/**/_favicon.json");

  eleventyConfig.addWatchTarget("src/**/*.css");
  eleventyConfig.addBundle("css");
  eleventyConfig.addWatchTarget("src/**/*.js");
  eleventyConfig.addBundle("js");
  eleventyConfig.addPassthroughCopy("src/_fonts");

  eleventyConfig.addFilter("blurhashColorRgb", (blurhash) => `rgb(${getBlurHashAverageColor(blurhash).join(",")})`);

  const dateCache = {};
  eleventyConfig.addFilter(
    "formatDate",
    (date, locale = "en-UK") =>
      dateCache[date] ||
      (dateCache[date] = Temporal.PlainDate.from(date).toLocaleString(locale, {
        calendar: "gregory",
        dateStyle: "long",
      })),
  );

  // copied from https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/PluralRules
  const enOrdinalRules = new Intl.PluralRules("en-EN", { type: "ordinal" });
  const suffixes = new Map([
    ["one", "st"],
    ["two", "nd"],
    ["few", "rd"],
    ["other", "th"],
  ]);
  eleventyConfig.addFilter("formatOrdinals", (count) => `${count}${suffixes.get(enOrdinalRules.select(count))}`);

  eleventyConfig.addPlugin(VentoPlugin);
  await eleventyConfig.addPlugin(pluginMultipleFavicons, { configNamePattern: /_favicon\.json/ });

  if (environment === "production") {
    eleventyConfig.addPlugin(tinyCSS);
    eleventyConfig.addPlugin(tinyHTML);
  }

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
}
