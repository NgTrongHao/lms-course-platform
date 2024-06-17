import { isInstructor } from "@/lib/instructor";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

const handleAuth = () => {
    const { userId } = auth();

    const isAuthorised = isInstructor(userId);

    if (!userId || !isAuthorised) throw new Error("Unauthorized");
    return { userId };
}

export const ourFileRouter = {
    courseImage: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
        .middleware(() => auth())
        .onUploadComplete(() => { }),
    courseAttachement: f(["text", "image", "video", "audio", "pdf"])
        .middleware(() => handleAuth())
        .onUploadComplete(() => { }),
    chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "1024GB" } })
        .middleware(() => handleAuth())
        .onUploadComplete(() => { })
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;