import { experience, publications } from './siteData';

const icassp2025 = publications.find((item) => item.title === 'Personalized Live Sound Recognition Using Efficient PANNs [Show and Tell]');
if (icassp2025) {
  icassp2025.authors = 'Arshdeep Singh; Haohe Liu; Gabriel Bibbó; Thomas Deacon; Mark D. Plumbley';
}

const surreyCurrent = experience.find((item) => item.period === 'Dec.2025-Present');
if (surreyCurrent) {
  surreyCurrent.title = 'Visiting Researcher (collaboration)';
  surreyCurrent.org = 'University of Surrey, Remote';
}

const tuDelftIndex = experience.findIndex((item) => item.org.includes('TU Delft'));
if (tuDelftIndex !== -1) {
  experience.splice(tuDelftIndex, 1);
}
