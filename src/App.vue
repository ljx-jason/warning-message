<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  console.log("App Hide");
});
</script>
<style lang="scss">
.container {
  position: relative;
  width: 100%;
  height: 100vh;
  padding: 1px;
  background-color: #f5f5f5;
}
</style>
