"use client";

import Image from "next/image";
import { useState } from "react";
import { merch, merchCategories, type MerchCategory, type MerchItem } from "@/content/merch";
import Dialog from "@/components/ui/Dialog";
import MerchArt from "./MerchArt";
import styles from "./Merch.module.css";

const STATUS_LABEL: Record<MerchItem["status"], string> = {
  preview: "Preview",
  "coming-soon": "Coming soon",
  available: "Available",
};

const STATUS_EXPLAINER: Record<MerchItem["status"], string> = {
  preview: "This is a design preview. It isn’t in production and can’t be ordered.",
  "coming-soon": "This one is on its way. It can’t be ordered yet.",
  available: "Available from the official store.",
};

/**
 * Checkout integration point: a product is purchasable only when
 * `status === "available"` AND `checkoutUrl` is set in content/merch.ts.
 * The site never collects payment details itself; it links out to the store.
 */
const canBuy = (item: MerchItem) => item.status === "available" && Boolean(item.checkoutUrl);

function ProductArt({ item, sizes }: { item: MerchItem; sizes: string }) {
  if (item.image) {
    return (
      <Image
        src={item.image.src}
        alt={item.image.alt}
        width={item.image.width}
        height={item.image.height}
        sizes={sizes}
        className={styles.photo}
      />
    );
  }
  return <MerchArt kind={item.art} className={styles.art} />;
}

export default function Shop() {
  const [filter, setFilter] = useState<MerchCategory | "all">("all");
  const [openId, setOpenId] = useState<string | null>(null);
  const items = filter === "all" ? merch : merch.filter((m) => m.category === filter);
  const open = merch.find((m) => m.id === openId) ?? null;
  const activeBlurb = merchCategories.find((c) => c.id === filter)?.blurb ?? "Everything in the cabinet.";

  return (
    <>
      <div className={styles.filters} role="group" aria-label="Filter by category">
        {[{ id: "all" as const, label: "All" }, ...merchCategories].map((c) => (
          <button
            key={c.id}
            type="button"
            className={styles.filter}
            aria-pressed={filter === c.id}
            onClick={() => setFilter(c.id)}
          >
            {c.label}
          </button>
        ))}
      </div>
      <p className={styles.blurb} aria-live="polite">
        {activeBlurb} <span className="sr-only">{items.length} items shown.</span>
      </p>

      <div className={styles.cabinet}>
        <ul className={styles.grid}>
          {items.map((item, i) => (
            <li key={item.id} className={styles.cell} style={{ "--tilt": `${(i % 3) - 1}deg` } as React.CSSProperties}>
              <button
                type="button"
                className={styles.card}
                onClick={() => setOpenId(item.id)}
                aria-haspopup="dialog"
              >
                <span className={styles.stage}>
                  <ProductArt item={item} sizes="(max-width: 600px) 45vw, 260px" />
                </span>
                <span className={styles.label}>
                  <span className={`stamp ${styles.stamp}`} data-status={item.status}>
                    {STATUS_LABEL[item.status]}
                  </span>
                  <span className={styles.name}>{item.name}</span>
                  <span className={styles.tagline}>{item.tagline}</span>
                  {item.price && item.status === "available" && <span className={styles.price}>{item.price}</span>}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <Dialog open={open !== null} onClose={() => setOpenId(null)} title={open?.name ?? "Product"} className={styles.detail}>
        {open && (
          <div className={styles.detailBody}>
            <div className={styles.detailArt}>
              <ProductArt item={open} sizes="(max-width: 700px) 80vw, 320px" />
            </div>
            <div>
              <span className={`stamp ${styles.stamp}`} data-status={open.status}>
                {STATUS_LABEL[open.status]}
              </span>
              <p className={styles.detailTagline}>{open.tagline}</p>
              <p>{open.description}</p>
              <ul className={styles.details}>
                {open.details.map((d) => (
                  <li key={d}>{d}</li>
                ))}
              </ul>
              <p className={styles.explainer}>{STATUS_EXPLAINER[open.status]}</p>
              {canBuy(open) ? (
                <a className="btn btn-gold" href={open.checkoutUrl!} target="_blank" rel="noreferrer">
                  Buy on store <span aria-hidden="true">↗</span>
                  {open.price && <span>· {open.price}</span>}
                </a>
              ) : (
                <button type="button" className="btn" disabled>
                  Not available yet
                </button>
              )}
            </div>
          </div>
        )}
      </Dialog>
    </>
  );
}
