import Image from "next/image"
import electronics from "../public/Frame684.png"
import clothing from "../public/Frame 685.png"
import music from "../public/Frame 686.png"
import perfume from "../public/Frame 687.png"
import { Link } from "next-view-transitions"

const CardGrid = () => {
  return (
    <div className="p-4">
      <div className="flex gap-4 items-center mb-2">
        <div className="w-1 h-10 rounded-t-xl rounded-b-xl bg-red-500 p-4" />
        <h3 className="text-red-500 font-bold">Featured</h3>
      </div>
      <div className="mb-2 p-2">
        <h2 className="text-2xl font-bold tracking-wide">Pick your poison</h2>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-2">
        <Link href={`/products/categories/electronics`}>
          <div className="relative transition scale-100 hover:scale-90 duration-300 ease-in-out transform hover:-skew-y-3 border border-accent overflow-hidden">
            <Image
              src={electronics}
              alt="electronics"
              style={{ objectFit: "cover" }}
            />

            <div className="absolute top-0 right-0 p-6 text-2xl font-bold w-full h-full opacity-0 transition duration-300 ease-in-out hover:opacity-100">
              <span className="text-red-500">E</span>lectronics
            </div>
          </div>
        </Link>
        <div className="flex flex-col gap-2">
          <Link href={`/products/categories/clothing`}>
            <div className="relative transition scale-100 hover:scale-90 duration-300 ease-in-out border border-accent overflow-hidden">
              <Image
                src={clothing}
                alt="clothing"
                style={{ objectFit: "cover" }}
              />

              <div className="absolute top-0 right-0 p-6 text-2xl font-bold w-full h-full opacity-0 transition duration-300 ease-in-out hover:opacity-100 ">
                <span className="text-red-500">C</span>lothing
              </div>
            </div>
          </Link>
          <div className="flex items-center gap-2 justify-evenly">
            <Link href={`/products/categories/music`}>
              <div className="relative transition scale-100 hover:scale-90 duration-300 ease-in-out border border-accent transform hover:-skew-y-3 overflow-hidden">
                <Image src={music} alt="music" style={{ objectFit: "cover" }} />

                <div className="absolute top-0 right-0 p-6 text-2xl font-bold opacity-0 transition duration-300 ease-in-out hover:opacity-100 w-full h-full">
                  <span className="text-red-500">M</span>usic
                </div>
              </div>
            </Link>
            <Link href={`/products/categories/perfume`}>
              <div className="relative transition scale-100 hover:scale-90 duration-300 ease-in-out border border-accent transform hover:skew-y-3 overflow-hidden">
                <Image
                  src={perfume}
                  alt="perfume"
                  style={{ objectFit: "cover" }}
                />

                <div className="absolute top-0 right-0 p-6 text-2xl font-bold w-full h-full opacity-0 transition duration-300 ease-in-out hover:opacity-100">
                  <span className="text-red-500">P</span>erfume
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
export default CardGrid