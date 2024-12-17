import { LinkType } from "../types";
import NavLink from "./Navlink";
import ThemeSwitcher from "../ThemeSwitcher";
import { NavLogo } from "./NavLogo";

const links: LinkType[] = [
  { url: "/news", label: "Новини" },
  { url: "/test", label: "Тест" },
];

export default function Navbar() {
  return (
    <div className="relative flex h-20 items-center bg-orange-900">
      <div className="relative ml-10 inline-block h-10 w-20 text-center">
        <NavLogo />
      </div>
      <div className="absolute right-0 mr-10 flex">
        <ul className="flex gap-4">
          {links.map((link, index) => (
            <li className="" key={index}>
              <NavLink linkItem={link}>{link.label}</NavLink>
            </li>
          ))}
        </ul>
        <div className="ml-3">
          <ThemeSwitcher />
        </div>
      </div>
    </div>
  );
}
