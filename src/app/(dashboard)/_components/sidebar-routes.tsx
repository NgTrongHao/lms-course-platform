"use client"

import { BarChart, Compass, Layout, List } from "lucide-react";
import SidebarItem from "./sidebar-item";
import { usePathname } from "next/navigation";

const guestRoutes = [
    {
        icon: Layout,
        label: "Dashboard",
        href: "/"
    },
    {
        icon: Compass,
        label: "Browse",
        href: "/search"
    }
]

const instructorRoutes = [
    {
        icon: List,
        label: "Courses",
        href: "/instructor/courses"
    },
    {
        icon: BarChart,
        label: "Analytics",
        href: "/instructor/analytics"
    }
]

export const SidebarRoutes = () => {

    const pathName = usePathname()

    const isInstructorPage = pathName?.includes("/instructor")

    const routes = isInstructorPage ? instructorRoutes : guestRoutes;

    return (
        <div className="flex flex-col w-full">
            {routes.map((route) => (
                <SidebarItem
                    key={route.href}
                    icon={route.icon}
                    label={route.label}
                    href={route.href}
                />
            ))}
        </div>
    );
}