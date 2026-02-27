/**
 * Navigation Event System
 * Allows Navbar to tell Collections which tab + subcategory to activate
 */

export type CollectionTab = "gold" | "silver" | "gem" | "curated";

export interface CollectionNavigateEvent {
  tab: CollectionTab;
  subcategory: string;
}

const EVENT_NAME = "collectionNavigate";

/**
 * Dispatch a navigation event (called from Navbar)
 */
export function navigateToCollection(tab: CollectionTab, subcategory: string = "All") {
  const event = new CustomEvent<CollectionNavigateEvent>(EVENT_NAME, {
    detail: { tab, subcategory },
  });
  window.dispatchEvent(event);

  // Smooth scroll to collections section with offset for fixed navbar
  setTimeout(() => {
    const el = document.getElementById("collections");
    if (el) {
      const offset = 100; // navbar height offset
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  }, 50);
}

/**
 * Subscribe to navigation events (called from Collections)
 */
export function onCollectionNavigate(
  callback: (event: CollectionNavigateEvent) => void
): () => void {
  const handler = (e: Event) => {
    const customEvent = e as CustomEvent<CollectionNavigateEvent>;
    callback(customEvent.detail);
  };
  window.addEventListener(EVENT_NAME, handler);
  return () => window.removeEventListener(EVENT_NAME, handler);
}
