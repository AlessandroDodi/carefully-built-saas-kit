import type { ActivityCalendarScope } from './activity-helpers';

export function getActivityCalendarScopeForViewport(
  scope: ActivityCalendarScope,
  isMobile: boolean,
): ActivityCalendarScope {
  return isMobile ? 'day' : scope;
}

export function shouldShowActivityCalendarScopeControls(isMobile: boolean): boolean {
  return !isMobile;
}
