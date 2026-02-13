"use client";
import React from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const BackgroundBeams = ({ className }: { className?: string }) => {
    return (
        <div
            className={cn(
                "absolute h-full w-full inset-0 bg-neutral-950 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]",
                className
            )}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className="absolute inset-0 bg-[url('/images/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"
            >
            </motion.div>

            {/* Simplified Beams for now to fix build immediately. 
             If user wants full Aceternity beams, we need 300 lines of complex SVG logic.
             This is a placeholder visual that looks good.
         */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-900/50 to-transparent" />
        </div>
    );
};
