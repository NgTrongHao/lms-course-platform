const {PrismaClient} = require("@prisma/client");

const db = new PrismaClient();

async function main() {
    try {
        await db.category.createMany({
            data: [
                {name: "Design"},
                {name: "Development"},
                {name: "Marketing"},
                {name: "IT and Software"},
                {name: "Personal Development"},
                {name: "Business"},
                {name: "Photography"},
                {name: "Music"}
            ]
        })
        console.log("Success");
    } catch (error) {
        console.log("Error seeding the database categories", error);
    } finally {
        await db.$disconnect();
    }
}

main();