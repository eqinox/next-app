"use server";
import { LinkType } from "../types";
import NavLink from "./Navlink";
import ThemeSwitcher from "../ThemeSwitcher";
import { NavLogo } from "./NavLogo";
import { verifyAuth } from "@/lib/auth-db";
import { logout } from "@/lib/actions/auth-actions";

const links: LinkType[] = [{ url: "/blog", label: "Блог" }];

export default async function Navbar() {
  const result = await verifyAuth();
  console.log("res", result);
  let isLoggedIn = result.session?.id;

  if (isLoggedIn && links.findIndex((link) => link.url === "/profile") === -1) {
    links.push({ url: "/profile", label: "Профил" });
  }

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

        {!isLoggedIn && (
          <ul className="ml-2 flex">
            <li>
              <NavLink linkItem={{ url: "/signup", label: "sign up" }}>
                sign up
              </NavLink>
            </li>
          </ul>
        )}
        {isLoggedIn && (
          <ul className="ml-2 flex">
            <li>
              <form action={logout}>
                <button className="text-neutral-300">Logout</button>
              </form>
            </li>
          </ul>
        )}
      </div>
    </div>
  );
}
