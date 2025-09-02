import { cn } from "@/lib/utils";
import { Marquee } from "@/components/magicui/marquee";

const reviews = [
    {
        name: "Jack",
        username: "@jack",
        body: "I've never seen anything like this before. It completely changed the way I work. Highly recommend!",
        img: "https://avatar.vercel.sh/jack",
    },
    {
        name: "Jill",
        username: "@jill",
        body: "Super smooth experience! I saved so much time and effort, it almost feels like cheating.",
        img: "https://avatar.vercel.sh/jill",
    },
    {
        name: "John",
        username: "@john",
        body: "At first I was skeptical, but now I can’t imagine going back. This is a total game-changer.",
        img: "https://avatar.vercel.sh/john",
    },
    {
        name: "Jane",
        username: "@jane",
        body: "The design is beautiful, the performance is flawless, and it actually delivers on its promises.",
        img: "https://avatar.vercel.sh/jane",
    },
    {
        name: "Jenny",
        username: "@jenny",
        body: "I showed this to my team and everyone was blown away. Productivity is up big time.",
        img: "https://avatar.vercel.sh/jenny",
    },
    {
        name: "James",
        username: "@james",
        body: "I’ve tried a lot of tools before, but this one finally feels like it was built with me in mind.",
        img: "https://avatar.vercel.sh/james",
    },
    {
        name: "Sophia",
        username: "@sophia",
        body: "It’s intuitive, fast, and fun to use. Honestly, I look forward to using it every day.",
        img: "https://avatar.vercel.sh/sophia",
    },
    {
        name: "Liam",
        username: "@liam",
        body: "The support team is top-notch. Got help in minutes and was back on track instantly.",
        img: "https://avatar.vercel.sh/liam",
    },
    {
        name: "Olivia",
        username: "@olivia",
        body: "Finally, a product that actually makes my job easier instead of more complicated!",
        img: "https://avatar.vercel.sh/olivia",
    },
    {
        name: "Noah",
        username: "@noah",
        body: "I recommend this to all my colleagues. It’s rare to find something this useful and reliable.",
        img: "https://avatar.vercel.sh/noah",
    },
];


const firstRow = reviews.slice(0, reviews.length / 2);
const secondRow = reviews.slice(reviews.length / 2);

const ReviewCard = ({
    img,
    name,
    username,
    body,
}: {
    img: string;
    name: string;
    username: string;
    body: string;
}) => {
    return (
        <figure
            className={cn(
                "relative h-full w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
                // light styles
                "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
                // dark styles
                "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]",
            )}
        >
            <div className="flex flex-row items-center gap-2">
                <img className="rounded-full" width="32" height="32" alt="" src={img} />
                <div className="flex flex-col">
                    <figcaption className="text-sm font-medium dark:text-white">
                        {name}
                    </figcaption>
                    <p className="text-xs font-medium dark:text-white/40">{username}</p>
                </div>
            </div>
            <blockquote className="mt-2 text-sm">{body}</blockquote>
        </figure>
    );
};

export function MarqueeDemo() {
    return (
        <div className="relative flex w-full flex-col items-center justify-center overflow-hidden">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight pb-10">Program Outcome</h1>
            <Marquee pauseOnHover className="[--duration:20s]">
                {firstRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                ))}
            </Marquee>
            <Marquee reverse pauseOnHover className="[--duration:20s]">
                {secondRow.map((review) => (
                    <ReviewCard key={review.username} {...review} />
                ))}
            </Marquee>
            {/* <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-background"></div>
            <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-background"></div> */}
        </div>
    );
}
