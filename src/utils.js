const { promisify } = require('util')

const exec = promisify(require('child_process').exec)

const VideoSizes = {
  /** @description 720x480 */
  ntsc: '720x480',
  /** @description 720x576 */
  pal: '720x576',
  /** @description 352x240 */
  qntsc: '352x240',
  /** @description 352x288 */
  qpal: '352x288',
  /** @description 640x480 */
  sntsc: '640x480',
  /** @description 768x576 */
  spal: '768x576',
  /** @description 352x240 */
  film: '352x240',
  /** @description 352x240 */
  'ntsc-film': '352x240',
  /** @description 128x96 */
  sqcif: '128x96',
  /** @description 176x144 */
  qcif: '176x144',
  /** @description 352x288 */
  cif: '352x288',
  /** @description 704x576 */
  '4cif': '704x576',
  /** @description 1408x1152 */
  '16cif': '1408x1152',
  /** @description 160x120 */
  qqvga: '160x120',
  /** @description 320x240 */
  qvga: '320x240',
  /** @description 640x480 */
  vga: '640x480',
  /** @description 800x600 */
  svga: '800x600',
  /** @description 1024x768 */
  xga: '1024x768',
  /** @description 1600x1200 */
  uxga: '1600x1200',
  /** @description 2048x1536 */
  qxga: '2048x1536',
  /** @description 1280x1024 */
  sxga: '1280x1024',
  /** @description 2560x2048 */
  qsxga: '2560x2048',
  /** @description 5120x4096 */
  hsxga: '5120x4096',
  /** @description 852x480 */
  wvga: '852x480',
  /** @description 1366x768 */
  wxga: '1366x768',
  /** @description 1600x1024 */
  wsxga: '1600x1024',
  /** @description 1920x1200 */
  wuxga: '1920x1200',
  /** @description 2560x1600 */
  woxga: '2560x1600',
  /** @description 3200x2048 */
  wqsxga: '3200x2048',
  /** @description 3840x2400 */
  wquxga: '3840x2400',
  /** @description 6400x4096 */
  whsxga: '6400x4096',
  /** @description 7680x4800 */
  whuxga: '7680x4800',
  /** @description 320x200 */
  cga: '320x200',
  /** @description 640x350 */
  ega: '640x350',
  /** @description 852x480 */
  hd480: '852x480',
  /** @description 1280x720 */
  hd720: '1280x720',
  /** @description 1920x1080 */
  hd1080: '1920x1080',
  /** @description 2048x1080 */
  '2k': '2048x1080',
  /** @description 1998x1080 */
  '2kflat': '1998x1080',
  /** @description 2048x858 */
  '2kscope': '2048x858',
  /** @description 4096x2160 */
  '4k': '4096x2160',
  /** @description 3996x2160 */
  '4kflat': '3996x2160',
  /** @description 4096x1716 */
  '4kscope': '4096x1716',
  /** @description 640x360 */
  nhd: '640x360',
  /** @description 240x160 */
  hqvga: '240x160',
  /** @description 400x240 */
  wqvga: '400x240',
  /** @description 432x240 */
  fwqvga: '432x240',
  /** @description 480x320 */
  hvga: '480x320',
  /** @description 960x540 */
  qhd: '960x540',
  /** @description 2048x1080 */
  '2kdci': '2048x1080',
  /** @description 4096x2160 */
  '4kdci': '4096x2160',
  /** @description 3840x2160 */
  uhd2160: '3840x2160',
  /** @description 7680x4320 */
  uhd4320: '7680x4320',
}

module.exports = {
  exec,
  VideoSizes,
}
