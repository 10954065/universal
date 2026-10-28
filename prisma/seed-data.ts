/*
 * Seed data. Nothing here is presented as verified ministry fact:
 * - Photo alt text describes what is visible and never names anyone.
 * - Suggested ministries and long-form page sections are created as DRAFTS.
 * - Proposed marketing copy (hero, welcome) is listed in docs/LAUNCH_CHECKLIST.md for approval.
 */

export interface SeedPhoto {
  file: string;
  alt: string;
  focalX?: number;
  focalY?: number;
}

export const PHOTOS: SeedPhoto[] = [
  { file: "worship-hero.jpg", alt: "A minister in clerical collar worships with eyes closed as a fellow worshipper lifts a white cloth in praise", focalX: 52, focalY: 38 },
  { file: "preaching-gown-portrait.jpg", alt: "A minister in a blue and gold academic gown preaches from the pulpit", focalY: 35 },
  { file: "preaching-christmas.jpg", alt: "A minister in a blue and gold gown speaks at a glass pulpit framed by Christmas decorations", focalX: 50, focalY: 45 },
  { file: "worship-seated.jpg", alt: "A worshipper in blue and white attire sits in quiet prayer during a service", focalY: 30 },
  { file: "congregation-standing.jpg", alt: "Members of the congregation stand together during worship", focalY: 35 },
  { file: "fellowship-men.jpg", alt: "A group of men stand together on the platform after a fellowship gathering" },
  { file: "speaker-red-stage.jpg", alt: "A speaker addresses the congregation from a stage draped in red and white", focalX: 45, focalY: 35 },
  { file: "youth-member.jpg", alt: "A young member listens attentively during a service", focalY: 35 },
  { file: "prayer-man.jpg", alt: "A man prays with his hands clasped during worship", focalY: 35 },
  { file: "prayer-bowed.jpg", alt: "A young man bows his head in prayer", focalY: 35 },
  { file: "worship-singer.jpg", alt: "A worshipper sings into a microphone during praise and worship", focalY: 35 },
  { file: "worship-leader.jpg", alt: "A worship leader sings passionately with a microphone", focalY: 35 },
  { file: "altar-banners.jpg", alt: "A member stands at the altar in front of the ministry's mission and vision banners", focalY: 35 },
  { file: "minister-white.jpg", alt: "A minister dressed in white speaks to the congregation", focalY: 30 },
  { file: "pulpit-shepherd.jpg", alt: "A speaker stands at a glass pulpit before a backdrop of a shepherd and flock", focalY: 35 },
  { file: "minister-banner.jpg", alt: "A minister dressed in white greets the congregation beside the Universal Trinity Ministry banner", focalX: 45, focalY: 35 },
  { file: "congregation-group-1.jpg", alt: "The congregation gathered for a group photograph in the sanctuary" },
  { file: "congregation-shiloh.jpg", alt: "The congregation gathered beneath the Universal Trinity Ministry, Shiloh Emmanuel Temple backdrop", focalY: 45 },
  { file: "congregation-group-2.jpg", alt: "Members of the congregation seated and standing together for a group photograph" },
  { file: "congregation-front-row.jpg", alt: "Members seated in the front row of the sanctuary" },
  { file: "community-outdoor.jpg", alt: "Families and children gathered outside a church building" },
  { file: "pulpit-preacher-1.jpg", alt: "A young preacher smiles while speaking at the pulpit with an open Bible", focalY: 35 },
  { file: "pulpit-preacher-2.jpg", alt: "A preacher holds a microphone at the pulpit with an open Bible", focalY: 35 },
  { file: "joyful-member.jpg", alt: "A member in a ministry cap and shirt dances joyfully in the sanctuary", focalX: 55, focalY: 35 },
  { file: "pulpit-clergy.jpg", alt: "A minister speaks from the pulpit", focalY: 35 },
  { file: "clergy-speaking.jpg", alt: "A minister in clerical collar speaks into a microphone", focalY: 35 },
  { file: "women-fellowship.jpg", alt: "Women gathered together outside the church entrance" },
  { file: "team-member-blue.jpg", alt: "A ministry team member in a blue shirt stands at the front of the sanctuary", focalY: 35 },
  { file: "outreach-team-1.jpg", alt: "Ministry team members in matching shirts shake hands in the sanctuary" },
  { file: "outreach-team-2.jpg", alt: "Ministry team members in matching shirts stand together in the sanctuary" },
  { file: "outreach-field-front.jpg", alt: "An outreach team in matching shirts and caps stands together outdoors" },
  { file: "outreach-field-back.jpg", alt: "Outreach team members seen from behind, their shirts reading 'Let us trade our salvation too' with John 3:16", focalY: 40 },
  { file: "worship-singer-2.jpg", alt: "A worshipper sings beside a window during the service", focalX: 40, focalY: 35 },
  { file: "portrait-clergy-1.jpg", alt: "Studio portrait of a minister in clerical collar", focalY: 30 },
  { file: "portrait-clergy-2.jpg", alt: "Studio portrait of a minister in clerical collar and glasses", focalY: 30 },
  { file: "speaker-red-stage-2.jpg", alt: "A speaker in traditional attire addresses the congregation", focalY: 35 },
  { file: "portrait-clergy-3.jpg", alt: "Studio portrait of a minister in a dark suit and clerical collar", focalY: 25 },
  { file: "worship-singer-3.jpg", alt: "A worshipper in an orange headwrap sings during praise", focalY: 35 },
  { file: "praise-hand-raised.jpg", alt: "A worshipper raises her hand in praise as a child stands nearby", focalY: 35 },
  { file: "children-families.jpg", alt: "Adults and children gathered together for a photograph in the sanctuary" },
  { file: "prayer-woman.jpg", alt: "A woman prays fervently with a microphone during a prayer session", focalY: 35 },
  { file: "children-bible-reading.jpg", alt: "A child reads aloud from the lectern as an adult follows along in the Bible" },
  { file: "congregation-worship.jpg", alt: "Members of the congregation worship with hands on their hearts", focalY: 35 },
  { file: "children-ministry.jpg", alt: "A group of children gathered together in the sanctuary" },
  { file: "women-group.jpg", alt: "Women of the congregation stand together in the sanctuary" },
  { file: "men-group.jpg", alt: "Three men stand together in the sanctuary" },
  { file: "men-and-boys.jpg", alt: "Men and boys gathered together in the sanctuary" },
  { file: "portrait-clergy-4.jpg", alt: "Studio portrait of a minister in a royal blue suit and clerical collar", focalY: 30 },
];

export const HOMEPAGE = {
  heroHeading: "Growing in Faith. Living in Love. Sharing the Hope of Christ.",
  heroText:
    "Discover a community committed to worship, spiritual growth, fellowship, and sharing God's love with the world.",
  heroImage: "worship-hero.jpg",
  welcomeHeading: "Welcome",
  welcomeText:
    "You are welcome here. We meet to worship God, learn from the Bible and look after one another. We would love to meet you.",
  welcomeImage: "congregation-shiloh.jpg",
  // Psalm 23 appears on the sanctuary backdrop. King James Version (public domain).
  scriptureText:
    "The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul.",
  scriptureReference: "Psalm 23:1-3",
  scriptureTranslation: "KJV",
  outreachHeading: "Outreach",
  outreachText:
    "We share the gospel and help people in our community through fellowship, evangelism and practical care.",
  outreachImage: "outreach-field-back.jpg",
};

export interface SeedMinistry {
  slug: string;
  name: string;
  summary: string;
  image: string;
}

/** Suggested departments, created as DRAFT until the ministry confirms each one. */
export const SUGGESTED_MINISTRIES: SeedMinistry[] = [
  { slug: "worship-and-praise", name: "Worship & Praise", summary: "Leads worship through song and music during services.", image: "worship-leader.jpg" },
  { slug: "prayer-ministry", name: "Prayer Ministry", summary: "Prays for the church, our families and our nation.", image: "prayer-woman.jpg" },
  { slug: "youth-ministry", name: "Youth Ministry", summary: "For young people who want to know Christ and grow in faith.", image: "youth-member.jpg" },
  { slug: "childrens-ministry", name: "Children's Ministry", summary: "Teaches children about God's love in ways they understand.", image: "children-ministry.jpg" },
  { slug: "mens-fellowship", name: "Men's Fellowship", summary: "Men supporting one another in faith and service.", image: "men-group.jpg" },
  { slug: "womens-fellowship", name: "Women's Fellowship", summary: "Women growing together in prayer and the Word.", image: "women-group.jpg" },
  { slug: "outreach-and-evangelism", name: "Outreach & Evangelism", summary: "Shares the good news of Jesus and serves the community.", image: "outreach-field-front.jpg" },
  { slug: "bible-study-and-discipleship", name: "Bible Study & Discipleship", summary: "Studies the Bible together and helps believers grow as followers of Jesus.", image: "children-bible-reading.jpg" },
];

export interface SeedSection {
  key: string;
  page: string;
  title: string;
  sortOrder: number;
  editorNote: string;
  body?: string;
  publish?: boolean;
}

const PRIVACY_POLICY = `**Last updated:** see the date of publication on this page.

This policy explains how ${"{ministry}"} ("we", "us") collects and uses personal information through this website. We handle your information in line with the Data Protection Act, 2012 (Act 843) of Ghana.

## Information we collect

- **Contact and visit enquiries:** your name, email address, optional phone number and your message.
- **Prayer requests:** your request and, only if you choose to provide them, your name and a way to reach you. You may submit anonymously.
- **Event registrations:** your name, email address, optional phone number and the number of people attending.
- **Ministry updates:** your email address and the date you gave consent, if you subscribe.
- **Online giving:** your name, email address, the amount and the giving category. Card and Mobile Money details are entered directly with our payment provider and are never received or stored by this website.

## How we use it

We use this information only to respond to you, to pray for you, to manage the events you register for, to send updates you have asked for, and to keep accurate giving records.

## Prayer requests

Prayer requests are private. They are visible only to authorised ministry staff, are never published on this website, and are never sent to third-party analytics or artificial-intelligence services. Requests are deleted automatically after a fixed retention period.

## Who we share it with

We do not sell your information. We use a small number of service providers to run this website: our hosting and database provider, our email delivery provider and, for online giving, our payment processor. They handle your information only on our behalf.

## How long we keep it

We keep enquiries and registrations only for as long as needed for the purpose they were collected. You can unsubscribe from updates at any time using the link in any email.

## Your rights

You may ask to see, correct or delete the personal information we hold about you. Please use our contact page and we will respond as soon as we can.

## Cookies

This website uses only the cookies required for it to work (for example, to keep staff signed in to the administration area). We do not use advertising cookies.`;

const TERMS = `By using this website you agree to these terms.

## Use of this website

This website is provided to share information about the ministry, its services, teaching and events. Please use it lawfully and respectfully. You must not attempt to gain unauthorised access to any part of the website or interfere with its operation.

## Content

Sermons, photographs, text and other materials on this website belong to the ministry or are used with permission. You are welcome to share links to our content. Please ask us before reproducing materials in full.

## External links

This website may link to websites run by others, such as video platforms or social media. We are not responsible for their content or their privacy practices.

## Event registrations

Registering for an event lets us plan. Places may be limited and events may occasionally change or be cancelled; we will try to let registered guests know.

## Giving

Gifts made through this website are voluntary contributions to the work of the ministry. Online payments are processed securely by our payment provider. If you believe a gift was made in error, please contact us promptly.

## Changes

We may update these terms from time to time. The current version will always be on this page.`;

export const PAGE_SECTIONS: SeedSection[] = [
  { key: "about.overview", page: "about", title: "Who we are", sortOrder: 1, editorNote: "Official introduction to the ministry. Required before launch." },
  { key: "about.mission", page: "about", title: "Our Mission", sortOrder: 2, editorNote: "Mission statement exactly as approved (shown on the banner in the sanctuary)." },
  { key: "about.vision", page: "about", title: "Our Vision", sortOrder: 3, editorNote: "Vision statement exactly as approved (shown on the banner in the sanctuary)." },
  { key: "about.values", page: "about", title: "Our Core Values", sortOrder: 4, editorNote: "Use a bulleted list, one value per line, e.g. '- **Prayer**: short description'." },
  { key: "about.beliefs", page: "about", title: "What We Believe", sortOrder: 5, editorNote: "Statement of faith. Publish only the ministry's approved wording." },
  { key: "about.history", page: "about", title: "Our Story", sortOrder: 6, editorNote: "Founding story and history. Publish only verified facts." },
  {
    key: "visit.expect",
    page: "visit",
    title: "What to expect",
    sortOrder: 1,
    editorNote: "PROPOSED COPY: please review. Describe a typical service in the ministry's own words.",
    body: "Our services include worship, prayer and teaching from the Bible, with time to meet people afterwards. If it is your first visit, let someone know and we will be glad to welcome you and answer any questions.",
    publish: true,
  },
  { key: "visit.directions", page: "visit", title: "Finding us", sortOrder: 2, editorNote: "Directions, landmarks, and public transport tips." },
  { key: "visit.parking", page: "visit", title: "Parking", sortOrder: 3, editorNote: "Only if confirmed." },
  { key: "visit.accessibility", page: "visit", title: "Accessibility", sortOrder: 4, editorNote: "Step-free access, seating, assistance available. Only if confirmed." },
  { key: "visit.children", page: "visit", title: "Children", sortOrder: 5, editorNote: "Children's church, nursery, safeguarding. Only if confirmed." },
  { key: "visit.dress", page: "visit", title: "What to wear", sortOrder: 6, editorNote: "Only if the ministry wants to give guidance." },
  { key: "give.why", page: "give", title: "Why we give", sortOrder: 1, editorNote: "The ministry's own words on giving." },
  { key: "give.faq", page: "give", title: "Questions about giving", sortOrder: 2, editorNote: "FAQ as Markdown: '### Question' followed by the answer." },
  {
    key: "legal.privacy",
    page: "privacy",
    title: "Privacy Policy",
    sortOrder: 1,
    editorNote: "TEMPLATE: accurately describes how this website handles data, but must be reviewed by the ministry (and ideally a legal adviser) before launch.",
    body: PRIVACY_POLICY,
    publish: true,
  },
  {
    key: "legal.terms",
    page: "terms",
    title: "Terms and Conditions",
    sortOrder: 1,
    editorNote: "TEMPLATE: must be reviewed and approved by the ministry before launch.",
    body: TERMS,
    publish: true,
  },
];
