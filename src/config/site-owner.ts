/**
 * Single source of truth for who operates RechenHafen.
 *
 * Everything that names a person or an address (Impressum, Über uns, author
 * bylines, JSON-LD author/founder) reads from here. Never put placeholder text
 * like "[FILL: …]" into page code again – leave a field empty instead, and the
 * pages fall back to the organisation name or hide the line.
 *
 * All fields are intentionally empty (owner decision, Nov 2026): no name, address
 * or contact is published. Empty fields render nothing.
 * Legal note: German commercial sites (incl. ad-funded ones) are generally required
 * to publish an Impressum with name and address (§ 5 DDG). Fill `impressum.*` if
 * that ever applies.
 */

export interface SiteOwner {
  /** Real name of the person who writes and maintains the calculators. Empty = show "RechenHafen". */
  editorName: string;
  /** 2–3 true sentences about the editor (shown on /ueber-uns/). Empty = section hidden. */
  editorBio: string;
  /** Public profiles of the editor (LinkedIn, GitHub, …). Only real URLs. */
  editorProfiles: string[];
  /** Mailbox that is actually read. Empty = no contact line is shown anywhere. */
  contactEmail: string;
  impressum: {
    /** Legal entity or full name of the operator. */
    name: string;
    /** Street and house number. */
    street: string;
    /** Postcode, city, country. */
    city: string;
    /** e.g. "Amtsgericht Berlin HRB 12345" – empty if not registered. */
    register: string;
    /** USt-IdNr. – empty if none. */
    vatId: string;
    /** Natural person responsible under § 18 Abs. 2 MStV. */
    responsiblePerson: string;
    /** Address of that person, if different from the operator address. */
    responsibleAddress: string;
  };
}

export const SITE_OWNER: SiteOwner = {
  editorName: '',
  editorBio: '',
  editorProfiles: [],
  contactEmail: '',
  impressum: {
    name: '',
    street: '',
    city: '',
    register: '',
    vatId: '',
    responsiblePerson: '',
    responsibleAddress: '',
  },
};

const ORG_NAME = 'RechenHafen';
const ABOUT_URL = 'https://rechenhafen.de/ueber-uns/';

/** Name shown in bylines: the real editor if set, otherwise the site name. */
export const AUTHOR_DISPLAY_NAME = SITE_OWNER.editorName.trim() || ORG_NAME;

/** JSON-LD author node: a Person only when a real name exists, otherwise the Organization. */
export function authorSchema() {
  const name = SITE_OWNER.editorName.trim();
  return name
    ? { '@type': 'Person', name, url: ABOUT_URL }
    : { '@type': 'Organization', name: ORG_NAME, url: ABOUT_URL };
}

/** True once all fields required for a lawful Impressum are filled. */
export function isImpressumComplete(): boolean {
  const i = SITE_OWNER.impressum;
  return [i.name, i.street, i.city, i.responsiblePerson].every((v) => v.trim().length > 0);
}
