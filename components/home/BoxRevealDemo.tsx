import { Button } from "@/components/ui/button";
import { BoxReveal } from "@/components/magicui/box-reveal";
import Link from "next/link";
import ShimmerText from "../ShimmerText";

export function BoxRevealDemo() {
  return (
    <div className="size-full px-4 flex flex-col container rounded-xl items-center justify-center overflow-hidden pt-8">
      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <p className="lg:text-[3.5rem] text-3xl font-semibold">
          Success Favors the Committed
        </p>
      </BoxReveal>

      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <h2 className="mt-[.5rem] text-[1rem] max-w-2xl w-full text-center">
          True growth comes from consistent effort and smart learning. Over 95%
          of our students improve their technical and analytical skills by
          following the course structure and working on practical projects.
          Follow the course step-by-step, apply what you learn, and keep
          progressing every day.
        </h2>
      </BoxReveal>

      {/* <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <div className="mt-6">
          <p>
            -&gt; 5+ free projects{" "}
            <span className="font-semibold text-[#5046e6]">React</span>,
            <span className="font-semibold text-[#5046e6]">Typescript</span>,
            <span className="font-semibold text-[#5046e6]">Tailwind CSS</span>,
            and
            <span className="font-semibold text-[#5046e6]">Motion</span>
            . <br />
            -&gt; 100% open-source, and customizable. <br />
          </p>
        </div>
      </BoxReveal> */}

      <BoxReveal boxColor={"#5046e6"} duration={0.5}>
        <Link href={"/pricing"}>
          <Button className="mt-[1.6rem] bg-[#5046e6]">Explore</Button>
        </Link>
      </BoxReveal>
    </div>
  );
}
