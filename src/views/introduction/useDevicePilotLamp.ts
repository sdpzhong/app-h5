/*
 * @Author: sdpzhong
 * @Date: 2025-02-20 14:54:25
 * @Last Modified by: sdpzhong
 * @Last Modified time: 2025-03-10 17:22:22
 */

import { useI18n } from 'vue-i18n';

import { DotColor, type PilotLampOptionGroup } from './common';
import { useRoute } from 'vue-router';

import HC30_1 from '@/assets/images/introduce/hc30/cover-1.png';
import HC30_2 from '@/assets/images/introduce/hc30/cover-2.png';
import HC30_3 from '@/assets/images/introduce/hc30/cover-3.png';
import HC30_4 from '@/assets/images/introduce/hc30/cover-4.png';
import A10_1 from '@/assets/images/introduce/a10/cover-1.png';
import A10_2 from '@/assets/images/introduce/a10/cover-2.png';
import A10_3 from '@/assets/images/introduce/a10/cover-3.png';
import A10S_1 from '@/assets/images/introduce/a10s/cover-1.png';
import A10S_2 from '@/assets/images/introduce/a10s/cover-2.png';
import A10S_3 from '@/assets/images/introduce/a10s/cover-3.png';

export function useDevicePilotLamp() {
  const { t } = useI18n();
  const route = useRoute();

  const tpl: string = (route.query['tpl'] ?? '').toString();
  const renderGroup = createRenderContext(tpl.toLocaleUpperCase());

  function createRenderContext(tpl: string): PilotLampOptionGroup[] {
    if (tpl === 'HC30') {
      return [
        {
          title: t('introduction.group-1'),
          options: [
            {
              label: t('introduction.options-1-label'),
              desc: t('introduction.options-1-desc'),
              colors: [[DotColor.red]],
            },
            {
              label: t('introduction.options-2-label'),
              desc: t('introduction.options-2-desc'),
              colors: [[DotColor.red]],
            },
            {
              label: t('introduction.options-3-label'),
              desc: t('introduction.options-3-desc'),
              colors: [[DotColor.black]],
            },
          ],
          positionInfo: {
            cover: HC30_1,
            desc: t('introduction.position-1-desc'),
            title: t('introduction.ll-hc30'),
          },
        },
        {
          title: t('introduction.group-2'),
          options: [
            {
              label: t('introduction.options-2-1-label'),
              desc: t('introduction.options-2-1-desc'),
              colors: [[DotColor.red]],
            },
            {
              label: t('introduction.options-2-2-label'),
              desc: t('introduction.options-2-2-title'),
              colors: [[DotColor.red]],
            },
            {
              label: t('introduction.options-2-3-label'),
              desc: t('introduction.options-2-3-desc'),
              colors: [[DotColor.red]],
            },
            {
              label: t('introduction.options-2-4-label'),
              desc: t('introduction.options-2-4-desc'),
              colors: [[DotColor.blue]],
            },
            {
              label: t('introduction.options-2-5-label'),
              desc: t('introduction.options-2-5-desc'),
              colors: [[DotColor.blue]],
            },
            {
              label: t('introduction.options-2-6-label'),
              desc: t('introduction.options-2-6-desc'),
              colors: [[DotColor.blue]],
            },
            {
              label: t('introduction.options-2-7-label'),
              desc: t('introduction.options-2-7-desc'),
              colors: [[DotColor.red, DotColor.blue]],
            },
            {
              label: t('introduction.options-2-8-label'),
              desc: t('introduction.options-2-8-desc'),
              colors: [[DotColor.red, DotColor.blue]],
            },
            {
              label: t('introduction.options-2-9-label'),
              desc: t('introduction.options-2-9-desc'),
              colors: [[DotColor.red, DotColor.blue]],
            },
            {
              label: t('introduction.options-2-10-label'),
              desc: t('introduction.options-2-10-desc'),
              colors: [[DotColor.red, DotColor.blue]],
            },
            {
              label: t('introduction.options-2-11-label'),
              desc: t('introduction.options-2-11-desc'),
              colors: [[DotColor.red, DotColor.blue]],
            },
            {
              label: t('introduction.options-2-12-label'),
              desc: t('introduction.options-2-12-desc'),
              colors: [
                [DotColor.red],
                [DotColor.red, DotColor.blue],
                [DotColor.blue],
                [DotColor.black],
              ],
            },
            {
              label: t('introduction.options-2-13-label'),
              desc: t('introduction.options-2-13-desc'),
              colors: [[DotColor.blue]],
            },
          ],
          positionInfo: {
            cover: HC30_2,
            desc: t('introduction.position-2-desc'),
            title: t('introduction.ll-hc30'),
          },
        },
        {
          title: t('introduction.group-4'),
          options: [
            {
              label: t('introduction.options-4-1-label'),
              desc: t('introduction.options-4-1-desc'),
              colors: [[DotColor.green]],
            },
            {
              label: t('introduction.options-4-2-label'),
              desc: t('introduction.options-4-2-desc'),
              colors: [[DotColor.black]],
            },
          ],
          positionInfo: {
            cover: HC30_3,
            desc: t('introduction.position-green-ll-desc'),
            title: t('introduction.ll-hc30'),
          },
        },
        {
          title: t('introduction.group-3'),
          options: [
            {
              label: t('introduction.options-3-1-label'),
              desc: t('introduction.options-3-1-desc'),
              colors: [[DotColor.red]],
            },
            {
              label: t('introduction.options-3-2-label'),
              desc: t('introduction.options-3-2-desc'),
              colors: [[DotColor.blue], [DotColor.blue]],
            },
            {
              label: t('introduction.options-3-3-label'),
              desc: t('introduction.options-3-3-desc'),
              colors: [[DotColor.green], [DotColor.green], [DotColor.green]],
            },
          ],
          positionInfo: {
            cover: HC30_4,
            desc: t('introduction.position-3-desc'),
            title: t('introduction.ll-hc30'),
          },
        },
      ];
    }

    if (tpl === 'A10') {
      return [
        {
          title: t('introduction.group-1'),
          options: [
            {
              label: t('introduction.options-1-label'),
              desc: t('introduction.options-1-desc'),
              colors: [[DotColor.red]],
            },
            {
              label: t('introduction.options-2-label'),
              desc: t('introduction.options-2-desc'),
              colors: [[DotColor.red]],
            },
            {
              label: t('introduction.options-3-label'),
              desc: t('introduction.options-3-desc'),
              colors: [[DotColor.black]],
            },
          ],
          positionInfo: {
            cover: A10_1,
            desc: t('introduction.position-1-desc'),
            title: t('introduction.ll-a10'),
          },
        },
        {
          title: t('introduction.group-2'),
          options: [
            {
              label: t('introduction.options-2-1-label'),
              desc: t('introduction.options-2-1-desc'),
              colors: [[DotColor.red]],
            },
            {
              label: t('introduction.options-2-2-label'),
              desc: t('introduction.options-2-2-title'),
              colors: [[DotColor.red]],
            },
            {
              label: t('introduction.options-2-3-label'),
              desc: t('introduction.options-2-3-desc'),
              colors: [[DotColor.red]],
            },
            {
              label: t('introduction.options-2-4-label'),
              desc: t('introduction.options-2-4-desc'),
              colors: [[DotColor.blue]],
            },
            {
              label: t('introduction.options-2-5-label'),
              desc: t('introduction.options-2-5-desc'),
              colors: [[DotColor.blue]],
            },
            {
              label: t('introduction.options-2-6-label'),
              desc: t('introduction.options-2-6-desc'),
              colors: [[DotColor.blue]],
            },
            {
              label: t('introduction.options-2-7-label'),
              desc: t('introduction.options-2-7-desc'),
              colors: [[DotColor.red, DotColor.blue]],
            },
            {
              label: t('introduction.options-2-8-label'),
              desc: t('introduction.options-2-8-desc'),
              colors: [[DotColor.red, DotColor.blue]],
            },
            {
              label: t('introduction.options-2-9-label'),
              desc: t('introduction.options-2-9-desc'),
              colors: [[DotColor.red, DotColor.blue]],
            },
            {
              label: t('introduction.options-2-10-label'),
              desc: t('introduction.options-2-10-desc'),
              colors: [[DotColor.red, DotColor.blue]],
            },
            {
              label: t('introduction.options-2-11-label'),
              desc: t('introduction.options-2-11-desc'),
              colors: [[DotColor.red, DotColor.blue]],
            },
          ],
          positionInfo: {
            cover: A10_2,
            desc: t('introduction.position-2-desc'),
            title: t('introduction.ll-a10'),
          },
        },
        {
          title: t('introduction.group-3-a10'),
          options: [
            {
              label: t('introduction.options-3-1-label'),
              desc: t('introduction.options-3-1-desc'),
              colors: [[DotColor.red]],
            },
            {
              label: t('introduction.options-3-2-label-a10'),
              desc: t('introduction.options-3-2-desc'),
              colors: [[DotColor.blue]],
            },
            {
              label: t('introduction.options-3-3-label-a10'),
              desc: t('introduction.options-3-3-desc'),
              colors: [[DotColor.green]],
            },
          ],
          positionInfo: {
            cover: A10_3,
            desc: t('introduction.position-3-desc-a10'),
            title: t('introduction.ll-a10'),
          },
        },
      ];
    }

    if (tpl === 'A10S') {
      return [
        {
          title: t('introduction.group-1'),
          options: [
            {
              label: t('introduction.options-1-label'),
              desc: t('introduction.options-1-desc'),
              colors: [[DotColor.red]],
            },
            {
              label: t('introduction.options-2-label'),
              desc: t('introduction.options-2-desc'),
              colors: [[DotColor.red]],
            },
            {
              label: t('introduction.options-3-label'),
              desc: t('introduction.options-3-desc'),
              colors: [[DotColor.black]],
            },
          ],
          positionInfo: {
            cover: A10S_1,
            desc: t('introduction.position-1-desc'),
            title: t('introduction.ll-a10s'),
          },
        },
        {
          title: t('introduction.group-2'),
          options: [
            {
              label: t('introduction.options-2-1-label'),
              desc: t('introduction.options-2-1-desc'),
              colors: [[DotColor.red]],
            },
            {
              label: t('introduction.options-2-2-label'),
              desc: t('introduction.options-2-2-title'),
              colors: [[DotColor.red]],
            },
            {
              label: t('introduction.options-2-3-label'),
              desc: t('introduction.options-2-3-desc'),
              colors: [[DotColor.red]],
            },
            {
              label: t('introduction.options-2-4-label'),
              desc: t('introduction.options-2-4-desc'),
              colors: [[DotColor.blue]],
            },
            {
              label: t('introduction.options-2-5-label'),
              desc: t('introduction.options-2-5-desc'),
              colors: [[DotColor.blue]],
            },
            {
              label: t('introduction.options-2-6-label'),
              desc: t('introduction.options-2-6-desc'),
              colors: [[DotColor.blue]],
            },
            {
              label: t('introduction.options-2-7-label'),
              desc: t('introduction.options-2-7-desc'),
              colors: [[DotColor.red, DotColor.blue]],
            },
            {
              label: t('introduction.options-2-8-label'),
              desc: t('introduction.options-2-8-desc'),
              colors: [[DotColor.red, DotColor.blue]],
            },
            {
              label: t('introduction.options-2-9-label'),
              desc: t('introduction.options-2-9-desc'),
              colors: [[DotColor.red, DotColor.blue]],
            },
            {
              label: t('introduction.options-2-10-label'),
              desc: t('introduction.options-2-10-desc'),
              colors: [[DotColor.red, DotColor.blue]],
            },
            {
              label: t('introduction.options-2-11-label'),
              desc: t('introduction.options-2-11-desc'),
              colors: [[DotColor.red, DotColor.blue]],
            },
          ],
          positionInfo: {
            cover: A10S_2,
            desc: t('introduction.position-2-desc'),
            title: t('introduction.ll-a10s'),
          },
        },
        {
          title: t('introduction.group-3-a10'),
          options: [
            {
              label: t('introduction.options-3-1-label'),
              desc: t('introduction.options-3-1-desc'),
              colors: [[DotColor.red]],
            },
            {
              label: t('introduction.options-3-2-label-a10'),
              desc: t('introduction.options-3-2-desc'),
              colors: [[DotColor.blue]],
            },
            {
              label: t('introduction.options-3-3-label-a10'),
              desc: t('introduction.options-3-3-desc'),
              colors: [[DotColor.green]],
            },
          ],
          positionInfo: {
            cover: A10S_3,
            desc: t('introduction.position-3-desc-a10'),
            title: t('introduction.ll-a10s'),
          },
        },
      ];
    }

    return [];
  }

  return {
    renderGroup,
    createRenderContext,
  };
}
