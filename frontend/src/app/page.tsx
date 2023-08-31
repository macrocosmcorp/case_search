import Block from "@/components/body";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { MonospaceLabel, MonospaceLink } from "@/components/label";
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
  return (
    <main className="flex flex-col mx-auto max-w-custom min-h-screen flex-grow pt-4 px-2">
      <Header />
      <SearchInput intitalQuery={query} />
      <div className="flex flex-col w-full my-4 gap-y-8">
        {query && (
          <Block title="Results">
            <Suspense fallback={<Skeleton count={5} />}>
              <ResultsBlock query={query} />
            </Suspense>
          </Block>
        )}
        {!query && (
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
        This website allows you to semantically search through a corpus of
        SCOTUS opinions. This means you can just describe the situation in your
        words instead of struggling to figure out the right keywords and
        phrases. Use the search bar above, and we'll find the most relevant
        opinions for you.
      </p>
    </div>
  );
}

async function getResults(query: string) {
  const res = await fetch("http://127.0.0.1:5000/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query: query }),
  });

  return await res.json();
}

async function ResultsBlock({ query }: { query: string | null }) {
  if (query === null) return null;
  const results = await getResults(query);

  return (
    <div className="w-full flex flex-col gap-4">
      {results.map((result, i) => (
        <Result data={JSON.parse(result)} key={i} />
      ))}
    </div>
  );
}

function Result({ data }: { data: any }) {
  if (!data) return null;
  return (
    <div className="grid grid-cols-[1fr_100px] w-full grid-rows-1 gap-x-6 p-2 border-tiny border-lines-soft text-basesm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center gap-2">
          <div className="font-sans text-lg font-bold text-letter-default">
            {data.case_name || "No Case Name"}
          </div>
          <div>
            {data.absolute_url && (
              <MonospaceLink
                text="Go to case"
                color="green"
                width={120}
                link={data.absolute_url}
              />
            )}
          </div>
        </div>
        <div className="lines-3 text-sm">{data.text || "No Text"}</div>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <div className="font-sans font-bold text-letter-default">
            Date Filed
          </div>
          <div>{data.date_filed || "No Date"}</div>
        </div>
        <div>
          <div className="font-sans font-bold text-letter-default">
            Category
          </div>
          <div>{beautify(data.category || "No Category")}</div>
        </div>
      </div>
    </div>
  );
}

function beautify(str: string) {
  if (str === "") {
    return "";
  }

  const words = str.split("_");
  const firstWord = words[0].charAt(0).toUpperCase() + words[0].slice(1);
  const remainingWords = words.slice(1).join(" ");

  if (words.length === 1) {
    return firstWord;
  }

  return firstWord + " " + remainingWords;
}

interface DownloadRowProps {
  date: string;
  description: string;
  documents: string;
  size: string;
  link: string;
}

function DownloadRow({
  date,
  description,
  documents,
  size,
  link,
}: DownloadRowProps) {
  return (
    <div className="grid grid-cols-downloadRow text-basesm font-sans font-normal text-letter-default border-b-lines-soft border-b-tiny h-[29px] items-center">
      <div className="pl-1">
        <MonospaceLabel text={date} color="grey" width={98} />
      </div>
      <div className="overflow-hidden overflow-ellipsis whitespace-nowrap pr-1">
        {description}
      </div>
      <div>
        <MonospaceLabel text={documents} color="blue" width={98} />
      </div>
      <div>
        <MonospaceLabel text={size} color="yellow" width={98} />
      </div>
      <div>
        <MonospaceLink text="DOWNLOAD" color="red" width={98} link={link} />
      </div>
    </div>
  );
}

interface VoteRowProps {
  description: string;
  documents: string;
  size: string;
  link: string;
}

function VoteRow({ description, documents, size, link }: VoteRowProps) {
  return (
    <div className="grid grid-cols-downloadRow text-basesm font-sans font-normal text-letter-default border-b-lines-soft border-b-tiny h-[29px] items-center">
      <div className="pl-1">
        <MonospaceLabel text="??????" color="grey" width={98} />
      </div>
      <div className="overflow-hidden overflow-ellipsis whitespace-nowrap pr-1">
        {description}
      </div>
      <div>
        <MonospaceLabel text={documents} color="blue" width={98} />
      </div>
      <div>
        <MonospaceLabel text={size} color="yellow" width={98} />
      </div>
      <div>
        <MonospaceLink text="VOTE" color="green" width={98} link={link} />
      </div>
    </div>
  );
}

function DownloadsBlock() {
  return (
    <div className="w-full border-t-tiny border-x-tiny border-lines-soft">
      <div className="grid grid-cols-downloadRow text-basesm font-sans font-semibold text-letter-dark bg-background-darkgrey border-b-lines-darkest border-b-tiny">
        <div className="pl-2 py-0.5">Timestamp</div>
        <div className="flex-grow py-0.5">Description</div>
        <div className="py-0.5">Documents</div>
        <div className="py-0.5">Size</div>
        <div className="py-0.5">Link</div>
      </div>
      <div className="flex flex-col">
        <DownloadRow
          date="2023-05-04"
          description="All papers on Arxiv.org embedded by title using the InstructorXL model."
          documents="2.3 M"
          size="6.5 GB"
          link="https://drive.google.com/file/d/1Ul5mPePtoPKHZkH5Rm6dWKAO11dG98GN/view?usp=share_link"
        />
        <DownloadRow
          date="2023-05-04"
          description="All papers on Arxiv.org embedded by abstract using the InstructorXL model."
          documents="2.3 M"
          size="7.6 GB"
          link="https://drive.google.com/file/d/1g3K-wlixFxklTSUQNZKpEgN4WNTFTPIZ/view?usp=share_link"
        />
        <DownloadRow
          date="2023-06-14"
          description="All major religious texts embedded using the Ada-002 model. "
          documents="50 M"
          size="20 GB"
          link="https://github.com/macrocosmcorp/tenet/tree/main/embeddings"
        />
        <div className="flex text-basesm font-sans font-normal text-letter-softest border-b-lines-soft border-b-tiny h-[29px] items-center justify-center pt-0.5">
          ↓ &nbsp; Help us decide what to embed next by voting below! &nbsp; ↓
        </div>
        <VoteRow
          description="All US cases from the Case Law Project using the InstructorXL model."
          documents="36.3 M"
          size="~80 GB"
          link={generateTwitterIntent(
            tweetText("all of US Case Law"),
            "https://alex.macrocosm.so/download"
          )}
        />
        <VoteRow
          description="All patents on USPTO embedded using the InstructorXL model."
          documents="18.2 M"
          size="~61 GB"
          link={generateTwitterIntent(
            tweetText("all USPTO patents"),
            "https://alex.macrocosm.so/download"
          )}
        />
        <VoteRow
          description="All of English Wikipedia embedded using the InstructorXL model."
          documents="6.6 M"
          size="~22 GB"
          link={generateTwitterIntent(
            tweetText("all of English Wikipedia"),
            "https://alex.macrocosm.so/download"
          )}
        />
        <VoteRow
          description="All repositories on Github using a to-be-determined model."
          documents="3.1 B"
          size="~3.4 TB"
          link={generateTwitterIntent(
            tweetText("all repositories on Github"),
            "https://alex.macrocosm.so/download"
          )}
        />
      </div>
    </div>
  );
}
