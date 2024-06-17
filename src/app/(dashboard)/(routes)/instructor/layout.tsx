import { isInstructor } from "@/lib/instructor";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

const InstructorLayout = ({
    children
}: {
    children: ReactNode;
}) => {
    const { userId } = auth();

    if (!isInstructor(userId)) {
        return redirect("/")
    }

    return (
        <>
            {children}
        </>
    );
}

export default InstructorLayout;