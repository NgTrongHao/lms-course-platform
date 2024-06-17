import { IconBagde } from "@/components/icon-badge";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, CircleDollarSign, File, LayoutDashboard, ListChecks } from "lucide-react";
import { redirect } from "next/navigation";
import TitleForm from "./_components/title-form";
import DescriptionForm from "./_components/description-form";
import ImageForm from "./_components/image-form";
import CategoryForm from "./_components/category-form";
import PriceForm from "./_components/price-form";
import AttachementForm from "./_components/attachment-form";
import ChapterForm from "./_components/chapter-form";
import { Banner } from "@/components/banner";
import CourseActions from "./_components/course-actions";
import Link from "next/link";

const CourseIdPage = async ({
    params
}: {
    params: { courseId: string }
}) => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const course = await db.course.findUnique({
        where: {
            id: params.courseId
        },
        include: {
            chapters: {
                orderBy: {
                    position: "asc"
                }
            },
            attachments: {
                orderBy: {
                    createAt: "desc"
                }
            }
        }
    });

    if (!course) {
        return redirect("/");
    }

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    }) || [];

    const requiredFields = [
        course.title,
        course.description,
        course.imageUrl,
        course.price,
        course.categoryId,
        course.chapters.some(chapter => chapter.isPushlised)
    ];

    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter(Boolean).length;
    const completionText = `(${completedFields}/${totalFields})`

    const isComplete = requiredFields.every(Boolean);

    return (
        <>
            {!course.isPublished && (
                <Banner
                    label="This course is unpublished. It will not visible to others."
                />
            )}
            <div className="p-6">
                {/* Course Id: {params.courseId} */}
                <Link
                    href={`/instructor/courses`}
                    className="flex items-center text-sm hover:opacity-75 transition mb-6"
                >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to courses
                </Link>
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-y-2">
                        <h1 className="text-2xl font-medium">
                            Course Setup
                        </h1>
                        <span className="text-sm text-slate-700">
                            Complete all fields {completionText}
                        </span>
                    </div>
                    <CourseActions
                        disabled={!isComplete}
                        courseId={params.courseId}
                        isPublished={course.isPublished}
                    />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
                    <div>
                        <div className="flex items-center gap-x-2">
                            <IconBagde icon={LayoutDashboard} />
                            <h2 className="text-xl">
                                Customise your course
                            </h2>
                        </div>
                        <TitleForm initialData={course} courseId={course.id} />
                        <DescriptionForm initialData={course} courseId={course.id} />
                        <ImageForm initialData={course} courseId={course.id} />
                        <CategoryForm
                            initialData={course}
                            courseId={course.id}
                            options={categories.map((category) => ({
                                label: category.name,
                                value: category.id
                            }))}
                        />
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBagde icon={ListChecks} />
                                <h2 className="text-xl">
                                    Cousre Chapter
                                </h2>
                            </div>
                            <ChapterForm initialData={course} courseId={course.id} />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBagde icon={CircleDollarSign} />
                                <h2 className="text-xl">Sell my course</h2>
                            </div>
                            <PriceForm initialData={course} courseId={course.id} />
                        </div>
                        <div>
                            <div className="flex items-center gap-x-2">
                                <IconBagde icon={File} />
                                <h2 className="text-xl">Resources and Attachments</h2>
                            </div>
                            <AttachementForm initialData={course} courseId={course.id} />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CourseIdPage;