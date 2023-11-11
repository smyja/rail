"use client";
import { useState } from "react";
import { Group, Code } from "@mantine/core";
import {
  IconBellRinging,
  IconFingerprint,
  IconKey,
  IconSettings,
  Icon2fa,
  IconDatabaseImport,
  IconReceipt2,
  IconSwitchHorizontal,
  IconLogout,
  IconMessageChatbot,
} from "@tabler/icons-react";
import Link from "next/link";
import classes from "./NavbarSimpleColored.module.css";

const data = [
  { link: "/dashboard", label: "Home", icon: IconBellRinging },
  { link: "/dashboard/chat", label: "Chat", icon: IconMessageChatbot },
  { link: "/dashboard/connectors", label: "Connectors", icon: Icon2fa },
  { link: "/billing", label: "Billing", icon: IconReceipt2 },
  { link: "/security", label: "Security", icon: IconFingerprint },
  { link: "/databases", label: "Databases", icon: IconDatabaseImport },
  { link: "/dashboard/settings", label: "Other Settings", icon: IconSettings },
];

export function NavbarSimpleColored() {
  const [active, setActive] = useState("Home");

  return (
    <>
      <div className={classes.navbarMain}>
        {data.map((item) => (
          <Link
            href={item.link}
            key={item.label}
            passHref
            className={classes.link}
            data-active={item.label === active ? true : undefined}
            onClick={() => {
              setActive(item.label);
            }}
          >
            <item.icon className={classes.linkIcon} stroke={1.5} />
            <span>{item.label}</span>
          </Link>
        ))}
      </div>

      <div className={classes.footer}>
        <Link href="/settings" passHref className={classes.link}>
          <IconSwitchHorizontal className={classes.linkIcon} stroke={1.5} />
          <span>Change account</span>
        </Link>

        <a
          href="#"
          className={classes.link}
          onClick={(event) => event.preventDefault()}
        >
          <IconLogout className={classes.linkIcon} stroke={1.5} />
          <span>Logout</span>
        </a>
      </div>
    </>
  );
}
