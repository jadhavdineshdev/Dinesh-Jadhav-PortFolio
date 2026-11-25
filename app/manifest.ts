import type { MetadataRoute } from "next"

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Dinesh Jadhav — Portfolio",
    short_name: "Dinesh Portfolio",
    description:
      "Personal portfolio of Dinesh Jadhav, Builder & Note-Taker. Frontend & Full-Stack Developer based in Mumbai.",
    start_url: "/",
    display: "standalone",
    background_color: "#ea2a1e",
    theme_color: "#151111",
    icons: [
      {
        src: "/icon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
  }
}

