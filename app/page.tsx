import Image from "next/image";
import Link from "next/link";
import { LuChevronRight } from "react-icons/lu";
import { PiArrowRight } from "react-icons/pi";
import { TbZodiacCancer } from "react-icons/tb";

export default function Home() {
  return (
    <div className=" w-full min-h-screen bg-[#1B1A1D] relative">
      <header className=" w-full flex items-center justify-between px-10 py-8 border-b-[2px] border-white/10 ">
        <div className=" flex items-center space-x-2">
          <TbZodiacCancer className=" text-pink-500" size={42} />
          <h1 className=" text-4xl text-white font-semibold">
            BreastScan<span className=" font-thin">MRI</span>{" "}
          </h1>
        </div>
        <div>
          <div className=" text-white text-sm font-medium space-y-2 uppercase">
            <Link href={"/detect"}>Get Started</Link>

            <div className=" space-y-1">
              <div className=" w-full h-[1px] bg-pink-500 rounded-full" />
              <div className=" w-full h-[1px] bg-blue-500 rounded-full" />
            </div>
          </div>
        </div>
      </header>

      <main className=" w-full min-h-[90vh] pb-20 relative">
        <div className=" w-[2px] h-full absolute right-10 bg-white/20 " />
        <div className=" w-[90%] mx-auto py-10">
          <div className=" flex items-center space-x-3">
            <h2 className="  text-sm text-white/30 font-semibold">Roles</h2>
            <div className=" text-white/30">|</div>
            <h2 className=" uppercase text-white/50 font-semibold">
              healthcare administration
            </h2>
          </div>
        </div>

        <div className=" w-full py-10 flex justify-between relative">
          <div className=" pl-56 w-[60%]">
            <h1 className=" font-extrabold leading-[7rem] tracking-wide text-8xl max-w-[80%] text-white uppercase ">
              diagnosis of your mri images.
            </h1>
            <div className=" pt-10 pl-20 space-y-5">
              <h1 className="  text-white text-5xl max-w-[60%] leading-[4.5rem] uppercase">
                transform your radiology department.
              </h1>

              <p className=" text-white/50 text-lg font-medium max-w-[55%]">
                Acheive clear cancer detection on breast MRI scans. Maximize
                efficiency, make more informed decisions
              </p>

              <div className=" text-white w-fit text-sm pt-10 font-medium space-y-2 uppercase">
                <div className=" flex items-center space-x-6">
                  <Link href={"/"}>Get Started</Link>
                  <PiArrowRight className=" text-white" />
                </div>

                <div className=" space-y-1">
                  <div className=" w-full h-[1px] bg-pink-500 rounded-full" />
                  <div className=" w-full h-[1px] bg-blue-500 rounded-full" />
                </div>
              </div>
            </div>
          </div>
          <LuChevronRight
            className=" text-white/40 absolute right-[36%] rotate-45 -top-2  "
            size={32}
          />
          <LuChevronRight
            className=" text-white/40 absolute right-[36%] -rotate-45 -bottom-2  "
            size={32}
          />
          <div className=" w-[35%] z-50 relative ">
            <Image
              src={"/audrey-m-jackson-cAFpd2vqnPE-unsplash.jpg"}
              alt=""
              fill
              className=" object-center object-cover"
            />
          </div>
        </div>
      </main>

      <footer className=" w-full bottom-0 absolute border-t-2 bg-[#1B1A1D] border-white/20">
        <div className=" w-14 border-r-2 border-white/20 h-6"></div>
      </footer>
    </div>
  );
}
