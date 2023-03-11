import Head from "next/head";
import Link from "next/link";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { ContactTable } from "../components/ContactTable.jsx";
import { SearchBar } from "../components/SearchBar.jsx";
import { useState, useEffect, useMemo } from "react";
import { debounce } from "lodash";

const inter = Inter({ subsets: ["latin"] });

const defaultEndpoint = `https://rickandmortyapi.com/api/character/`;

export async function getServerSideProps() {
  const res = await fetch(defaultEndpoint);
  const data = await res.json();
  return {
    props: {
      data,
    },
  };
}

export default function Home({ data }) {
  const { info, results: defaultResults = [] } = data;
  const [results, updateResults] = useState(defaultResults);
  const [page, updatePage] = useState({
    ...info,
    current: defaultEndpoint,
  });
  const { current } = page;

  const handleSearchChange = (newValue) => {
    const endpoint = defaultEndpoint + `?name=${newValue}`;
    updatePage({
      current: endpoint,
    });
  };
  const debouncedHandleSearchChange = useMemo(
    () => debounce(handleSearchChange, 500),
    []
  );

  const [isLoading, setIsLoading] = useState(false);
  const fetchContacts = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(current);
      const nextData = await res.json();
      updatePage({
        current,
        ...nextData.info,
      });

      updateResults(nextData.results || []);
      setPagesArray([
        ...Array(nextData?.info?.pages > 7 ? 8 : nextData?.info?.pages).keys(),
      ]);
      setIsLoading(false);
      return;

      {
        /* if (!nextData.info?.prev) {
        updateResults(nextData.results);
        return;
      }

      updateResults((prev) => {
        return [...prev, ...nextData.results];
      }); */
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleLoadNext = () => {
    if (getCurrentPageNumber() === pagesArray[pagesArray.length - 1] + 1) {
      setPagesArray(pagesArray.map((i) => i + 8));
    }
    updatePage((prev) => {
      return {
        ...prev,
        current: page?.next,
      };
    });
  };
  const handleLoadPrev = () => {
    if (getCurrentPageNumber() === pagesArray[0] + 1) {
      setPagesArray(pagesArray.map((i) => i - 8));
    }
    updatePage((prev) => {
      return {
        ...prev,
        current: page?.prev,
      };
    });
  };

  {
    /* const handleLoadPage = (pageNumber) => {
    let newPage = `${defaultEndpoint}/?page=${pageNumber}`;

    updatePage((prev) => {
      return {
        ...prev,
        current: newPage,
      };
    });
  }; */
  }
  const getCurrentPageNumber = () => {
    let searchParams = new URL(current).searchParams;
    let pageParam = searchParams.get("page");

    return !!pageParam ? parseInt(pageParam) : 1;
  };

  const [pagesArray, setPagesArray] = useState([...Array(8).keys()]);
  const CurrentPageDisplay = () => {
    return (
      <>
        {pagesArray.map((i) => (
          <label
            className={getCurrentPageNumber() === i + 1 ? styles.underline : ""}
            key={i}
          >
            {i + 1}
          </label>
        ))}
      </>
    );
  };

  useEffect(() => {
    if (current === defaultEndpoint) return;

    fetchContacts();
  }, [current]);

  return (
    <>
      <Head>
        <title>Contact List - SleekFlow</title>
        <meta
          name="description"
          content="View our list of contacts with their related information."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <div className={styles.searchSection}>
          <h1>Contacts</h1>
          <SearchBar onChange={debouncedHandleSearchChange} />
        </div>
        <div className={styles.tableSection}>
          <ContactTable fetchedData={results} />
          <div className={styles.pageSection}>
            {page?.prev && (
              <button disabled={isLoading} onClick={handleLoadPrev}>
                Prev page
              </button>
            )}
            <CurrentPageDisplay />
            {page?.next && getCurrentPageNumber() < pagesArray.length && (
              <button disabled={isLoading} onClick={handleLoadNext}>
                Next page
              </button>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
