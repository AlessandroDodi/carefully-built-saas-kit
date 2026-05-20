"use client";

import {
  BookOpen,
  Bug,
  Building2,
  Calculator,
  FolderKanban,
  Globe2,
  Link2,
  ListChecks,
  SearchCheck,
  Settings2,
  Tag,
  User,
} from "lucide-react";
import { parseAsString, useQueryState } from "nuqs";

import { Tabs, TabsContent, TabsList, TabsScrollArea, TabsTrigger } from "@carefully-built/ui";

import { resolveSettingsTab, type SettingsTab } from "./settings-tabs.model";

export interface SettingsTabsProps {
  readonly hasOrganization: boolean;
  readonly initialTab: SettingsTab;
  readonly generalContent: React.ReactNode;
  readonly accountContent: React.ReactNode;
  readonly matchContent?: React.ReactNode;
  readonly integrationsContent?: React.ReactNode;
  readonly pipelineContent?: React.ReactNode;
  readonly websiteContent?: React.ReactNode;
  readonly valuatorContent?: React.ReactNode;
  readonly organizationContent?: React.ReactNode;
  readonly documentationContent?: React.ReactNode;
  readonly reportsContent?: React.ReactNode;
  readonly tagsContent?: React.ReactNode;
  readonly customFieldsContent?: React.ReactNode;
}

export function SettingsTabs({
  hasOrganization,
  initialTab,
  generalContent,
  accountContent,
  matchContent,
  integrationsContent,
  pipelineContent,
  websiteContent,
  valuatorContent,
  organizationContent,
  documentationContent,
  reportsContent,
  tagsContent,
  customFieldsContent,
}: SettingsTabsProps): React.ReactElement {
  const [requestedTab, setRequestedTab] = useQueryState("tab", parseAsString);
  const selectedTab = resolveSettingsTab(requestedTab ?? initialTab, hasOrganization);

  const handleValueChange = (nextTab: string): void => {
    void setRequestedTab(nextTab === initialTab ? null : nextTab);
  };

  return (
    <Tabs value={selectedTab} onValueChange={handleValueChange} className="w-full">
      <TabsScrollArea className="pb-1">
        <TabsList className="min-w-max touch-pan-x">
          <TabsTrigger value="general" className="gap-1.5">
            <Settings2 className="size-3.5" />
            Generale
          </TabsTrigger>
          {hasOrganization && (
            <TabsTrigger value="match" className="gap-1.5">
              <SearchCheck className="size-3.5" />
              Match
            </TabsTrigger>
          )}
          {hasOrganization && (
            <TabsTrigger value="organization" className="gap-1.5">
              <Building2 className="size-3.5" />
              Organizzazione
            </TabsTrigger>
          )}
          <TabsTrigger value="account" className="gap-1.5">
            <User className="size-3.5" />
            Account
          </TabsTrigger>
          {hasOrganization && (
            <TabsTrigger value="integrations" className="gap-1.5">
              <Link2 className="size-3.5" />
              Integrazioni
            </TabsTrigger>
          )}
          {hasOrganization && (
            <TabsTrigger value="pipeline" className="gap-1.5">
              <FolderKanban className="size-3.5" />
              Pipeline
            </TabsTrigger>
          )}
          {hasOrganization && (
            <TabsTrigger value="website" className="gap-1.5">
              <Globe2 className="size-3.5" />
              Website
            </TabsTrigger>
          )}
          {hasOrganization && (
            <TabsTrigger value="valuator" className="gap-1.5">
              <Calculator className="size-3.5" />
              Valutatore
            </TabsTrigger>
          )}
          {hasOrganization && (
            <TabsTrigger value="documentation" className="gap-1.5">
              <BookOpen className="size-3.5" />
              Documentazione
            </TabsTrigger>
          )}
          {hasOrganization && (
            <TabsTrigger value="reports" className="gap-1.5">
              <Bug className="size-3.5" />
              Segnalazioni
            </TabsTrigger>
          )}
          {hasOrganization && (
            <TabsTrigger value="tags" className="gap-1.5">
              <Tag className="size-3.5" />
              Tag
            </TabsTrigger>
          )}
          {hasOrganization && (
            <TabsTrigger value="custom-fields" className="gap-1.5">
              <ListChecks className="size-3.5" />
              Campi
            </TabsTrigger>
          )}
        </TabsList>
      </TabsScrollArea>

      <TabsContent value="general" className="mt-6">
        {generalContent}
      </TabsContent>
      {hasOrganization && matchContent ? (
        <TabsContent value="match" className="mt-6">
          {matchContent}
        </TabsContent>
      ) : null}
      {hasOrganization && organizationContent ? (
        <TabsContent value="organization" className="mt-6">
          {organizationContent}
        </TabsContent>
      ) : null}
      <TabsContent value="account" className="mt-6">
        {accountContent}
      </TabsContent>
      {hasOrganization && integrationsContent ? (
        <TabsContent value="integrations" className="mt-6">
          {integrationsContent}
        </TabsContent>
      ) : null}
      {hasOrganization && pipelineContent ? (
        <TabsContent value="pipeline" className="mt-6">
          {pipelineContent}
        </TabsContent>
      ) : null}
      {hasOrganization && websiteContent ? (
        <TabsContent value="website" className="mt-6">
          {websiteContent}
        </TabsContent>
      ) : null}
      {hasOrganization && valuatorContent ? (
        <TabsContent value="valuator" className="mt-6">
          {valuatorContent}
        </TabsContent>
      ) : null}
      {hasOrganization && documentationContent ? (
        <TabsContent value="documentation" className="mt-6">
          {documentationContent}
        </TabsContent>
      ) : null}
      {hasOrganization && reportsContent ? (
        <TabsContent value="reports" className="mt-6">
          {reportsContent}
        </TabsContent>
      ) : null}
      {hasOrganization && tagsContent ? (
        <TabsContent value="tags" className="mt-6">
          {tagsContent}
        </TabsContent>
      ) : null}
      {hasOrganization && customFieldsContent ? (
        <TabsContent value="custom-fields" className="mt-6">
          {customFieldsContent}
        </TabsContent>
      ) : null}
    </Tabs>
  );
}
