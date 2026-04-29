module.exports = {
  plugins: {
    'postcss-pxtorem': {
      rootValue: 37.5,
      propList: ['*'],
      selectorBlackList: ['-noconvert'], // 过滤掉-noconvert结尾的class，不进行rem转换
    },
  },
};
