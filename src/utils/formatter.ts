/*
 * @Author: sdpzhong
 * @Date: 2024-11-21 14:56:16
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-11-21 14:56:36
 */

/**
 * 流量单位转换
 * @param size KB
 */
export function computeTrafficDataSizeDisplayName(size: number) {
  if (size < 1024) {
    return size + 'B';
  } else if (size < 1024 * 1024) {
    return (size / 1024).toFixed(0) + 'KB';
  } else if (size < 1024 * 1024 * 1024) {
    return (size / (1024 * 1024)).toFixed(0) + 'MB';
  } else if (size < 1024 * 1024 * 1024 * 1024) {
    return (size / (1024 * 1024 * 1024)).toFixed(0) + 'GB';
  } else {
    return (size / (1024 * 1024 * 1024 * 1024)).toFixed(0) + 'TB';
  }
}

export function formatDuraton(duration: number) {
  const seconds = duration % 60;
  const minutes = Math.floor(duration / 60) % 60;
  const hours = Math.floor(duration / 3600);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
      .toString()
      .padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}
