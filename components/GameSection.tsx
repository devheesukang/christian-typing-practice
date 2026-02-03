import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
    noMargin?: boolean;
};

export default function GameSection({ className = "", children, noMargin = false, ...props }: Props) {
    return (
        <div {...props} className={`game-section ${className}`}>
            <div className={noMargin ? "" : "m-3"} style={{ height: "-webkit-fill-available" }}>
                {children}
            </div>
        </div>
    );
}
