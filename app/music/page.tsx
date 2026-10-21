import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { artistProfiles, musicCopy, releases, videos } from "@/content/music";
import { artist } from "@/content/site";
import { RecordShelf, StaticTv, Turntable } from "@/components/music/RoomArt";
import StreamingLinks from "@/components/music/StreamingLinks";
import ListenPanel from "@/components/music/ListenPanel";
import VideoShelf from "@/components/music/VideoShelf";
import MiniPlayer, { type PlayableTrack } from "@/components/music/MiniPlayer";
import SiteFooter from "@/components/ui/SiteFooter";
import styles from "@/components/music/Music.module.css";

export const metadata: Metadata = {
  title: "The Listening Room",
  description: "Music by Briz the Sage: What Up World, singles, and where to listen.",
};

const formatDate = (d: string) =>
  /^\d{4}$/.test(d)
    ? d
    : new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric", timeZone: "UTC" });

export default function MusicPage() {
  const [featured, ...rest] = releases;
  const playable: PlayableTrack[] = releases.flatMap((r) =>
    r.tracks.filter((t) => t.audioSrc).map((t) => ({ title: t.title, release: r.title, src: t.audioSrc! })),
  );

  return (
    <>
      <main className={styles.room} data-has-player={playable.length > 0}>
        <div className={styles.lampGlow} aria-hidden="true" />

        <header className={styles.intro}>
          <div>
            <p className="kicker">{musicCopy.kicker}</p>
            <h1 className={styles.title}>{musicCopy.title}</h1>
            <p className={styles.lede}>{musicCopy.lede}</p>
          </div>
          <Turntable className={styles.turntable} spinClass={styles.spin} />
        </header>

        {featured && (
          <section className={styles.featured} aria-labelledby="featured-title">
            <div className={styles.sleeve}>
              <div className={styles.vinyl} aria-hidden="true" />
              <Image
                src={featured.artwork.src}
                alt={featured.artwork.alt}
                width={featured.artwork.width}
                height={featured.artwork.height}
                priority
                sizes="(max-width: 800px) 86vw, 520px"
                className={styles.cover}
              />
            </div>
            <div className={`paper ${styles.notes}`}>
              <p className={styles.notesKicker}>{musicCopy.featuredKicker}</p>
              <h2 id="featured-title" className={styles.featuredTitle}>
                {featured.title}
              </h2>
              <dl className={styles.facts}>
                <div>
                  <dt>Format</dt>
                  <dd>{featured.kind ?? <span className={styles.tbd}>Details coming soon</span>}</dd>
                </div>
                <div>
                  <dt>Released</dt>
                  <dd>
                    {featured.releaseDate ? (
                      formatDate(featured.releaseDate)
                    ) : (
                      <span className={styles.tbd}>Date coming soon</span>
                    )}
                  </dd>
                </div>
              </dl>
              {featured.description && <p className={styles.description}>{featured.description}</p>}
              <p className={styles.credits}>{featured.credits}</p>

              <h3 className={styles.subhead}>Tracklist</h3>
              {featured.tracks.length > 0 ? (
                <ol className={styles.tracks}>
                  {featured.tracks.map((t) => (
                    <li key={t.title}>
                      <span>{t.title}</span>
                      {t.duration && <span className={styles.duration}>{t.duration}</span>}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className={styles.tbd}>The tracklist is still being written on the back of the sleeve.</p>
              )}

              {featured.links.length > 0 && (
                <>
                  <h3 className={styles.subhead}>Listen on</h3>
                  <StreamingLinks links={featured.links} label={`Where to listen to ${featured.title}`} />
                </>
              )}
            </div>
          </section>
        )}

        {featured && <ListenPanel release={featured} />}

        <RecordShelf className={styles.shelf} />

        <section className={styles.section} aria-labelledby="profiles-title">
          <h2 id="profiles-title" className={styles.sectionTitle}>
            {musicCopy.profilesTitle}
          </h2>
          <p className={styles.sectionLede}>{artist.shortBio}</p>
          <StreamingLinks links={artistProfiles} label="Briz the Sage artist profiles" />
        </section>

        <section className={styles.section} aria-labelledby="discography-title">
          <h2 id="discography-title" className={styles.sectionTitle}>
            {musicCopy.crateTitle}
          </h2>
          <ul className={styles.crate}>
            {[featured, ...rest].filter(Boolean).map((r) => (
              <li key={r.id} className={styles.crateItem}>
                <Image
                  src={r.artwork.src}
                  alt=""
                  width={r.artwork.width}
                  height={r.artwork.height}
                  sizes="(max-width: 600px) 44vw, 220px"
                  className={styles.crateArt}
                />
                <p className={styles.crateTitle}>{r.title}</p>
                <p className={styles.crateMeta}>
                  {[r.kind, r.releaseDate && new Date(r.releaseDate).getUTCFullYear()].filter(Boolean).join(" · ")}
                </p>
                <p className={styles.crateCredits}>
                  {r.credits}
                  {r.role && <span className={styles.crateRole}> · {r.role}</span>}
                </p>
                <StreamingLinks links={r.links} label={`Where to listen to ${r.title}`} small />
              </li>
            ))}
            <li className={`${styles.crateItem} ${styles.crateEmpty}`}>
              <div className={styles.emptySleeve} aria-hidden="true">
                <span>?</span>
              </div>
              <p className={styles.crateTitle}>{musicCopy.moreSlotTitle}</p>
              <p className={styles.crateMeta}>{musicCopy.moreSlotNote}</p>
            </li>
          </ul>
        </section>

        <section className={styles.section} aria-labelledby="videos-title">
          <h2 id="videos-title" className={styles.sectionTitle}>
            {musicCopy.tvTitle}
          </h2>
          {videos.length > 0 ? (
            <VideoShelf videos={videos} />
          ) : (
            <div className={styles.emptyTv}>
              <StaticTv className={styles.tvArt} staticClass={styles.static} />
              <div>
                <p className={styles.emptyTitle}>{musicCopy.tvEmpty}</p>
              </div>
            </div>
          )}
        </section>

        <nav className={styles.doors} aria-label="Other rooms">
          <Link href="/briz-lore" className="btn btn-teal">
            Into the Archives →
          </Link>
          <Link href="/" className="btn btn-ghost">
            ← Back to the blue house
          </Link>
        </nav>
      </main>
      <SiteFooter />
      {playable.length > 0 && <MiniPlayer tracks={playable} />}
    </>
  );
}
