export function getVideoDuration(file: File): Promise<number> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("video/")) {
      reject(new Error("File is not a valid video."));
      return;
    }

    const videoElement = document.createElement("video");
    videoElement.preload = "metadata";

    const fileURL = URL.createObjectURL(file);
    videoElement.src = fileURL;

    // Khi metadata video được load
    videoElement.onloadedmetadata = () => {
      const duration = videoElement.duration; // Thời lượng tính bằng giây
      URL.revokeObjectURL(fileURL); // Giải phóng bộ nhớ
      resolve(duration);
    };

    videoElement.onerror = () => {
      URL.revokeObjectURL(fileURL); // Giải phóng bộ nhớ
      reject(new Error("Error loading video metadata."));
    };
  });
}
