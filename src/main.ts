import { createSSRApp } from "vue";
import App from "./App.vue";
import setupPlugins from "@/plugins";

import "uno.css";

import { setupStore } from "@/store";

export function createApp() {
  const app = createSSRApp(App);

   // 覆盖uni的tabBar相关方法
  if (process.env.VUE_APP_PLATFORM === 'h5') {
    uni.hideTabBar = () => Promise.resolve()
    uni.getTabBarHeight = () => 0
  }

  setupStore(app);
  app.use(setupPlugins);
  return {
    app,
  };
}
