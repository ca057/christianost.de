// import { bundle, browserslistToTargets, transform } from "lightningcss";
// import browserslist from "browserslist";
import pluginWebc from "@11ty/eleventy-plugin-webc";
import { Temporal } from "temporal-polyfill";

const environment =
  process.env.ELEVENTY_RUN_MODE === "serve" || process.env.ELEVENTY_RUN_MODE === "watch" ? "development" : "production";

export default function (eleventyConfig) {
  eleventyConfig.addPlugin(pluginWebc, {
    components: ["src/**/_components/**/*.webc"],
  });

  eleventyConfig.addBundle("css");
  // eleventyConfig.addTemplateFormats("css");
  // eleventyConfig.addExtension("css", {
  //   outputFileExtension: "css",
  //   compile: async function (inputContent, inputPath) {
  //     let targets = browserslistToTargets(browserslist("> 0.2% and not dead")); // TOOD:

  //     return async () => {
  //       let { code, warnings } = bundle({
  //         filename: inputPath,
  //         minify: environment === "production",
  //         sourceMap: true,
  //         targets,
  //         drafts: { nesting: true },
  //       });

  //       if (warnings.length > 0) {
  //         console.warn(warnings);
  //       }

  //       return code;
  //     };
  //   },
  // });

  // eleventyConfig.addFilter("cssmin", function (input) {
  //   const { code, warnings } = transform({
  //     // TODO:
  //     code: Buffer.from(input),
  //     minify: environment === "production",
  //     sourceMap: true,
  //   });

  //   if (warnings.length > 0) {
  //     console.warn(warnings);
  //   }

  //   return code.toString("utf-8");
  // });
  //
  //
  eleventyConfig.addPassthroughCopy("src/fonts");

  eleventyConfig.addGlobalData("coffees", async () => {
    // TODO: load this from externally

    if (environment === "development") {
      const now = Temporal.PlainDate.from(Temporal.Now.plainDateISO());

      return Array.from({ length: 3451 }).map((_, i) => ({
        day: now.subtract({ days: i }),
      }));
    }
  });

  return {
    dir: {
      input: "src",
      output: "dist",
    },
  };
}
