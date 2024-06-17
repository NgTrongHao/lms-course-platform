import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {

        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const course = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        if (!course) {
            return new NextResponse("Not found", { status: 404 })
        }

        const unPublishCourse = await db.course.update({
            where: {
                id: params.courseId,
                userId: userId
            },
            data: {
                isPublished: false
            }
        });

        return NextResponse.json(unPublishCourse);

    } catch (error) {
        console.log("[COURSE_ID_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}