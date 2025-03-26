const CROPPER_MIN_WIDTH = 200; // in pixal
const CROPPER_MIN_HEIGHT = 200; // in pixal

const cropperSetting = {
  aspectRatio: 1,
  viewMode: 2,
  wheelZoomRatio: 0.2,
  minContainerWidth: CROPPER_MIN_WIDTH,
  minCropBoxHeight: CROPPER_MIN_HEIGHT,
};

export { CROPPER_MIN_WIDTH, CROPPER_MIN_HEIGHT, cropperSetting };
