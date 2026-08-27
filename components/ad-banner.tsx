import Image from "next/image";

export function AdBanner() {
  return (
    <aside className="ad-banner" aria-label="Advertisement">
      <div className="ad-copy">
        <span className="ad-label">Sponsored</span>
        <p className="ad-headline">Sponsored by the Jorkulator 10000</p>
        <p className="ad-company">Jorkulator Industries</p>
      </div>
      <div className="ad-product">
        <Image
          src="/jorkulator-10000.png"
          alt="The Jorkulator 10000"
          fill
          sizes="(max-width: 600px) 115px, 150px"
        />
      </div>
    </aside>
  );
}
