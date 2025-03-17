/// <reference lib="deno.ns" />

import { copy, ensureDir } from "jsr:@std/fs";
import { build, stop } from "npm:esbuild";
import { denoPlugins } from "jsr:@luca/esbuild-deno-loader";

const SRC_DIR = "./src";
const DIST_DIR = "./dist";
const ASSETS_DIR = `${SRC_DIR}/assets`;

const shouldMinify = Deno.args.includes("--minify");

const initializeDist = async () => await ensureDir(DIST_DIR);

const copyAssets = async () => {
  for await (const entry of Deno.readDir(ASSETS_DIR)) {
    const srcPath = `${ASSETS_DIR}/${entry.name}`;
    const destPath = `${DIST_DIR}/${entry.name}`;
    if (entry.isFile) {
      await Deno.copyFile(srcPath, destPath);
    } else if (entry.isDirectory) {
      await copy(srcPath, destPath);
    }
  }
};

const getEntryFiles = async (): Promise<string[]> => {
  const entryFiles: string[] = [];
  for await (const entry of Deno.readDir(SRC_DIR)) {
    if (entry.isFile && entry.name.endsWith(".ts")) {
      entryFiles.push(`${SRC_DIR}/${entry.name}`);
    }
  }
  if (entryFiles.length === 0) {
    throw new Error("No entry files found in src directory.");
  }
  return entryFiles;
};

const bundleWithEsbuild = async (entryFiles: string[]) => {
  const result = await build({
    entryPoints: entryFiles,
    outdir: DIST_DIR,
    bundle: true,
    minify: shouldMinify,
    platform: "browser",
    target: ["esnext"],
    plugins: [...denoPlugins()],
    format: "iife",
  });

  stop();
  if (result.errors.length > 0) {
    throw new Error(`Build failed with errors: ${result.errors}`);
  }
  console.info("Build completed with esbuild.");
};

const main = async () => {
  await initializeDist();
  await copyAssets();
  const entryFiles = await getEntryFiles();
  await bundleWithEsbuild(entryFiles);
};

main().catch((err) => console.error("Build failed:", err.message));
