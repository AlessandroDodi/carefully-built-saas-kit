import type { ReactNode } from "react";

import { cn } from "@carefully-built/ui";

import type { AuthLayoutBranding } from "../types";

interface AuthLayoutProps extends AuthLayoutBranding {
  readonly title: string;
  readonly subtitle?: string;
  readonly children: ReactNode;
}

function renderVisual(branding: AuthLayoutBranding): ReactNode {
  if (branding.sidePanel) {
    return branding.sidePanel;
  }

  if (!branding.visual?.backgroundSrc && !branding.visual?.foregroundSrc) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative h-[calc(100vh-3rem)] w-full overflow-hidden rounded-[28px] border border-[#d7d8e4] bg-white xl:h-[calc(100vh-4rem)]",
        branding.classes?.visualFrame,
        branding.visual.className,
      )}
    >
      {branding.visual.backgroundSrc ? (
        <img
          src={branding.visual.backgroundSrc}
          alt=""
          className={cn(
            "absolute inset-0 size-full object-cover object-center",
            branding.visual.backgroundClassName,
          )}
        />
      ) : null}
      {branding.visual.foregroundSrc ? (
        <div
          className={cn(
            "absolute inset-0 flex items-center justify-center p-6 xl:p-8",
            branding.visual.foregroundWrapperClassName,
          )}
        >
          <img
            src={branding.visual.foregroundSrc}
            alt={branding.visual.alt ?? ""}
            className={cn(
              "max-h-full max-w-full object-contain object-center",
              branding.visual.foregroundClassName,
            )}
          />
        </div>
      ) : null}
    </div>
  );
}

export function AuthLayout({
  title,
  subtitle,
  children,
  logo,
  logoHref = "/",
  visual,
  sidePanel,
  className,
  classes,
}: AuthLayoutProps): React.ReactElement {
  const visualContent = renderVisual({ visual, sidePanel, classes });

  return (
    <div className={cn("bg-background min-h-screen", className, classes?.root)}>
      <div
        className={cn(
          "mx-auto grid min-h-screen w-full max-w-[1440px] lg:grid-cols-[minmax(0,1fr)_minmax(480px,46vw)]",
          classes?.grid,
        )}
      >
        <section
          className={cn(
            "relative flex min-h-screen flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 xl:px-24",
            classes?.section,
          )}
        >
          {logo ? (
            <a
              href={logoHref}
              className={cn(
                "absolute top-6 left-1/2 -translate-x-1/2 sm:top-10 lg:top-16",
                classes?.logoLink,
              )}
            >
              {logo}
            </a>
          ) : null}

          <div className={cn("mx-auto w-full max-w-sm space-y-6", classes?.content)}>
            <div className={cn("space-y-2 text-center", classes?.header)}>
              <h1
                className={cn(
                  "text-2xl font-semibold tracking-tight sm:text-3xl",
                  classes?.title,
                )}
              >
                {title}
              </h1>
              {subtitle ? (
                <p className={cn("text-muted-foreground text-sm", classes?.subtitle)}>
                  {subtitle}
                </p>
              ) : null}
            </div>

            {children}
          </div>
        </section>

        {visualContent ? (
          <aside
            className={cn(
              "hidden min-h-screen items-center justify-center p-6 lg:flex xl:p-8",
              classes?.visualAside,
            )}
          >
            {visualContent}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
