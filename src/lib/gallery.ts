/*
 * Photographs shared by the ministry (November 2026), served from public/images/gallery.
 * Alt text describes what is visible; only Bishop Esther Korkor Wilson is named.
 */

export interface GalleryPhoto {
  file: string;
  alt: string;
  width: number;
  height: number;
}

export interface GalleryGroup {
  id: string;
  title: string;
  photos: GalleryPhoto[];
}

export const GALLERY: readonly GalleryGroup[] = [
  {
    id: "worship",
    title: "Worship and fellowship",
    photos: [
      { file: "minister-preaching-gown.jpg", alt: "A minister in blue and gold academic robes preaches with passion at a glass pulpit", width: 853, height: 1280 },
      { file: "congregation-white.jpg", alt: "Members of the congregation dressed in white during a service", width: 1080, height: 720 },
      { file: "bishop-wilson-white.jpg", alt: "Bishop Esther Korkor Wilson in a white lace dress and silver hat", width: 840, height: 1079 },
      { file: "women-praise.jpg", alt: "Women of the congregation dance and wave white handkerchiefs in praise", width: 1080, height: 720 },
      { file: "worship-solo.jpg", alt: "A worshipper in kente sings during the service", width: 720, height: 1080 },
      { file: "ministers-seated.jpg", alt: "Ministers seated on the platform during a service", width: 1080, height: 720 },
      { file: "women-fellowship-joy.jpg", alt: "Women in white and blue smile together during a fellowship gathering", width: 720, height: 1080 },
      { file: "congregation-women.jpg", alt: "Women of the congregation in white attire during worship", width: 1080, height: 720 },
      { file: "minister-preaching-joy.jpg", alt: "A minister in academic robes smiles while preaching", width: 720, height: 1080 },
      { file: "minister-pulpit.jpg", alt: "A minister in academic robes speaks from the pulpit beside Christmas decorations", width: 1080, height: 720 },
      { file: "service-address.jpg", alt: "A minister addresses the congregation as a young man stands beside him", width: 1080, height: 720 },
      { file: "minister-prayer.jpg", alt: "A minister in a clerical collar prays during worship", width: 720, height: 1080 },
      { file: "congregation-seated.jpg", alt: "Members of the congregation seated together during a service", width: 1080, height: 720 },
      { file: "ministers-platform.jpg", alt: "Ministers in clerical attire seated together on the platform", width: 1080, height: 720 },
    ],
  },
  {
    id: "school",
    title: "Universal Trinity Basic School",
    photos: [
      { file: "school-hands-raised.jpg", alt: "Pupils raise their hands together in a bright classroom", width: 809, height: 1080 },
      { file: "school-lunch-boxes.jpg", alt: "Young pupils enjoy a meal from lunch boxes around a table", width: 1080, height: 809 },
      { file: "school-party-table.jpg", alt: "Pupils gather around a table set with drinks and sweets", width: 809, height: 1080 },
      { file: "school-girls-meal.jpg", alt: "Pupils in their best clothes share a meal at a round table", width: 1080, height: 809 },
      { file: "school-classroom-meal.jpg", alt: "Pupils share a meal around a classroom table", width: 1080, height: 809 },
    ],
  },
];
