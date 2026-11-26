import { composeStories } from "@storybook/react-vite"
import { expect, test } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"
import { UIProvider } from "../src"

const modules = import.meta.glob(
  "../src/components/{button,alert,card,badge}/*.stories.tsx",
  { eager: true },
)

const freeze = document.createElement("style")
freeze.textContent =
  "*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}"
document.head.append(freeze)

for (const [path, module] of Object.entries(modules)) {
  const component = path.split("/").at(-1)!.replace(".stories.tsx", "")
  const stories = composeStories(module as Parameters<typeof composeStories>[0])

  for (const [name, Story] of Object.entries(stories)) {
    test(`${component}-${name}`, async () => {
      await render(
        <UIProvider>
          <div data-testid="story" style={{ display: "inline-block", padding: 16 }}>
            <Story />
          </div>
        </UIProvider>,
      )
      await expect
        .element(page.getByTestId("story"))
        .toMatchScreenshot(`${component}-${name}`)
    })
  }
}
