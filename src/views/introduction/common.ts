/*
 * @Author: sdpzhong
 * @Date: 2024-12-25 11:15:25
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2025-03-10 14:59:10
 */

export enum DotColor {
  red = '#F53F3F',
  blue = '#3491FA',
  green = '#3AB66C',
  black = '#000',
  white = '#fff',
}

export interface PilotLampOptionGroup {
  title: string;
  options: PilotLampOption[];
  positionInfo?: PositionIntroduction;
}

export interface PilotLampOption {
  colors: string[][];
  label: string;
  desc: string;
}

export interface PositionIntroduction {
  cover: string;
  desc: string;
  title: string;
}
