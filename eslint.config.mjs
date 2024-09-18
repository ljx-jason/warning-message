import globals from "globals"; // 全局变量配置
import jsPlugin from "@eslint/js"; // JavaScript 推荐配置
import tsPlugin from "@typescript-eslint/eslint-plugin"; // TypeScript 插件
import tsParser from "@typescript-eslint/parser"; // TypeScript 解析器
import vuePlugin from "eslint-plugin-vue"; // Vue 插件
import prettierConfig from "eslint-config-prettier"; // 禁用 ESLint 冲突规则
import pluginPrettier from "eslint-plugin-prettier"; // 引入 Prettier 插件

export default [
  // 1. 适用于所有文件的配置 (JavaScript、TypeScript、Vue)
  {
    files: ["**/*.{js,mjs,cjs,ts,vue}"], // 校验的文件类型
    languageOptions: {
      globals: globals.browser, // 设置浏览器环境的全局变量
    },
  },

  // 2. 插件推荐的配置
  jsPlugin.configs.recommended, // JavaScript 推荐配置
  tsPlugin.configs.recommended, // TypeScript 推荐配置
  vuePlugin.configs["flat/essential"], // Vue 推荐配置

  // 3. Prettier 插件配置
  prettierConfig, // 禁用 ESLint 中与 Prettier 冲突的规则
  pluginPrettier.configs.recommended, // 启用 Prettier 插件

  // 4. 对 .vue 文件的特殊处理，使用 TypeScript 解析器
  {
    files: ["**/*.vue"],
    languageOptions: {
      parserOptions: {
        parser: tsParser, // 解析器指定为 TypeScript
      },
    },
  },

  // 5. 忽略不需要校验的文件和目录
  {
    ignores: [
      "/dist", // 忽略打包生成的文件夹
      "/public", // 忽略 public 文件夹
      "/node_modules", // 忽略依赖模块文件夹
      "**/*.min.js", // 忽略压缩后的 JS 文件
      "**/*.config.mjs", // 忽略配置文件
      "**/*.tsbuildinfo", // 忽略 TypeScript 构建信息文件
      "/src/manifest.json", // 忽略 manifest 文件
    ],
  },

  // 6. 自定义 ESLint 规则配置
  {
    rules: {
      // Prettier 规则
      "prettier/prettier": "error", // // 将 Prettier 的格式化错误标记为 ESLint 错误
      // 通用规则
      quotes: ["error", "double"], // 强制使用双引号
      "quote-props": ["error", "always"], // 强制对象的属性名使用引号
      semi: ["error", "always"], // 要求使用分号
      indent: ["error", 2], // 使用两个空格进行缩进
      "no-multiple-empty-lines": ["error", { max: 1 }], // 不允许多个空行
      "no-trailing-spaces": "error", // 不允许行尾有空格

      // TypeScript 规则
      "@typescript-eslint/ban-types": "off", // 禁用 ban-types 规则
      "@typescript-eslint/no-empty-interface": "off", // 禁用 no-empty-interface 规则，允许空接口声明
      "@typescript-eslint/no-explicit-any": "off", // 禁用 no-explicit-any 规则，允许使用 any 类型
      "@typescript-eslint/explicit-function-return-type": "off", // 不强制要求函数必须明确返回类型

      // Vue 规则
      "vue/multi-word-component-names": "off", // 关闭多单词组件名称的限制
      "vue/html-indent": ["error", 2], // Vue 模板中的 HTML 缩进使用两个空格
      "vue/no-v-html": "off", // 允许使用 v-html (根据实际项目需要)
    },
  },
];
