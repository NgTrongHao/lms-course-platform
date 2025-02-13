import { db } from "@/lib/db";
import { isInstructor } from "@/lib/instructor";
import { auth } from "@clerk/nextjs/server";
import { log } from "console";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { courseId: string } }
) {
    try {

        const { userId } = auth();
        const { title } = await req.json();

        if (!userId || !isInstructor(userId)) {
            return new NextResponse("Unathorized", { status: 401 })
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        })

        if (!courseOwner) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        const lastChapter = await db.chapter.findFirst({
            where: {
                courseId: params.courseId
            },
            orderBy: {
                position: "desc"
            }
        });

        const newPosition = lastChapter ? lastChapter.position + 1 : 1;

        const chapter = await db.chapter.create({
            data: {
                title,
                courseId: params.courseId,
                position: newPosition
            }
        });

        return NextResponse.json(chapter);

    } catch (error) {
        log("[CHAPTERS]", error);
        return new NextResponse("Internal Error", { status: 500 })
    }
}