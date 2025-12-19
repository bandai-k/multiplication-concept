// data/kukuSoundData.ts
export type KukuSoundItem = {
  a: number;        // 段
  b: number;        // 掛ける数
  reading: string; // 正式な読み（ひらがな）
  result: number;  // 答え（表示・将来用）
};

export const KUKU_SOUND_DATA: KukuSoundItem[] = [
  // 一の段
  { a: 1, b: 1, reading: "いんいち が いち", result: 1 },
  { a: 1, b: 2, reading: "いんに が に", result: 2 },
  { a: 1, b: 3, reading: "いんさん が さん", result: 3 },
  { a: 1, b: 4, reading: "いんし が し", result: 4 },
  { a: 1, b: 5, reading: "いんご が ご", result: 5 },
  { a: 1, b: 6, reading: "いんろく が ろく", result: 6 },
  { a: 1, b: 7, reading: "いんしち が しち", result: 7 },
  { a: 1, b: 8, reading: "いんはち が はち", result: 8 },
  { a: 1, b: 9, reading: "いんく が く", result: 9 },

  // 二の段
  { a: 2, b: 1, reading: "にいち が に", result: 2 },
  { a: 2, b: 2, reading: "ににん が し", result: 4 },
  { a: 2, b: 3, reading: "にさん が ろく", result: 6 },
  { a: 2, b: 4, reading: "にし が はち", result: 8 },
  { a: 2, b: 5, reading: "にご じゅう", result: 10 },
  { a: 2, b: 6, reading: "にろく じゅうに", result: 12 },
  { a: 2, b: 7, reading: "にしち じゅうし", result: 14 },
  { a: 2, b: 8, reading: "にはち じゅうろく", result: 16 },
  { a: 2, b: 9, reading: "にく じゅうはち", result: 18 },

  // 三の段
  { a: 3, b: 1, reading: "さんいち が さん", result: 3 },
  { a: 3, b: 2, reading: "さんに が ろく", result: 6 },
  { a: 3, b: 3, reading: "さざん が きゅう", result: 9 },
  { a: 3, b: 4, reading: "さんし じゅうに", result: 12 },
  { a: 3, b: 5, reading: "さんご じゅうご", result: 15 },
  { a: 3, b: 6, reading: "さぶろく じゅうはち", result: 18 },
  { a: 3, b: 7, reading: "さんしち にじゅういち", result: 21 },
  { a: 3, b: 8, reading: "さんぱ にじゅうし", result: 24 },
  { a: 3, b: 9, reading: "さんく にじゅうしち", result: 27 },

  // 四の段
  { a: 4, b: 1, reading: "しいち が し", result: 4 },
  { a: 4, b: 2, reading: "しに が はち", result: 8 },
  { a: 4, b: 3, reading: "しさん じゅうに", result: 12 },
  { a: 4, b: 4, reading: "しし じゅうろく", result: 16 },
  { a: 4, b: 5, reading: "しご にじゅう", result: 20 },
  { a: 4, b: 6, reading: "しろく にじゅうし", result: 24 },
  { a: 4, b: 7, reading: "しちし にじゅうはち", result: 28 },
  { a: 4, b: 8, reading: "しちは さんじゅうに", result: 32 },
  { a: 4, b: 9, reading: "しく さんじゅうろく", result: 36 },

  // 五の段
  { a: 5, b: 1, reading: "ごいち が ご", result: 5 },
  { a: 5, b: 2, reading: "ごに じゅう", result: 10 },
  { a: 5, b: 3, reading: "ごさん じゅうご", result: 15 },
  { a: 5, b: 4, reading: "ごし にじゅう", result: 20 },
  { a: 5, b: 5, reading: "ごご にじゅうご", result: 25 },
  { a: 5, b: 6, reading: "ごろく さんじゅう", result: 30 },
  { a: 5, b: 7, reading: "ごしち さんじゅうご", result: 35 },
  { a: 5, b: 8, reading: "ごは しじゅう", result: 40 },
  { a: 5, b: 9, reading: "ごっく しじゅうご", result: 45 },

  // 六の段
  { a: 6, b: 1, reading: "ろくいち が ろく", result: 6 },
  { a: 6, b: 2, reading: "ろくに じゅうに", result: 12 },
  { a: 6, b: 3, reading: "ろくさん じゅうはち", result: 18 },
  { a: 6, b: 4, reading: "ろくし にじゅうし", result: 24 },
  { a: 6, b: 5, reading: "ろくご さんじゅう", result: 30 },
  { a: 6, b: 6, reading: "ろくろく さんじゅうろく", result: 36 },
  { a: 6, b: 7, reading: "ろくしち しじゅうに", result: 42 },
  { a: 6, b: 8, reading: "ろくは しじゅうはち", result: 48 },
  { a: 6, b: 9, reading: "ろっく ごじゅうし", result: 54 },

  // 七の段
  { a: 7, b: 1, reading: "しちいち が しち", result: 7 },
  { a: 7, b: 2, reading: "しちに じゅうし", result: 14 },
  { a: 7, b: 3, reading: "しちさん にじゅういち", result: 21 },
  { a: 7, b: 4, reading: "しちし にじゅうはち", result: 28 },
  { a: 7, b: 5, reading: "しちご さんじゅうご", result: 35 },
  { a: 7, b: 6, reading: "しちろく しじゅうに", result: 42 },
  { a: 7, b: 7, reading: "しちしち しじゅうく", result: 49 },
  { a: 7, b: 8, reading: "しちは ごじゅうろく", result: 56 },
  { a: 7, b: 9, reading: "しちく ろくじゅうさん", result: 63 },

  // 八の段
  { a: 8, b: 1, reading: "はちいち が はち", result: 8 },
  { a: 8, b: 2, reading: "はちに じゅうろく", result: 16 },
  { a: 8, b: 3, reading: "はちさん にじゅうし", result: 24 },
  { a: 8, b: 4, reading: "はちし さんじゅうに", result: 32 },
  { a: 8, b: 5, reading: "はちご しじゅう", result: 40 },
  { a: 8, b: 6, reading: "はちろく しじゅうはち", result: 48 },
  { a: 8, b: 7, reading: "はちしち ごじゅうろく", result: 56 },
  { a: 8, b: 8, reading: "はっぱ ろくじゅうし", result: 64 },
  { a: 8, b: 9, reading: "はっく しちじゅうに", result: 72 },

  // 九の段
  { a: 9, b: 1, reading: "くいち が く", result: 9 },
  { a: 9, b: 2, reading: "くに じゅうはち", result: 18 },
  { a: 9, b: 3, reading: "くさん にじゅうしち", result: 27 },
  { a: 9, b: 4, reading: "くし さんじゅうろく", result: 36 },
  { a: 9, b: 5, reading: "くご しじゅうご", result: 45 },
  { a: 9, b: 6, reading: "くろく ごじゅうし", result: 54 },
  { a: 9, b: 7, reading: "くしち ろくじゅうさん", result: 63 },
  { a: 9, b: 8, reading: "くは しちじゅうに", result: 72 },
  { a: 9, b: 9, reading: "くく はちじゅういち", result: 81 },
];
