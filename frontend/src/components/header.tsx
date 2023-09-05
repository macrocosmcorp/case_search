import Link from "next/link";

export default function Header() {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-row justify-between items-center mt-12 p-0 font-medium text-3xl font-sans">
        <Link href="/">Casearch</Link>
      </div>
      <hr className="w-full border-[1px] border-lines-softest mt-2.5" />
    </div>
  );
}
