import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DataTable } from "./_components/data-table";
import { columns } from "./_components/columns";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

// async function getData(): Promise<any[]> {
//     // Fetch data from your API here.
//     return [

//     ]
// }

const CoursesPage = async () => {

    const { userId } = auth();

    if (!userId) {
        return redirect("/");
    }

    const courses = await db.course.findMany({
        where: {
            userId
        },
        orderBy: {
            createAt: "desc"
        }
    });

    return (
        <>
            {/* <div className="p-6">
                <Link href="/instructor/create">
                    <Button>
                        New Course
                    </Button>
                </Link>
            </div> */}
            <div className="p-6">
                <DataTable columns={columns} data={courses} />
            </div>
        </>
    );
}

export default CoursesPage;