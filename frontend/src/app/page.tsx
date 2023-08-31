import Block from "@/components/body";
import Footer from "@/components/footer";
import Header from "@/components/header";
import ResultsBlock from "@/components/result";
import SearchInput from "@/components/searchInput";
import { Suspense } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function Home({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams: { [key: string]: string | string[] | undefined };
}) {
  const query = searchParams.q?.toString() || null;
  const id = searchParams.id?.toString() || null;
  return (
    <main className="flex flex-col mx-auto max-w-custom min-h-screen flex-grow pt-4 px-2">
      <Header />
      <SearchInput intitalQuery={query} />
      <div className="flex flex-col w-full my-4 gap-y-8">
        {(query || id) && (
          <Block title="Results">
            <Suspense fallback={<Skeleton count={5} />}>
              {/* @ts-expect-error Server Component */}
              <ResultsBlock query={query} id={id} />
            </Suspense>
          </Block>
        )}
        {!query && !id && (
          <Block title="About">
            <AboutBlock />
          </Block>
        )}
      </div>
      <Footer />
    </main>
  );
}

function AboutBlock() {
  return (
    <div className="w-full px-2 py-1 border-tiny border-lines-soft">
      <p className="text-basesm font-sans font-normal text-letter-default">
        Casearch allows you to semantically search through a corpus of SCOTUS
        opinions. This means you can just describe the situation in your words
        instead of struggling to figure out the right keywords and phrases. Use
        the search bar above, and we&apos;ll find the most relevant opinions for
        you.
      </p>
    </div>
  );
}
