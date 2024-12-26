import favicons from "favicons";
import { parse } from "node-html-parser";
import { lstat, readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { object, optional, string } from "superstruct";

const configSchema = object({
  path: string(), // Path for overriding default icons path. `string`
  appName: string(), // Your application's name. `string`
  appShortName: optional(string()), // Your application's short_name. `string`. Optional. If not set, appName will be used
  appDescription: null, // Your application's description. `string`
  developerName: null, // Your (or your developer's) name. `string`
  developerURL: null, // Your (or your developer's) URL. `string`
  cacheBustingQueryParam: null, // Query parameter added to all URLs that acts as a cache busting system. `string | null`
  dir: "auto", // Primary text direction for name, short_name, and description
  lang: "en-US", // Primary language for name and short_name
  background: "#fff", // Background colour for flattened icons. `string`
  theme_color: "#fff", // Theme color user for example in Android's task switcher. `string`
  appleStatusBarStyle: "black-translucent", // Style for Apple status bar: "black-translucent", "default", "black". `string`
  display: "standalone", // Preferred display mode: "fullscreen", "standalone", "minimal-ui" or "browser". `string`
  orientation: "any", // Default orientation: "any", "natural", "portrait" or "landscape". `string`
  scope: "/", // set of URLs that the browser considers within your app
  start_url: "/?homescreen=1", // Start URL when launching the application from a device. `string`
  preferRelatedApplications: false, // Should the browser prompt the user to install the native companion app. `boolean`
  relatedApplications: undefined, // Information about the native companion apps. This will only be used if `preferRelatedApplications` is `true`. `Array<{ id: string, url: string, platform: string }>`
  version: "1.0", // Your application's version string. `string`
  pixel_art: false, // Keeps pixels "sharp" when scaling up, for pixel art.  Only supported in offline mode.
  loadManifestWithCredentials: false, // Browsers don't send cookies when fetching a manifest, enable this to fix that. `boolean`
  manifestMaskable: false, // Maskable source image(s) for manifest.json. "true" to use default source. More information at https://web.dev/maskable-icon/. `boolean`, `string`, `buffer` or array of `string`
  icons: {
    // Platform Options:
    // - offset - offset in percentage
    // - background:
    //   * false - use default
    //   * true - force use default, e.g. set background for Android icons
    //   * color - set background for the specified icons
    //
    android: true, // Create Android homescreen icon. `boolean` or `{ offset, background }` or an array of sources
    appleIcon: true, // Create Apple touch icons. `boolean` or `{ offset, background }` or an array of sources
    appleStartup: true, // Create Apple startup images. `boolean` or `{ offset, background }` or an array of sources
    favicons: true, // Create regular favicons. `boolean` or `{ offset, background }` or an array of sources
    windows: true, // Create Windows 8 tile icons. `boolean` or `{ offset, background }` or an array of sources
    yandex: true, // Create Yandex browser icon. `boolean` or `{ offset, background }` or an array of sources
  },
  shortcuts: [
    // Your applications's Shortcuts (see: https://developer.mozilla.org/docs/Web/Manifest/shortcuts)
    // Array of shortcut objects:
    {
      name: "View your Inbox", // The name of the shortcut. `string`
      short_name: "inbox", // optionally, falls back to name. `string`
      description: "View your inbox messages", // optionally, not used in any implemention yet. `string`
      url: "/inbox", // The URL this shortcut should lead to. `string`
      icon: "test/inbox_shortcut.png", // source image(s) for that shortcut. `string`, `buffer` or array of `string`
    },
    // more shortcuts objects
  ],
});

/**
 *
 * @param {string[]} paths
 * @param {string} path
 * @returns {string | null}
 */
const findMostSpecificPath = (paths, path) => {
  const pathsByLength = paths.toSorted((a, b) => a.length - b.length);
  let result = null;

  for (const p of pathsByLength) {
    if (path.startsWith(p)) {
      result = p;
    }
  }

  return result;
};

/**
 *
 * @param {*} eleventyConfig
 * @param {Object} pluginOptions
 * @param {RegExp} pluginOptions.configNamePattern
 */
export default async function multipleFaviconsPlugin(eleventyConfig, pluginOptions) {
  const inputDir = eleventyConfig.dir.input;
  const outputDir = eleventyConfig.dir.output;

  const findConfigs = async (dir) => {
    const entries = await readdir(dir);
    const configs = [];

    for (const entry of entries) {
      const fullPath = path.join(dir, entry);

      if ((await lstat(fullPath)).isDirectory()) {
        if (!fullPath.endsWith(eleventyConfig.dir.includes) && !fullPath.endsWith(eleventyConfig.dir.data)) {
          configs.push(...(await findConfigs(fullPath)));
        }
      } else if (pluginOptions.configNamePattern.test(entry)) {
        configs.push(fullPath);
      }
    }

    return configs;
  };
  const configFiles = await findConfigs(inputDir);

  const faviconConfigs = await configFiles.reduce(
    (previous, curr) =>
      previous.then(async (accum) => {
        // TODO: parse with superstruct
        const { source, config } = await readFile(curr, "utf-8").then((c) => JSON.parse(c));

        return {
          ...accum,
          [path.dirname(curr)]: {
            originalPath: curr,
            base: path.dirname(curr),
            favicons: await favicons(path.join(path.dirname(curr), source), config),
          },
        };
      }),
    Promise.resolve({}),
  );

  eleventyConfig.addTransform("favicons", function (content) {
    if (!(this.page.outputPath || "").endsWith("html")) {
      return content;
    }
    const configKey = findMostSpecificPath(Object.keys(faviconConfigs), this.page.inputPath.replace("./", ""));
    if (configKey === null) {
      return content;
    }

    const root = parse(content);
    const head = root.querySelector("head");

    if (head === null) {
      return content;
    }

    const { html, images, files } = faviconConfigs[configKey].favicons;

    head.append(parse(html.join("\n")));

    const outputPath = configKey.replace(inputDir, outputDir);
    for (const f of [...images, ...files]) {
      // TODO write images & files lazy
      writeFile(path.join(outputPath, f.name), f.contents);
    }

    return root.toString();
  });
}
