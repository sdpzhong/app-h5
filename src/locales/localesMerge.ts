/*
 * @Author: sdpzhong
 * @Date: 2024-04-02 11:30:09
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2024-04-02 11:48:24
 */

import type { LocaleMerageType } from './common';

const mergeArray: LocaleMerageType[] = [
  {
    key: 'en-US',
    localeData: import.meta.glob('./en-US/**/*.json', {
      eager: true,
    }),
  },
  {
    key: 'zh-CN',
    localeData: import.meta.glob('./zh-CN/**/*.json', {
      eager: true,
    }),
  },
];

const localesData = mergeArray
  .map((localMergeItem) => {
    const localeKey = localMergeItem.key;
    const moduleMap = localMergeItem.localeData;
    const moduleData = Object.keys(moduleMap).reduce((prev, filePath) => {
      const fileNameWithSuffix = filePath.substring(filePath.lastIndexOf('/') + 1);
      const fileName = fileNameWithSuffix.split('.')[0];
      return Object.assign(prev, { [fileName]: moduleMap[filePath].default });
    }, {});
    return {
      [localeKey]: moduleData,
    };
  })
  .reduce((prev, curr) => Object.assign(prev, curr), {});

export default localesData;
