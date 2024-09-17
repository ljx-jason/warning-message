import globals from "globals"; // 全局变量配置
import pluginJs from "@eslint/js"; // JavaScript 的推荐配置
import tseslint from "typescript-eslint"; // TypeScript 配置
import pluginVue from "eslint-plugin-vue"; // Vue 配置

export default [
  {files: ["**/*.{js,mjs,cjs,ts,vue}"]}, // 校验的文件类型
  {languageOptions: { globals: globals.browser }}, // 设置浏览器环境的全局变量
  pluginJs.configs.recommended, // JavaScript 推荐配置
  ...tseslint.configs.recommended, // TypeScript 推荐配置
  ...pluginVue.configs["flat/essential"], // Vue 推荐配置
  {files: ["**/*.vue"], languageOptions: {parserOptions: {parser: tseslint.parser}}}, // 对 .vue 文件使用 TypeScript 解析器
  // 添加忽略的文件或目录
  {
    ignores: [
      "/dist",
      "/public",
      "/node_modules",
      "**/*.min.js",
      "**/*.config.mjs",
      "**/*.tsbuildinfo",
      "/src/manifest.json",
    ]
  },

  // 添加规则配置
  {
    rules: {
      "vue/multi-word-component-names": "off", // 关闭多单词名称检查
      "@typescript-eslint/ban-types": "off",
      "@typescript-eslint/no-empty-interface": "off", 
      "@typescript-eslint/no-empty-object-type": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "quotes": ["error", "double"], // 强制使用双引号
      "quote-props": ["error", "always"] // 强制对象的属性名使用引号
    }
  },
];
