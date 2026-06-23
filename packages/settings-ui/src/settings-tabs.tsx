"use client";

import { parseAsString, useQueryState } from "nuqs";
import type { ReactNode } from "react";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsScrollArea,
  TabsTrigger,
} from "@carefully-built/ui";

import { resolveSettingsTab, type SettingsTab } from "./settings-tabs.model";

export interface SettingsTabItem {
  readonly value: SettingsTab;
  readonly label: ReactNode;
  readonly content: ReactNode;
  readonly icon?: ReactNode;
}

export interface SettingsTabsProps {
  readonly initialTab: SettingsTab;
  readonly tabs: readonly SettingsTabItem[];
  readonly queryParam?: string;
}

export function SettingsTabs({
  initialTab,
  tabs,
  queryParam = "tab",
}: SettingsTabsProps): React.ReactElement {
  const [requestedTab, setRequestedTab] = useQueryState(
    queryParam,
    parseAsString,
  );
  const selectedTab = resolveSettingsTab(
    requestedTab ?? initialTab,
    tabs,
    initialTab,
  );

  const handleValueChange = (nextTab: string): void => {
    void setRequestedTab(nextTab === initialTab ? null : nextTab);
  };

  return (
    <Tabs
      value={selectedTab}
      onValueChange={handleValueChange}
      className="w-full flex-col"
    >
      <TabsScrollArea className="max-w-full pb-1">
        <TabsList className="min-w-max touch-pan-x">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="gap-1.5">
              {tab.icon}
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </TabsScrollArea>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value} className="mt-6 w-full">
          {tab.content}
        </TabsContent>
      ))}
    </Tabs>
  );
}
