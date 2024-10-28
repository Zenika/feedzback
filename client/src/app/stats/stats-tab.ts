// Note: this file contains all types and constants related to stats tabs

import { InputSignal } from '@angular/core';

export type SelectedStatsTab = 'summary' | 'details';

/**
 * List of tabs as they appear in the user interface
 */
export const ORDERED_STATS_TABS = ['summary' satisfies SelectedStatsTab, 'details' satisfies SelectedStatsTab] as const;

export const STATS_TAB_PARAM = 'tab';

export type StatsTabData = Record<typeof STATS_TAB_PARAM, InputSignal<SelectedStatsTab>>;
