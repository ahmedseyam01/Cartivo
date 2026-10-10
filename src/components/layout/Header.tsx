import { Suspense } from "react";
import { Logo } from "./Logo";
import { NavLinks } from "./NavLinks";
import { SearchBar } from "./SearchBar";
import { HeaderActions } from "./HeaderActions";

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/75">
      <div className="page-container flex h-16 items-center gap-4">
        <Logo />
        <NavLinks className="ms-4 hidden md:flex" />
        <Suspense>
          <SearchBar className="ms-auto hidden w-full max-w-xs md:block lg:max-w-sm" />
        </Suspense>
        <div className="ms-auto md:ms-0">
          <HeaderActions />
        </div>
      </div>
      <div className="page-container pb-3 md:hidden">
        <Suspense>
          <SearchBar />
        </Suspense>
      </div>
    </header>
  );
}
