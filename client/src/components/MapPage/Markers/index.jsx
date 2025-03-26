const ToiletMarkerImage = ({
  img = "/markers/toilet_marker_1.png",
  size = "16",
}) => {
  const toiletMarkerImage = document.createElement("div");

  toiletMarkerImage.innerHTML = `
    <div class="relative w-${size} h-${size} flex items-center justify-center transition-transform duration-500 ease-out active:translate-y-[-20px]">
      <img src="${img}" class="w-full h-full object-contain" alt="Portable Toilet Marker" />
    </div>
  `;

  return toiletMarkerImage;
};

export default ToiletMarkerImage;
