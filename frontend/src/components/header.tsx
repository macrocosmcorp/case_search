"use client";

import clsx from "clsx";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";

export default function Header() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-between items-center mt-12 p-0 font-bold text-3xl font-sans">
        <Link href="/">Casearch</Link>
      </div>
      <hr className="w-full border-[1px] border-lines-softest mt-2.5" />
    </div>
  );
}

enum PageSelectorState {
  Disabled,
  Available,
  Active,
}

function PageSelectorButton({
  state,
  text,
  link,
}: {
  state: PageSelectorState;
  text: string;
  link?: string;
}) {
  const router = useRouter();

  const buttonBaseStyle = clsx(
    "flex justify-center items-center w-1/6 h-7 font-sans font-medium gap-1.5"
  );
  const buttonDisabledStyle = clsx(
    "bg-white border-tiny border-lines-soft text-letter-soft cursor-not-allowed"
  );
  const buttonAvailableStyle = clsx(
    "bg-white border-tiny border-lines-dark text-letter-default cursor-pointer"
  );
  const buttonActiveStyle = clsx(
    "bg-white border-tiny border-lines-black text-letter-default cursor-pointer"
  );
  const buttonHoverStyle = clsx(
    "hover:bg-black hover:text-white hover:fill-white hover:border-lines-black"
  );
  let styles = null;
  switch (state) {
    case PageSelectorState.Disabled:
      styles = [buttonDisabledStyle];
      break;
    case PageSelectorState.Available:
      styles = [buttonAvailableStyle, buttonHoverStyle];
      break;
    case PageSelectorState.Active:
      styles = [buttonActiveStyle, buttonHoverStyle];
      break;
  }

  const handleClick = () => {
    if (link) {
      if (link.startsWith("http") || link.startsWith("https")) {
        window.location.href = link; // Navigate to external URL
      } else {
        router.push(link); // Navigate to internal URL
      }
    }
  };

  return (
    <div
      className={clsx(buttonBaseStyle, ...styles, "text-wide")}
      onClick={handleClick}
    >
      {text}
      {state === PageSelectorState.Active && (
        <svg xmlns="http://www.w3.org/2000/svg" width={8} height={8}>
          <circle cx={4.1} cy={3.984} r={3.551} />
        </svg>
      )}
    </div>
  );
}
