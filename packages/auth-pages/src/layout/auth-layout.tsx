import type { ReactNode } from "react";

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
    <div className="relative h-[calc(100vh-3rem)] w-full overflow-hidden rounded-[28px] border border-[#d7d8e4] bg-white xl:h-[calc(100vh-4rem)]">
      {branding.visual.backgroundSrc ? (
        <img
          src={branding.visual.backgroundSrc}
          alt=""
          className="absolute inset-0 size-full object-cover object-center"
        />
      ) : null}
      {branding.visual.foregroundSrc ? (
        <div className="absolute inset-0 flex items-center justify-center p-6 xl:p-8">
          <img
            src={branding.visual.foregroundSrc}
            alt={branding.visual.alt ?? ""}
            className="max-h-full max-w-full object-contain object-center"
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
}: AuthLayoutProps): React.ReactElement {
  const visualContent = renderVisual({ visual, sidePanel });

  return (
    <div className="bg-background min-h-screen">
      <div className="mx-auto grid min-h-screen w-full max-w-[1440px] lg:grid-cols-[minmax(0,1fr)_minmax(480px,46vw)]">
        <section className="relative flex min-h-screen flex-col justify-center px-6 py-16 sm:px-10 lg:px-16 xl:px-24">
          {logo ? (
            <a
              href={logoHref}
              className="absolute top-6 left-1/2 -translate-x-1/2 sm:top-10 lg:top-16"
            >
              {logo}
            </a>
          ) : null}

          <div className="mx-auto w-full max-w-sm space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {title}
              </h1>
              {subtitle ? (
                <p className="text-muted-foreground text-sm">{subtitle}</p>
              ) : null}
            </div>

            {children}
          </div>
        </section>

        {visualContent ? (
          <aside className="hidden min-h-screen items-center justify-center p-6 lg:flex xl:p-8">
            {visualContent}
          </aside>
        ) : null}
      </div>
    </div>
  );
}
