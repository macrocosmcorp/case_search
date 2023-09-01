import { MonospaceLabel, MonospaceLink } from "@/components/label";

async function getResults(query: string | null, id: string | null) {
  if (query !== null) {
    const res = await fetch(`${process.env.API_URL}/search`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: query }),
    });

    return await res.json();
  } else if (id !== null) {
    const res = await fetch(`${process.env.API_URL}/similar`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Number(id) }),
    });

    return await res.json();
  } else {
    return null;
  }
}

async function ResultsBlock({
  query,
  id,
}: {
  query: string | null;
  id: string | null;
}) {
  const results = await getResults(query, id);
  if (!results) return null;

  return (
    <div className="w-full flex flex-col gap-4">
      {results.map((result: any, i: number) => (
        <Result data={result} key={i} />
      ))}
    </div>
  );
}

function Result({ data }: { data: any }) {
  if (!data) return null;
  return (
    <div className="grid sm:grid-cols-[1fr_100px] w-full grid-rows-1 gap-x-6 gap-y-2 p-2 border-tiny border-lines-soft text-basesm">
      <div className="flex flex-col gap-4">
        <div className="flex flex-row justify-between items-center gap-2">
          <div className="font-sans text-lg font-semibold text-letter-default break-words">
            {data.case_name || "No Case Name"}
          </div>
          <div className="flex flex-col gap-2">
            {data.absolute_url && (
              <MonospaceLink
                text="Go to case"
                color="green"
                width={120}
                link={data.absolute_url}
              />
            )}
            {data.id && (
              <MonospaceLink
                text="Find similar"
                color="blue"
                width={120}
                link={`/?id=${encodeURIComponent(data.id)}`}
              />
            )}
          </div>
        </div>
        <div className="lines-3 text-sm">{data.text || "No Text"}</div>
      </div>
      <div className="flex sm:flex-col flex-row justify-between sm:justify-normal gap-4">
        <div>
          <div className="font-sans font-semibold text-letter-default">
            Date Filed
          </div>
          <div>{data.date_filed || "No Date"}</div>
        </div>
        <div>
          <div className="font-sans font-semibold text-letter-default">
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

export default ResultsBlock;
