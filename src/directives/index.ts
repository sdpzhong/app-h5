/**
 * Configure and register global directives
 */
import type { App } from 'vue';
import RippleDirective from '@/directives/ripple';
import LongPressDirective from '@/directives/longpress';
import htmlRemDirective from '@/directives/htmlRem';

export * from '@/directives/ripple';
export * from '@/directives/longpress';
export * from '@/directives/htmlRem';

export function setupGlobDirectives(app: App) {
  app.directive('ripple', RippleDirective);
  app.directive('long-press', LongPressDirective);
  app.directive('html-rem', htmlRemDirective);
}
