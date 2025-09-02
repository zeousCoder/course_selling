import { Button } from "@/components/ui/button";
import { BoxReveal } from "@/components/magicui/box-reveal";

export function BoxRevealDemo() {
    return (
        <div className="size-full px-4 flex flex-col container rounded-xl items-center justify-center overflow-hidden pt-8">
            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                <p className="lg:text-[3.5rem] text-3xl font-semibold">
                    100% Risk-Free Guarantee
                </p>
            </BoxReveal>

            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                <h2 className="mt-[.5rem] text-[1rem]">
                    If you complete the program, apply the methods, and still don't see improvement, you'll get a full refund within 14 days.
                </h2>
            </BoxReveal>

            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                <div className="mt-6">
                    <p>
                        -&gt; 5+ free projects {" "}
                        <span className="font-semibold text-[#5046e6]">React</span>,
                        <span className="font-semibold text-[#5046e6]">Typescript</span>,
                        <span className="font-semibold text-[#5046e6]">Tailwind CSS</span>,
                        and
                        <span className="font-semibold text-[#5046e6]">Motion</span>
                        . <br />
                        -&gt; 100% open-source, and customizable. <br />
                    </p>
                </div>
            </BoxReveal>

            <BoxReveal boxColor={"#5046e6"} duration={0.5}>
                <Button className="mt-[1.6rem] bg-[#5046e6]">Explore</Button>
            </BoxReveal>
        </div>
    );
}
