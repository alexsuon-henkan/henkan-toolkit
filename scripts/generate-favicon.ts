import favicons from "favicons"
import fs from "fs/promises"
import path from "path"

const SOURCE = "public/favicon.svg"
const OUTPUT = "public/favicons"

async function generateFavicons() {
  const response = await favicons(SOURCE, {
    path: "/favicons",
    appName: "Henkan Toolkit",
    appShortName: "Henkan",
    appDescription: "Statistical tools and data visualization for informed decision-making",
    background: "#ffffff",
    theme_color: "#4CAF50",
    icons: {
      android: true,
      appleIcon: true,
      appleStartup: true,
      coast: false,
      favicons: true,
      firefox: true,
      windows: true,
      yandex: false,
    },
  })

  await fs.mkdir(OUTPUT, { recursive: true })

  for (const image of response.images) {
    await fs.writeFile(path.join(OUTPUT, image.name), image.contents)
  }

  for (const file of response.files) {
    await fs.writeFile(path.join(OUTPUT, file.name), file.contents)
  }

  console.log("Favicons generated successfully!")
}

generateFavicons().catch(console.error)
