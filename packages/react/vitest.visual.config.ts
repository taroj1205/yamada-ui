import { resolve } from "node:path"
import react from "@vitejs/plugin-react"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vitest/config"

const baselineDir = resolve(process.env.VRT_BASELINE_DIR ?? "visual-baseline")

export default defineConfig({
  plugins: [react()],
  test: {
    include: ["visual/**/*.visual.tsx"],
    browser: {
      enabled: true,
      headless: true,
      instances: [
        { browser: "chromium", viewport: { height: 800, width: 1000 } },
      ],
      provider: playwright(),
      expect: {
        toMatchScreenshot: {
          resolveScreenshotPath: ({ arg, browserName, ext, platform }) =>
            `${baselineDir}/${arg}-${browserName}-${platform}${ext}`,
        },
      },
    },
  },
})
