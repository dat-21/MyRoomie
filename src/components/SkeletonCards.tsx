import { motion } from "framer-motion";

interface SkeletonCardProps {
    count?: number;
}

function SingleSkeleton() {
    return (
        <div className="glass rounded-2xl p-5 flex flex-col gap-4">
            <div className="flex items-start gap-4">
                <div className="w-14 h-14 rounded-2xl skeleton" />
                <div className="flex-1 space-y-2">
                    <div className="h-4 w-28 skeleton" />
                    <div className="h-3 w-20 skeleton" />
                    <div className="h-3 w-32 skeleton" />
                </div>
                <div className="w-16 h-16 rounded-full skeleton" />
            </div>
            <div className="space-y-2">
                <div className="h-3 w-full skeleton" />
                <div className="h-3 w-3/4 skeleton" />
            </div>
            <div className="flex gap-2">
                <div className="h-6 w-16 rounded-full skeleton" />
                <div className="h-6 w-20 rounded-full skeleton" />
                <div className="h-6 w-14 rounded-full skeleton" />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-white/40">
                <div className="space-y-1">
                    <div className="h-3 w-32 skeleton" />
                    <div className="h-3 w-20 skeleton" />
                </div>
                <div className="h-8 w-24 rounded-xl skeleton" />
            </div>
        </div>
    );
}

export default function SkeletonCards({ count = 4 }: SkeletonCardProps) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <motion.div
                    key={i}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.1 }}
                >
                    <SingleSkeleton />
                </motion.div>
            ))}
        </>
    );
}
