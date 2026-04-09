"use client";

import { cva, type VariantProps } from "class-variance-authority";
import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useState,
} from "react";

import { cn } from "@/lib/utils";

type BannerMode = "normal" | "fight";

const MainBannerContext = createContext<{ mode: BannerMode }>({
  mode: "normal",
});

function useBannerMode() {
  return useContext(MainBannerContext).mode;
}

/* ------------------------------------------------------------------ */
/*  MainBanner (root)                                                  */
/* ------------------------------------------------------------------ */

const bannerVariants = cva("relative select-none", {
  variants: {
    mode: {
      normal: "",
      fight: "",
    },
  },
  defaultVariants: { mode: "normal" },
});

interface MainBannerProps extends VariantProps<typeof bannerVariants> {
  className?: string;
  children?: ReactNode;
}

function MainBanner({ mode = "normal", className, children }: MainBannerProps) {
  return (
    <MainBannerContext.Provider value={{ mode: mode ?? "normal" }}>
      <div
        className={cn(
          bannerVariants({ mode }),
          "w-[calc(750px*var(--resolution-factor))]",
          "h-[calc(125px*var(--resolution-factor))]",
          className,
        )}
      >
        {/* Background bar */}
        <div
          className={cn(
            "absolute bg-main-banner-bg",
            "left-[calc(7.5px*var(--resolution-factor))]",
            "top-0",
            "w-[calc(742px*var(--resolution-factor))]",
            "h-[calc(125px*var(--resolution-factor))]",
          )}
        />

        {/* White top-right header area */}
        <div
          className={cn(
            "absolute bg-main-banner-header-bg",
            "left-[calc(422.5px*var(--resolution-factor))]",
            "top-0",
            "w-[calc(327px*var(--resolution-factor))]",
            "h-[calc(40px*var(--resolution-factor))]",
          )}
        />

        {/* Chat input bar background */}
        <div
          className={cn(
            "absolute bg-main-banner-chat-input-bg",
            "left-[calc(7.5px*var(--resolution-factor))]",
            "top-[calc(104px*var(--resolution-factor))]",
            "w-[calc(415px*var(--resolution-factor))]",
            "h-[calc(21px*var(--resolution-factor))]",
          )}
        />

        {children}
      </div>
    </MainBannerContext.Provider>
  );
}

/* ------------------------------------------------------------------ */
/*  MainBannerChat                                                     */
/* ------------------------------------------------------------------ */

function MainBannerChat({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute overflow-hidden",
        "left-[calc(8px*var(--resolution-factor))]",
        "top-[calc(1px*var(--resolution-factor))]",
        "w-[calc(412px*var(--resolution-factor))]",
        "h-[calc(103px*var(--resolution-factor))]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function MainBannerChatInput({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      type="text"
      className={cn(
        "absolute bg-transparent text-main-banner-circle-bg font-[Verdana,sans-serif] outline-none",
        "left-[calc(28.5px*var(--resolution-factor))]",
        "top-[calc(107px*var(--resolution-factor))]",
        "w-[calc(385px*var(--resolution-factor))]",
        "h-[calc(16px*var(--resolution-factor))]",
        "text-[calc(10px*var(--resolution-factor))]",
        className,
      )}
      {...props}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  MainBannerCircle                                                   */
/* ------------------------------------------------------------------ */

function MainBannerCircle({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const mode = useBannerMode();
  const [expanded, setExpanded] = useState(false);
  const isExpanded = mode === "normal" && expanded;

  return (
    <div
      role="none"
      className={cn(
        "absolute z-10",
        "left-[calc(360px*var(--resolution-factor))]",
        "top-[calc(6px*var(--resolution-factor))]",
        "w-[calc(119px*var(--resolution-factor))]",
        "h-[calc(119px*var(--resolution-factor))]",
        className,
      )}
      onMouseEnter={() => setExpanded(true)}
      onMouseLeave={() => setExpanded(false)}
    >
      <div
        className={cn(
          "absolute rounded-full",
          "left-[calc(-5px*var(--resolution-factor))]",
          "top-0",
          "w-[calc(119px*var(--resolution-factor))]",
          "h-[calc(119px*var(--resolution-factor))]",
          "bg-(--main-banner-circle-shadow)",
        )}
      />
      <div
        className={cn(
          "absolute rounded-full",
          "left-[calc(5px*var(--resolution-factor))]",
          "top-0",
          "w-[calc(119px*var(--resolution-factor))]",
          "h-[calc(119px*var(--resolution-factor))]",
          "bg-(--main-banner-circle-shadow)",
        )}
      />
      <div
        className={cn(
          "absolute rounded-full bg-main-banner-circle-border",
          "left-0 top-0",
          "w-[calc(119px*var(--resolution-factor))]",
          "h-[calc(119px*var(--resolution-factor))]",
        )}
      />
      <div
        className={cn(
          "absolute rounded-full bg-main-banner-circle-bg",
          "left-[calc(4px*var(--resolution-factor))]",
          "top-[calc(4px*var(--resolution-factor))]",
          "w-[calc(111px*var(--resolution-factor))]",
          "h-[calc(111px*var(--resolution-factor))]",
        )}
      />
      <div
        className={cn(
          "absolute rounded-full bg-main-banner-circle-border",
          "left-[calc(19.5px*var(--resolution-factor))]",
          "top-[calc(19.5px*var(--resolution-factor))]",
          "w-[calc(80px*var(--resolution-factor))]",
          "h-[calc(80px*var(--resolution-factor))]",
        )}
      />
      <div
        className={cn(
          "absolute rounded-full bg-main-banner-circle-viewport overflow-hidden transition-transform",
          "left-[calc(22.5px*var(--resolution-factor))]",
          "top-[calc(22.5px*var(--resolution-factor))]",
          "w-[calc(74px*var(--resolution-factor))]",
          "h-[calc(74px*var(--resolution-factor))]",
          isExpanded && "scale-125",
        )}
      >
        {children}
      </div>
      <svg
        className={cn(
          "absolute pointer-events-none",
          "left-[calc(3px*var(--resolution-factor))]",
          "top-[calc(3px*var(--resolution-factor))]",
          "w-[calc(113px*var(--resolution-factor))]",
          "h-[calc(113px*var(--resolution-factor))]",
        )}
        viewBox="0 0 113 113"
        fill="none"
        role="presentation"
        imageRendering="optimizeQuality"
      >
        <line
          x1="0.5"
          y1="56.5"
          x2="112.5"
          y2="56.5"
          stroke="white"
          strokeWidth="1"
        />
        <line
          x1="56.5"
          y1="0.5"
          x2="56.5"
          y2="112.5"
          stroke="white"
          strokeWidth="1"
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MainBannerHeart                                                    */
/* ------------------------------------------------------------------ */

const HEART_PATH =
  "M6.7 -17.9L13 -18.15Q20 -15.5 20.7 -9.2Q21.4 -3.3 18 1.95Q14.7 7.1 10.05 11.4Q5.7 15.35 0.5 18.55L-0.5 18.55Q-5.75 15.35 -10.1 11.4Q-14.75 7.1 -18.05 2Q-21.4 -3.25 -20.7 -9.2Q-20 -15.45 -13 -18.1L-6.75 -17.8L-0.45 -15.25L0.55 -15.25L6.7 -17.9";

function MainBannerHeart({
  className,
  hp = 100,
  children,
}: {
  className?: string;
  hp?: number;
  children?: ReactNode;
}) {
  const clipId = useId();
  const fillY = 19.55 - (hp / 100) * 39.1;

  return (
    <div
      className={cn(
        "absolute z-10",
        "left-[calc(394px*var(--resolution-factor))]",
        "top-[calc(-4px*var(--resolution-factor))]",
        "w-[calc(50px*var(--resolution-factor))]",
        "h-[calc(39px*var(--resolution-factor))]",
        className,
      )}
    >
      <svg
        className="w-full h-full"
        viewBox="-21.8 -19.55 43.6 39.1"
        fill="none"
        role="presentation"
        imageRendering="optimizeQuality"
      >
        <path d={HEART_PATH} fill="#ffff66" />
        <defs>
          <clipPath id={clipId}>
            <path d={HEART_PATH} />
          </clipPath>
        </defs>
        <rect
          x="-22"
          y={fillY}
          width="44"
          height={39.1}
          fill="#d80101"
          clipPath={`url(#${clipId})`}
        />
        <path
          d={HEART_PATH}
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="4.8" cy="-8.8" r="3" fill="white" fillOpacity="0.3" />
        <ellipse
          cx="-11.7"
          cy="-5.9"
          rx="5.7"
          ry="5.8"
          fill="white"
          fillOpacity="0.3"
        />
        <path
          d="M9.6 -16.4L7.6 -16.75Q10.5 -17.55 12.8 -16.8Q19.3 -14.35 19.95 -8.5Q20.55 -3 17.45 1.9Q14.35 6.65 10.05 10.65Q6 14.35 1.15 17.3L0.25 17.3Q-4.65 14.35 -8.7 10.65Q-13 6.65 -16.05 1.9Q-17.25 0.05 -17.9 -1.85L-16.6 0.6Q-13.85 4.9 -9.9 8.5Q-6.2 11.9 -1.8 14.6L-0.95 14.6Q3.45 11.9 7.15 8.5Q11.05 4.9 13.85 0.55Q16.7 -3.85 16.15 -8.85Q15.5 -14.2 9.6 -16.4"
          fill="#660000"
          fillOpacity="0.32"
        />
      </svg>
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  MainBannerButtons                                                  */
/* ------------------------------------------------------------------ */

/** Button x-positions from ffdec export (banner-local coords) */
const BUTTON_POSITIONS = [
  483.5, 512.75, 542, 571.25, 600.5, 629.75, 659, 688.25, 717.5,
];

function MainBannerButtons({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const childArray = Array.isArray(children)
    ? children
    : children
      ? [children]
      : [];

  return (
    <div className={cn("absolute", className)}>
      {childArray.map((child, i) => (
        <div
          key={BUTTON_POSITIONS[i] ?? i}
          className="absolute"
          style={{
            left: `calc(${BUTTON_POSITIONS[i] ?? 483.5 + i * 29.25}px * var(--resolution-factor))`,
            top: "calc(8px * var(--resolution-factor))",
          }}
        >
          {child}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  InlineSvg                                                          */
/* ------------------------------------------------------------------ */

const svgCache = new Map<string, string>();

function InlineSvg({ src, className }: { src: string; className?: string }) {
  const uid = useId();
  const [svg, setSvg] = useState(() => svgCache.get(src));

  useEffect(() => {
    if (svgCache.has(src)) {
      setSvg(svgCache.get(src));
      return;
    }
    fetch(src)
      .then((r) => r.text())
      .then((text) => {
        svgCache.set(src, text);
        setSvg(text);
      });
  }, [src]);

  if (!svg) return null;

  // Make IDs unique per instance to avoid DOM clashes
  const prefix = uid.replace(/:/g, "");
  const uniqueSvg = svg
    .replace(
      /(id="|href="#|url\(#)(object-|gradient-|sprite)/g,
      `$1${prefix}-$2`,
    )
    .replace(/<svg /, '<svg image-rendering="optimizeQuality" ');

  return (
    <span
      className={className}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: trusted SVG from public/
      dangerouslySetInnerHTML={{ __html: uniqueSvg }}
    />
  );
}

/* ------------------------------------------------------------------ */
/*  MainBannerIconButton                                               */
/* ------------------------------------------------------------------ */

function MainBannerIconButton({
  className,
  icon,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: string;
}) {
  return (
    <button
      type="button"
      className={cn(
        "group relative cursor-pointer border-none bg-transparent p-0 overflow-visible",
        "w-[calc(26px*var(--resolution-factor))]",
        "h-[calc(26px*var(--resolution-factor))]",
        "[--ns-stroke:calc(1/var(--resolution-factor))]",
        className,
      )}
      {...props}
    >
      <InlineSvg
        src="/icons/banner/button-up.svg"
        className="absolute inset-0 w-full h-full [&_svg]:w-full [&_svg]:h-full group-active:hidden"
      />
      <InlineSvg
        src="/icons/banner/button-down.svg"
        className="absolute inset-0 w-full h-full [&_svg]:w-full [&_svg]:h-full hidden group-active:block"
      />
      <InlineSvg
        src={icon}
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none scale-(--resolution-factor)"
      />
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  MainBannerMorePanel                                                */
/* ------------------------------------------------------------------ */

/** Vertical x-positions for more buttons (from ffdec: all at x=717.5, spaced 28px) */
const MORE_BUTTON_Y = [-140, -112, -84, -56, -28];

function MainBannerMorePanel({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const childArray = Array.isArray(children)
    ? children
    : children
      ? [children]
      : [];

  return (
    <>
      {/* Toggle button at the 9th slot */}
      <div
        className={cn(
          "absolute",
          "left-[calc(717.5px*var(--resolution-factor))]",
          "top-[calc(8px*var(--resolution-factor))]",
        )}
      >
        <MainBannerIconButton
          icon={`/icons/banner/${open ? "less" : "more"}.svg`}
          onClick={() => setOpen((o) => !o)}
        />
      </div>

      {/* Panel — anchored to banner top, grows upward */}
      {open && (
        <div
          className={cn(
            "absolute z-20 bottom-full",
            "left-[calc(712px*var(--resolution-factor))]",
            className,
          )}
        >
          <div
            className={cn(
              "relative bg-main-banner-bg",
              "border-x-2 border-t-2 border-main-banner-circle-border border-b-0",
              "rounded-t-[calc(10px*var(--resolution-factor))]",
              "flex flex-col items-center",
              "gap-[calc(2px*var(--resolution-factor))]",
              "p-[calc(5px*var(--resolution-factor))]",
            )}
          >
            {childArray.map((child, i) => (
              <div key={MORE_BUTTON_Y[i] ?? i}>{child}</div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Other layout components                                            */
/* ------------------------------------------------------------------ */

function MainBannerRightPanel({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute bg-main-banner-panel-bg overflow-hidden",
        "left-[calc(471.6px*var(--resolution-factor))]",
        "top-[calc(49px*var(--resolution-factor))]",
        "w-[calc(252px*var(--resolution-factor))]",
        "h-[calc(64px*var(--resolution-factor))]",
        "[clip-path:polygon(0%_0.3%,78.3%_0.08%,84.9%_0.08%,100%_0%,100%_100%,21.2%_100%,19.8%_97.7%,19.3%_93.1%,19.2%_54.4%,0%_54.7%)]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function MainBannerSpells({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div
      className={cn(
        "absolute",
        "left-[calc(487px*var(--resolution-factor))]",
        "top-[calc(41px*var(--resolution-factor))]",
        "w-[calc(245px*var(--resolution-factor))]",
        "h-[calc(88px*var(--resolution-factor))]",
        className,
      )}
    >
      {children}
    </div>
  );
}

function MainBannerFightControls({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const mode = useBannerMode();
  if (mode !== "fight") return null;

  return (
    <div
      className={cn(
        "absolute flex items-center",
        "left-[calc(403px*var(--resolution-factor))]",
        "top-[calc(88px*var(--resolution-factor))]",
        "gap-[calc(4px*var(--resolution-factor))]",
        "h-[calc(24px*var(--resolution-factor))]",
        className,
      )}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Exports                                                            */
/* ------------------------------------------------------------------ */

export {
  MainBanner,
  MainBannerButtons,
  MainBannerChat,
  MainBannerChatInput,
  MainBannerCircle,
  MainBannerFightControls,
  MainBannerHeart,
  MainBannerIconButton,
  MainBannerMorePanel,
  MainBannerRightPanel,
  MainBannerSpells,
};
