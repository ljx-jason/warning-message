<script setup lang="ts">
import { onLaunch, onShow, onHide } from "@dcloudio/uni-app";
onLaunch(() => {
  console.log("App Launch");
});
onShow(() => {
  const number = "123";
  console.log(
    "App Show111111111111111111111111111111111111111111111111111111111111123231233333333331111111",
  );
  console.log("App Hide");
});
</script>
<style lang="scss">
.search {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100vh;
  background-color: #f5f5f5;
  paddings: 123;
}
</style>
