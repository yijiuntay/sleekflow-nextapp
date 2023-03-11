import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import { Inter } from "@next/font/google";
import styles from "@/styles/Character.module.css";
import { EpisodeTable } from "../../../components/EpisodeTable.jsx";

const inter = Inter({ subsets: ["latin"] });

const characterEndpoint = `https://rickandmortyapi.com/api/character/`;
const episodeEndpoint = `https://rickandmortyapi.com/api/episode/`;

export async function getServerSideProps({ query }) {
  const { id } = query;

  let characterData;
  const characterRes = await fetch(`${characterEndpoint}${id}`)
    .then((response) => response.json())
    .then((data) => {
      characterData = data;
    });

  const episodesToFetch = characterData.episode?.map(
    (e) => e.split("/")[e.split("/").length - 1]
  );
  const episodeRes = await fetch(
    `${episodeEndpoint}${episodesToFetch.join(",")}`
  );
  const episodeData = await episodeRes.json();

  const data = {
    characterData: characterData,
    episodeData: Array.isArray(episodeData) ? episodeData : [episodeData],
  };

  return {
    props: {
      data,
    },
  };
}

export default function Character({ data }) {
  const { name, image, gender, location, origin, species, status } =
    data.characterData;

  return (
    <>
      <Head>
        <title>{`${name} - SleekFlow`}</title>
        <meta name="description" content={`View information about ${name}`} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <Link href="/" className={styles.homeButton}>
          <button>Back</button>
        </Link>
        <div className={styles.headerSection}>
          <Image
            src={image}
            alt="Image of character"
            className={styles.profileImage}
            width={200}
            height={200}
          />
          <h1>{name}</h1>
        </div>
        <div className={styles.infoSection}>
          <h2>Personal Info</h2>
          <div className={styles.infoBox}>
            <div>
              <strong>Status:</strong> {status}
            </div>
            <div>
              <strong>Gender:</strong> {gender}
            </div>
            <div>
              <strong>Location:</strong> {location?.name}
            </div>
            <div>
              <strong>Origin:</strong> {origin?.name}
            </div>
            <div>
              <strong>Species:</strong> {species}
            </div>
          </div>
          <EpisodeTable fetchedData={data.episodeData} />
        </div>
      </main>
    </>
  );
}
