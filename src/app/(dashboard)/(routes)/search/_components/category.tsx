"use client";

import { Category } from "@prisma/client";
import {
    FcAdvertising,
    FcBusiness,
    FcEngineering,
    FcFilmReel,
    FcIdea,
    FcLinux,
    FcMultipleDevices,
    FcMusic,
    FcOldTimeCamera,
    FcSalesPerformance,
    FcSportsMode
} from "react-icons/fc";
import { IconType } from "react-icons/lib";
import CategoryItem from "./category-item";

interface CategoriesProps {
    items: Category[];
}

const iconMap: Record<Category["name"], IconType> = {
    "Music": FcMusic,
    "Photography": FcOldTimeCamera,
    "Fitness": FcSportsMode,
    "Accounting": FcSalesPerformance,
    "Development": FcMultipleDevices,
    "Filming": FcFilmReel,
    "Engineering": FcEngineering,
    "Design": FcIdea,
    "IT and Software": FcLinux,
    "Marketing": FcSalesPerformance,
    "Business": FcBusiness,
    "Personal Development": FcSportsMode
}

const Categories = ({
    items
}: CategoriesProps) => {
    return (
        <div className="flex items-center gap-x-2 overflow-auto pb-2">
            {items.map((item) => (
                <CategoryItem
                    key={item.id}
                    lable={item.name}
                    icon={iconMap[item.name]}
                    value={item.id}
                />
            ))}
        </div>
    );
}

export default Categories;