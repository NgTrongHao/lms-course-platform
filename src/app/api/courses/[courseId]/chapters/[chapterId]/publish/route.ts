import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
    req: Request,
    { params }: {
        params: {
            courseId: string;
            chapterId: string;
        }
    }
) {
    try {
        const { userId } = auth();

        if (!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const courseOwner = db.course.findUnique({
            where: {
                id: params.courseId,
                userId: userId
            }
        });

        if (!courseOwner) {
            return new NextResponse("Forbidden", { status: 403 })
        }

        const chapter = await db.chapter.findUnique({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            }
        });

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: params.chapterId,
            }
        });

        if (!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl) {
            return new NextResponse("Bad request! Missing required fields!", { status: 400 });
        }

        const publishChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                isPushlised: true
            }
        });

        return NextResponse.json(publishChapter);

    } catch (error) {
        console.log("[COURSE_CHAPTER_ID_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}