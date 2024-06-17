"use client"

import { useAuth, UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { Button } from "./ui/button";
import { LogOut } from "lucide-react";
import Link from "next/link";
import SearchInput from "./search-input";
import { isInstructor } from "@/lib/instructor";

const NavbarRoutes = () => {

    const { userId } = useAuth();

    const pathName = usePathname()

    const isInstructorPage = pathName?.startsWith("/instructor")
    const isPlayerPage = pathName?.includes("/courses")
    const isSearchPage = pathName === "/search";

    return (
        <>
            {isSearchPage && (
                <div className="hidden md:block">
                    <SearchInput />
                </div>
            )}
            <div className="flex gap-x-2 ml-auto">
                {isInstructorPage || isPlayerPage ? (
                    <Link href="/search">
                        <Button size="sm" variant="ghost">
                            <LogOut className="h-4 w-4 mr-2" />
                            Exit
                        </Button>
                    </Link>
                ) : isInstructor(userId) ? (
                    <Link href="/instructor/courses">
                        <Button size="sm" variant="ghost">
                            Teach on Cursus
                        </Button>
                    </Link>
                ) : null}
                <UserButton
                    afterSignOutUrl="/"
                />
            </div>
        </>
    );
}

export default NavbarRoutes;