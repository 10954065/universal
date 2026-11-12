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
