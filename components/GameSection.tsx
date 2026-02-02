import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement>;

export default function GameSection({ className = "", children, ...props }: Props) {
    return (
        <div {...props} className={`game-border ${className}`}>
            <div className="m-3 w-full h-full">
                {children}
            </div>
        </div>
    );
}
