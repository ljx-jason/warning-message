import ImageCompressor from 'js-image-compressor';
/**
 * 防抖函数
 * @param fn 函数
 * @param delay 延迟时间
 * @returns
 */
const debounce = <T extends (...args: any[]) => any>(fn: T, delay: number) => {
  let timer: number | null = null;
  return function (this: any, ...args: Parameters<T>) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
};

const pressorImg = (file: any) => { 
  // 使用 Promise()防止没处理文件就上传
  const isLtM = file.size / 1824 / 1824 >= 0.5;//这里对于大于 588kb(其实是512kb)的图片都进行压缩处理
  return new Promise((resolve, reject) => {
    // 小于500kb 不压缩
    if (!isLtM) {
      resolve(file);
    } else {
      //压缩到500kb
      new ImageCompressor({
        file: file,
        quality: 0.8,
        maxWidth: 1500,
        maxHeight: 1500,
        redressOrientation: false,
        success: function (result: any) {
          resolve(
            new File([result], file.name, {
              type: file.type,
              lastModified: Date.now()
            })
          )
        },
        error: function (err: any) {
          reject(err)
        }
      })
    }
  })
}

export { debounce,pressorImg };
