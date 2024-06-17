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

        const unPublishChapter = await db.chapter.update({
            where: {
                id: params.chapterId,
                courseId: params.courseId
            },
            data: {
                isPushlised: false
            }
        });

        const publishedChapterInCourse = await db.chapter.findMany({
            where: {
                courseId: params.courseId,
                isPushlised: true
            }
        });

        console.log("PublishChapterExist?", publishedChapterInCourse)

        if (!publishedChapterInCourse.length) {
            await db.course.update({
                where: {
                    id: params.courseId
                },
                data: {
                    isPublished: false
                }
            })
        }

        return NextResponse.json(unPublishChapter);

    } catch (error) {
        console.log("[COURSE_CHAPTER_ID_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}