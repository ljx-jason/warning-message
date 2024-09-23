import { defineConfig } from "vite";
import uni from "@dcloudio/vite-plugin-uni";
import AutoImport from "unplugin-auto-import/vite";

export default defineConfig(async () => {
  const UnoCss = await import("unocss/vite").then((i) => i.default);

  return {
    plugins: [
      uni(),

      // https://github.com/unocss/unocss
      UnoCss(),

      AutoImport({
        imports: ["vue", "uni-app"],
        dts: "src/types/auto-imports.d.ts", // 自动生成的类型声明文件
        eslintrc: {
          enabled: true,
        },
      }),
    ],
  };
});
