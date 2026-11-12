/*
 * Official ministry content, supplied by the ministry in "UTM WEBSITE INFO" (November 2026).
 *
 * The seed writes each item only into a slot that is still empty or still holds the
 * original placeholder, so anything later edited in the dashboard is never overwritten.
 */

export const LOGO = {
  file: "utm-logo.png",
  alt: "Universal Trinity Ministry logo: Christ with open arms above a globe, with the words You are no longer a Slave, Galatians 4:7",
};

export const MOTTO = {
  local: "Kristo Nti, Yeyɛ Adehyieɛ",
  english: "Through Christ, We Reign.",
};

export const FOOTER_TEXT = `${MOTTO.local}. ${MOTTO.english}`;

export interface OfficialSection {
  key: string;
  page: string;
  title: string;
  sortOrder: number;
  body: string;
}

export const ABOUT_SECTIONS: OfficialSection[] = [
  {
    key: "about.overview",
    page: "about",
    title: "Who we are",
    sortOrder: 1,
    body: "Universal Trinity Ministry (UTM) is a dynamic and spirit-filled Christian organization dedicated to spreading the Gospel of Jesus Christ, transforming lives, and building a strong, faith-based community. Rooted in the Word of God, UTM fosters an environment of worship, discipleship, and service, equipping believers to grow spiritually and fulfill their divine purpose. Our ministry is committed to nurturing a culture of love, unity, and holiness while engaging in impactful outreach initiatives that uplift society.",
  },
  {
    key: "about.mission",
    page: "about",
    title: "Our Mission",
    sortOrder: 2,
    body: "To glorify God by leading people into a personal relationship with Jesus Christ, empowering them through sound biblical teachings, and equipping them to serve in their communities with love, integrity, and excellence.",
  },
  {
    key: "about.vision",
    page: "about",
    title: "Our Vision",
    sortOrder: 3,
    body: "To be a beacon of light and transformation, inspiring believers to live out their faith boldly and influencing the world through the power of the Holy Spirit, effective ministry, and Christ-centered service.",
  },
  {
    key: "about.motto",
    page: "about",
    title: "Our Motto",
    sortOrder: 4,
    body: `${MOTTO.local}

${MOTTO.english}

In Christ, we find our identity, strength, authority and purpose. We are called not merely to exist but to live victoriously, serve faithfully and reign through the grace of our Lord Jesus Christ.`,
  },
  {
    key: "about.values",
    page: "about",
    title: "Our Values",
    sortOrder: 5,
    body: `- **Faith.** We believe in the absolute power and authority of God's Word.
- **Love.** We demonstrate Christ-like love to all people, regardless of background or status.
- **Integrity.** We uphold honesty, transparency, and righteousness in all our dealings.
- **Unity.** We promote harmony within the body of Christ and work collaboratively to fulfill God's mandate.
- **Excellence.** We strive for the highest standards in ministry, service, and leadership.
- **Service.** We are committed to serving God and humanity with humility and dedication.
- **Discipleship.** We are passionate about mentoring and raising disciples for Christ.`,
  },
  {
    key: "about.objectives",
    page: "about",
    title: "Our Objectives",
    sortOrder: 6,
    body: `1. To preach the unadulterated Word of God, leading souls to salvation through Jesus Christ.
2. To disciple believers, equipping them with biblical knowledge and practical skills for spiritual growth.
3. To foster a culture of prayer, worship, and fasting, seeking God's presence in all aspects of life.
4. To promote unity and fellowship among believers, encouraging love and mutual support within the body of Christ.
5. To engage in humanitarian and community outreach programs that address social, economic, and spiritual needs.
6. To mentor and train future leaders in ministry, instilling in them the values of servant leadership.
7. To leverage media and technology to spread the Gospel to a global audience.`,
  },
  {
    key: "about.goals",
    page: "about",
    title: "Our Goals",
    sortOrder: 7,
    body: `1. To expand our ministry outreach by establishing more branches and fellowships worldwide.
2. To build a strong, Bible-based educational system that nurtures believers in faith and doctrine.
3. To develop sustainable programs that address social challenges such as poverty, education, and health care.
4. To organize large-scale evangelistic crusades, revival programs, and conferences to win souls for Christ.
5. To foster interdenominational collaborations that strengthen the global Christian community.
6. To establish a state-of-the-art worship center that serves as a hub for prayer, training, and fellowship.
7. To develop digital evangelism platforms to reach the world with the Gospel through social media, podcasts, and television.

At Universal Trinity Ministry (UTM), we believe that through faith, love, and commitment to God's work, we can transform lives and nations for the glory of God.`,
  },
  {
    key: "about.congregations",
    page: "about",
    title: "Our Congregations",
    sortOrder: 8,
    body: `- **Ebenezer Temple**, Adenta Frafraha. Resident Minister: Rev. Charles Gakpla.
- **Holy Ghost Temple**, Somanya. Minister: Rev. Betty Boafo.
- **Shiloh Emmanuel Temple**, Adaam, Dodowa. Minister: Rev. Kofi Asante Mensah.
- **Miracle Temple**, Ayikuma. Minister: Pastor Charity Brew.`,
  },
];
