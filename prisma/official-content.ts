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

export interface OfficialLeader {
  slug: string;
  name: string;
  role: string;
  /** Portrait in public/images/ministry, when the ministry supplied one. */
  photo?: string;
  bio: string;
}

export const LEADERS: OfficialLeader[] = [
  {
    slug: "esther-korkor-wilson",
    name: "Bishop Esther Korkor Wilson",
    role: "General Overseer",
    photo: "leader-esther-korkor-wilson.jpg",
    bio: `A visionary woman of faith, a servant of God, a spiritual leader and a builder of lives and destinies.

Bishop Esther Korkor Wilson is the General Overseer of Universal Trinity Ministry (UTM), a Christian ministry committed to preaching the Gospel of Jesus Christ, raising spiritually mature believers, transforming lives and advancing the Kingdom of God.

As the spiritual head of the ministry, Bishop Wilson provides visionary leadership, spiritual direction and ministerial oversight, guiding the church towards the fulfillment of its divine mandate. Her leadership is anchored in the conviction that the Church must be a place where people encounter God, discover their purpose, grow in faith and become agents of positive transformation in their families, communities and the world.

With a heart devoted to God's work, she is committed to building a ministry founded on sound biblical principles, prayer, holiness, love, unity and the power of the Holy Spirit. Her passion is to see individuals and families experience the transforming grace of God and develop an enduring relationship with Jesus Christ.

### A Visionary Leader and Builder of God's Kingdom

Bishop Wilson's leadership philosophy places strong emphasis on spiritual growth, effective discipleship, ministerial development and purposeful Christian living. She recognizes that the growth of the Church is not measured merely by the number of people who attend services, but also by the lives transformed, disciples raised, families strengthened and communities positively impacted through the Gospel.

Under her spiritual leadership, Universal Trinity Ministry continues to pursue its commitment to evangelism, prayer, biblical teaching, pastoral care and community engagement.

She values the importance of developing and empowering ministers, church workers, men, women, young people and children to recognize their God-given potential and actively participate in the work of the ministry.

### A Heart for Spiritual Growth and Human Transformation

Bishop Wilson believes that every believer has a divine purpose and a responsibility to contribute to the advancement of God's Kingdom. Her vision for the Church extends beyond the four walls of the sanctuary to embrace society through Christian values, compassion, service and practical expressions of God's love.

She champions a ministry where:

- The Word of God remains the foundation of faith and Christian living.
- Prayer and worship occupy a central place in the life of every believer.
- Ministers and church leaders are equipped to serve with integrity and excellence.
- Women are empowered to fulfil their God-given assignments.
- Young people are nurtured into responsible and purpose-driven Christian leaders.
- Children are introduced to Christ and grounded in godly values.
- Communities experience the positive impact of Christian love and service.

### Her Leadership and Legacy

As General Overseer, Bishop Esther Korkor Wilson carries the responsibility of providing spiritual oversight and sustaining the vision, values and institutional growth of Universal Trinity Ministry.

Her desire is to see UTM become an increasingly influential Christian ministry, raising a generation of believers who are spiritually grounded, morally upright, socially responsible and committed to the Great Commission.

She understands that true spiritual leadership is demonstrated through service, sacrifice, humility, consistency and faithfulness to God's calling.

Her ultimate aspiration is to leave a legacy of transformed lives, strong Christian families, empowered ministers and a thriving ministry that will continue to impact generations for Christ.

### Her Guiding Conviction

At the heart of Bishop Wilson's leadership is the ministry's motto: ${MOTTO.local}, ${MOTTO.english}

This declaration reflects her conviction that through Jesus Christ, believers are empowered to overcome challenges, walk in their divine purpose, exercise godly influence and live victorious Christian lives.

**Bishop Esther Korkor Wilson is committed to one enduring assignment: raising a people who know God, live by His Word, walk in His power and become instruments of His glory.**`,
  },
  {
    slug: "solomon-yartey",
    name: "Rev. Solomon Yartey",
    role: "Head of Ministers",
    photo: "leader-solomon-yartey.jpg",
    bio: `Rev. Solomon Yartey serves as the Head of Ministers of Universal Trinity Ministry. He provides ministerial leadership, coordination and oversight, helping to strengthen the spiritual and administrative effectiveness of the ministry.

His role involves supporting and guiding fellow ministers, promoting sound biblical doctrine, encouraging ministerial discipline and fostering unity among the pastoral team. He is committed to advancing the vision and mission of UTM through effective leadership, spiritual guidance and dedicated service to God's Kingdom.`,
  },
  {
    slug: "charles-gakpla",
    name: "Rev. Charles Gakpla",
    role: "Resident Minister, Ebenezer Temple",
    photo: "leader-charles-gakpla.jpg",
    bio: `Rev. Charles Gakpla serves as the Resident Minister of Ebenezer Temple, UTM, Adenta Frafraha. He is responsible for providing spiritual leadership and pastoral care to the congregation.

Through preaching, teaching, prayer, counseling and discipleship, he works to nurture the spiritual growth of members and strengthen the Church's commitment to evangelism, fellowship and Christian service. His ministry is focused on building a vibrant congregation grounded in the Word of God.`,
  },
  {
    slug: "betty-boafo",
    name: "Rev. Betty Boafo",
    role: "Minister, Holy Ghost Temple",
    photo: "leader-betty-boafo.jpg",
    bio: `Rev. Betty Boafo serves as the Minister of Holy Ghost Temple, UTM, Somanya. She is committed to nurturing believers in their relationship with God through sound biblical teachings, prayer, worship and pastoral ministry.

Her assignment includes providing spiritual guidance, encouraging Christian maturity and building a united congregation that demonstrates the love of Christ. She is dedicated to advancing the work of the Gospel and empowering members to become effective witnesses of Jesus Christ.`,
  },
  {
    slug: "kofi-asante-mensah",
    name: "Rev. Kofi Asante Mensah",
    role: "Minister, Shiloh Emmanuel Temple",
    photo: "leader-kofi-asante-mensah.jpg",
    bio: `Rev. Kofi Asante Mensah serves as the Minister of Shiloh Emmanuel Temple, Universal Trinity Ministry, Adaam, Dodowa.

He is passionate about preaching the Gospel, teaching the undiluted Word of God, raising disciples and inspiring people to discover and fulfill their God-given purpose. His ministry emphasizes spiritual transformation, leadership development, evangelism, prayer and community impact.

With a strong commitment to Christian ministry, media engagement, youth development and public communication, he believes in using every available platform to spread the Gospel, inspire hope and positively transform lives.

His vision is to build a spiritually vibrant, united and purpose-driven congregation where individuals and families are equipped to live out their faith and serve God with excellence.`,
  },
  {
    slug: "charity-brew",
    name: "Pastor Charity Brew",
    role: "Minister, Miracle Temple",
    bio: `Pastor Charity Brew serves at Miracle Temple, Universal Trinity Ministry, Ayikuma. She is dedicated to the spiritual development and wellbeing of the congregation through prayer, biblical instruction, pastoral support and Christian fellowship.

Her ministry is centered on nurturing faith, encouraging spiritual growth and helping believers develop a deeper relationship with Jesus Christ. She is committed to building a loving and supportive church community where people are encouraged to discover their purpose and serve God faithfully.`,
  },
  {
    slug: "john-kofi-nimo",
    name: "Elder John Kofi Nimo",
    role: "Church Elder, Miracle Temple",
    bio: `Elder John Kofi Nimo serves as a church leader at Miracle Temple, Universal Trinity Ministry, Ayikuma.

As an Elder, he contributes to the spiritual growth, leadership and general wellbeing of the congregation. He supports pastoral ministry, encourages Christian discipline, promotes unity and provides guidance to members.

His service reflects the biblical principle of servant leadership, demonstrating the importance of commitment, humility, faithfulness and dedication to the work of God.`,
  },
];

export interface OfficialMinistry {
  slug: string;
  /** Slug of the draft suggestion this replaces, if the seed created one earlier. */
  legacySlug?: string;
  name: string;
  summary: string;
  description: string;
  image: string;
}

export const FELLOWSHIPS: OfficialMinistry[] = [
  {
    slug: "mens-fellowship",
    legacySlug: "mens-fellowship",
    name: "Men Fellowship",
    summary: "Raising godly, responsible, disciplined and visionary men who will positively influence their families, the Church and society.",
    image: "men-group.jpg",
    description: `The Men Fellowship of Universal Trinity Ministry is committed to raising godly, responsible, disciplined and visionary men who will positively influence their families, the Church and society.

The fellowship provides a platform for men to grow spiritually, strengthen one another through prayer and the Word of God, share experiences, and develop leadership qualities. It also encourages men to embrace their God-given responsibilities as husbands, fathers, leaders and agents of positive transformation.

### Our focus

- Spiritual growth and maturity among men.
- Promoting responsible fatherhood and godly leadership.
- Strengthening marriages and families.
- Encouraging brotherhood, accountability and mutual support.
- Empowering men to become positive role models in society.`,
  },
  {
    slug: "womens-fellowship",
    legacySlug: "womens-fellowship",
    name: "Women Fellowship",
    summary: "Empowering women to discover their God-given purpose, develop their spiritual gifts and become influential instruments of God's love and transformation.",
    image: "women-group.jpg",
    description: `The Women Fellowship of UTM is dedicated to empowering women to discover their God-given purpose, develop their spiritual gifts and become influential instruments of God's love and transformation.

We create an atmosphere where women can fellowship, pray, learn, encourage one another and grow in their walk with Christ. We also promote women's leadership, family values, entrepreneurship and community development.

### Our focus

- Raising spiritually strong and purpose-driven women.
- Promoting prayer, holiness and biblical values.
- Empowering women for leadership and service.
- Strengthening marriages, homes and family relationships.
- Supporting women through mentorship, encouragement and outreach.
- Developing the talents, gifts and potential of women.`,
  },
  {
    slug: "youth-fellowship",
    legacySlug: "youth-ministry",
    name: "Youth Fellowship",
    summary: "Raising a generation of Christ-centered, purpose-driven, innovative and responsible young people who will positively impact their generation.",
    image: "youth-member.jpg",
    description: `The Youth Fellowship of Universal Trinity Ministry is committed to raising a generation of Christ-centered, purpose-driven, innovative and responsible young people who will positively impact their generation.

We believe that young people are not merely the future of the Church; they are an essential part of the Church today. Through Bible studies, prayer meetings, mentorship, talent development, leadership training and social engagement, we equip young people to overcome life's challenges and fulfill their divine purpose.

### Our focus

- Building a strong spiritual foundation among young people.
- Promoting godly character, discipline and moral values.
- Discovering and developing young people's talents and leadership potential.
- Providing mentorship, counseling and career guidance.
- Encouraging entrepreneurship, innovation and responsible citizenship.
- Using music, media, technology, arts and sports for positive influence and evangelism.`,
  },
  {
    slug: "childrens-service",
    legacySlug: "childrens-ministry",
    name: "Children's Service",
    summary: "A safe, welcoming and spiritually enriching place where children learn to know God, love Jesus Christ and grow in godly values.",
    image: "children-ministry.jpg",
    description: `At Universal Trinity Ministry, we believe that children are a precious gift from God and must be nurtured in the knowledge, love and fear of the Lord.

Our Children's Service provides a safe, welcoming and spiritually enriching environment where children learn biblical principles through age-appropriate Bible lessons, songs, storytelling, drama, prayers, games and interactive activities.

Our desire is to raise a generation of children who know God, love Jesus Christ, understand His Word and develop godly values from an early age.

### Our focus

- Introducing children to Jesus Christ and the teachings of the Bible.
- Building strong Christian values and godly character.
- Encouraging prayer, worship and obedience to God's Word.
- Discovering and nurturing children's spiritual gifts and talents.
- Developing confidence, creativity and leadership skills.
- Promoting child safety, inclusion and positive relationships.`,
  },
];

export const MINISTRY_SECTIONS: OfficialSection[] = [
  {
    key: "ministries.intro",
    page: "ministries",
    title: "Our Fellowship Groups",
    sortOrder: 1,
    body: "Universal Trinity Ministry (UTM) believes that the Church is more than a place of worship; it is a family of believers called to grow together in faith, love, unity and service. Through our various fellowship groups and ministries, we provide opportunities for members of all ages and backgrounds to develop their spiritual gifts, build meaningful relationships and contribute to the growth of God's Kingdom.",
  },
];

export const LEADERSHIP_SECTIONS: OfficialSection[] = [
  {
    key: "leadership.intro",
    page: "leadership",
    title: "Our Reverend Ministers and Church Leaders",
    sortOrder: 1,
    body: "Universal Trinity Ministry is blessed with dedicated ministers and church leaders who serve with faith, commitment and a passion for the Gospel of Jesus Christ. Through their various assignments, they provide spiritual leadership, pastoral care, biblical teaching and guidance to the congregations entrusted to them.",
  },
  {
    key: "leadership.commitment",
    page: "leadership",
    title: "Our Commitment to Spiritual Leadership",
    sortOrder: 2,
    body: `At Universal Trinity Ministry, we recognize that effective ministry requires more than titles and positions. It demands humility, integrity, spiritual maturity, accountability and a genuine commitment to serving God and humanity.

We therefore encourage all our ministers, elders, fellowship leaders and church workers to uphold the highest standards of Christian conduct and leadership.

Our commitment is to:

1. Preach and uphold the uncompromised Word of God.
2. Promote unity and cooperation among all UTM congregations.
3. Develop and empower the next generation of Christian leaders.
4. Provide compassionate pastoral care and spiritual guidance.
5. Strengthen evangelism, discipleship and community outreach.
6. Maintain excellence, transparency and accountability in ministry.`,
  },
];
