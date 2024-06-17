import { db } from "@/lib/db";
import { Category, Course } from "@prisma/client";
import getProgress from "./get-progress";

type CourseWithProgressWithCategory = Course & {
    category: Category | null;
    chapters: { id: string }[];
    progress: number | null;
};

type GetCourses = {
    userId: string;
    title?: string;
    categoryId?: string;
};

const getCourses = async ({
    userId,
    title,
    categoryId
}: GetCourses): Promise<CourseWithProgressWithCategory[]> => {
    try {
        const courses = await db.course.findMany({
            where: {
                isPublished: true,
                title: {
                    contains: title
                },
                categoryId
            },
            include: {
                category: true,
                chapters: {
                    where: {
                        isPushlised: true
                    },
                    select: {
                        id: true
                    }
                },
                purchases: {
                    where: {
                        userId
                    }
                }
            },
            orderBy: {
                createAt: "desc"
            }
        });

        const coursesWithProgess: CourseWithProgressWithCategory[] = await Promise.all(
            courses.map(async course => {
                if (course.purchases.length === 0) {
                    return {
                        ...course,
                        progress: null
                    }
                }

                const progressPercentage = await getProgress(userId, course.id);

                return {
                    ...course,
                    progress: progressPercentage
                };
            })
        );

        return coursesWithProgess;

    } catch (error) {
        console.log("[GET_COURSE]", error);
        return [];
    }
}

export default getCourses;