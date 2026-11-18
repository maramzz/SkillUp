const BASE = "https://openlibrary.org";
const CATEGORY_QUERY = {
  All: "textbook",
  "Computer Science": "computer science",
  Psychology: "psychology",
  Chemistry: "chemistry",
  Economics: "economics",
  Mathematics: "mathematics",
  Literature: "literature"
};
const TONES = {
  "Computer Science": "#3B3A36",
  Psychology: "#6E7C63",
  Chemistry: "#7A5A3A",
  Economics: "#5C4638",
  Mathematics: "#2F6B52",
  Literature: "#68735A"
};
function inferCategory(subjects = [], selected) {
  if (selected !== "All") return selected;
  const s = subjects.join(" ").toLowerCase();
  if (/computer|algorithm|program/.test(s)) return "Computer Science";
  if (/psycholog|cognit|neuro/.test(s)) return "Psychology";
  if (/chem|molecul/.test(s)) return "Chemistry";
  if (/econ|macro|financ/.test(s)) return "Economics";
  if (/math|algebra|calcul/.test(s)) return "Mathematics";
  return "Literature";
}
const coverUrl = (id) => id && id > 0 ? `https://covers.openlibrary.org/b/id/${id}-L.jpg` : "";
async function searchBooks(query, category, page, limit) {
  const text = query.trim();
  const q = text ? category !== "All" ? `${text} ${CATEGORY_QUERY[category]}` : text : CATEGORY_QUERY[category];
  const url = new URL(`${BASE}/search.json`);
  url.searchParams.set("q", q);
  url.searchParams.set("page", String(page));
  url.searchParams.set("limit", String(limit));
  url.searchParams.set(
    "fields",
    "key,title,author_name,first_publish_year,cover_i,subject,number_of_pages_median"
  );
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Open Library error ${res.status}`);
  const data = await res.json();
  const docs = data.docs ?? [];
  const numFound = data.numFound ?? docs.length;
  const books = docs.filter((d) => d.key && d.title).map((d) => {
    const cat = inferCategory(d.subject, category);
    const pages = d.number_of_pages_median ?? null;
    return {
      id: String(d.key).replace("/works/", ""),
      title: d.title,
      author: d.author_name?.slice(0, 2).join(", ") || "Unknown author",
      category: cat,
      year: d.first_publish_year ?? null,
      pages,
      readingTime: `${pages ? Math.max(15, Math.min(90, Math.round(pages / 8))) : 30} min`,
      coverImage: coverUrl(d.cover_i),
      shelfTone: TONES[cat],
      courseCode: "OL",
      summary: "",
      takeaways: [],
      source: "openlibrary"
    };
  });
  return { books, numFound, page, hasMore: page * limit < numFound && books.length > 0 };
}
async function getBook(id) {
  if (!/^OL\d+W$/i.test(id)) return null;
  const res = await fetch(`${BASE}/works/${id}.json`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Open Library error ${res.status}`);
  const work = await res.json();
  let author = "Unknown author";
  const authorKey = work.authors?.[0]?.author?.key;
  if (authorKey) {
    try {
      const a = await fetch(`${BASE}${authorKey}.json`);
      if (a.ok) author = (await a.json()).name || author;
    } catch {
       // ignore: storage unavailable or data is broken
    }
  }
  const cat = inferCategory(work.subjects, "All");
  const description = typeof work.description === "string" ? work.description : work.description?.value || "";
  const year = work.first_publish_date?.match(/\d{4}/);
  return {
    id,
    title: work.title || "Untitled",
    subtitle: work.subtitle || "",
    author,
    category: cat,
    year: year ? parseInt(year[0], 10) : null,
    pages: null,
    readingTime: "",
    coverImage: coverUrl(work.covers?.[0]),
    shelfTone: TONES[cat],
    courseCode: id,
    summary: description.trim(),
    takeaways: (work.subjects ?? []).slice(0, 4),
    source: "openlibrary"
  };
}
export {
  getBook,
  searchBooks
};
