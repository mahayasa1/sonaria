export type Difficulty = 'Beginner' | 'Intermediate' | 'Advanced';

export interface InstrumentDetail {
    description: string;
    characteristics: string[];
    advantages: string[];
    challenges: string[];
}

/**
 * Konten deskriptif per instrument (karakteristik, kelebihan, tantangan).
 * Dipetakan berdasarkan nama instrument dari InstrumentSeeder.
 */
export const INSTRUMENT_DETAILS: Record<string, InstrumentDetail> = {
    'Drum Set': {
        description:
            'DRUM SET ADALAH ALAT MUSIK PERKUSI YANG TERDIRI DARI BEBERAPA KOMPONEN SEPERTI BASS DRUM, SNARE, TOM, DAN CYMBAL. DRUM DIGUNAKAN UNTUK MEMBANGUN RITME DAN MENJAGA TEMPO DALAM BERBAGAI JENIS MUSIK.',
        characteristics: [
            'SUARA: KUAT DAN RITMIS',
            'TERDIRI DARI BEBERAPA DRUM',
            'DIMAINKAN DENGAN STICK DAN PEDAL',
            'MENJAGA TEMPO MUSIK',
            'POLA RITME BERAGAM',
        ],
        advantages: [
            'MUDAH MEMAHAMI RITME',
            'COCOK UNTUK BERBAGAI GENRE',
            'MELATIH KOORDINASI',
        ],
        challenges: [
            'KOORDINASI TANGAN DAN KAKI',
            'MEMBUTUHKAN KONTROL TEMPO',
            'MEMERLUKAN RUANG',
        ],
    },
    Kendang: {
        description:
            'KENDANG ADALAH ALAT MUSIK PERKUSI TRADISIONAL INDONESIA YANG DIMAINKAN DENGAN TANGAN. KENDANG BERPERAN PENTING DALAM MENGATUR IRAMA PADA MUSIK TRADISIONAL, TERUTAMA GAMELAN DAN MUSIK DAERAH.',
        characteristics: [
            'SUARA: DALAM DAN TAJAM',
            'TERBUAT DARI KAYU DAN KULIT',
            'DIMAINKAN MENGGUNAKAN TANGAN',
            'MEMILIKI BERAGAM POLA RITME',
            'BERPERAN SEBAGAI PENGATUR IRAMA',
        ],
        advantages: [
            'MEMPERKENALKAN MUSIK TRADISIONAL',
            'MELATIH KEPEKAAN RITME',
            'TEKNIK DASAR CUKUP MUDAH',
        ],
        challenges: [
            'MEMBUTUHKAN KOORDINASI TANGAN',
            'POLA RITME CUKUP KOMPLEKS',
            'MEMBUTUHKAN LATIHAN KONSISTEN',
        ],
    },
    Marimba: {
        description:
            'MARIMBA ADALAH ALAT MUSIK PERKUSI BERPENADA YANG MEMILIKI BILAH-BILAH KAYU DENGAN UKURAN BERBEDA. MARIMBA DIMAINKAN DENGAN MALLET DAN MAMPU MENGHASILKAN NADA YANG HANGAT SERTA KAYA.',
        characteristics: [
            'SUARA: HANGAT DAN LEMBUT',
            'MEMILIKI BILAH KAYU BERPENADA',
            'DIMAINKAN DENGAN MALLET',
            'MEMILIKI RENTANG NADA LUAS',
            'DAPAT MEMAINKAN MELODI',
        ],
        advantages: [
            'SUARA UNIK DAN INDAH',
            'DAPAT MEMAINKAN MELODI',
            'MELATIH KEPEKAAN NADA',
        ],
        challenges: [
            'MEMBUTUHKAN KOORDINASI TINGGI',
            'POSISI NADA HARUS DIHAFAL',
            'UKURAN ALAT CUKUP BESAR',
        ],
    },
    Seruling: {
        description:
            'SERULING ADALAH ALAT MUSIK TIUP YANG MENGHASILKAN SUARA DARI GETARAN UDARA DI DALAM TABUNG. SERULING BANYAK DIGUNAKAN DALAM MUSIK TRADISIONAL MAUPUN MODERN DAN MEMILIKI SUARA YANG RINGAN.',
        characteristics: [
            'SUARA: LEMBUT DAN CERAH',
            'DIMAINKAN DENGAN MENIUP',
            'MEMILIKI LUBANG NADA',
            'BENTUKNYA RINGAN DAN SEDERHANA',
            'DAPAT MEMAINKAN MELODI',
        ],
        advantages: [
            'MUDAH DIBAWA',
            'TEKNIK DASAR SEDERHANA',
            'HARGA RELATIF TERJANGKAU',
        ],
        challenges: [
            'KONTROL NAPAS',
            'KETEPATAN NADA',
            'MEMBUTUHKAN LATIHAN PERNAPASAN',
        ],
    },
    Klarinet: {
        description:
            'KLARINET ADALAH ALAT MUSIK TIUP KAYU YANG MENGGUNAKAN REED UNTUK MENGHASILKAN SUARA. KLARINET MEMILIKI KARAKTER SUARA YANG FLEKSIBEL DAN BANYAK DIGUNAKAN DALAM ORKESTRA, JAZZ, DAN MUSIK POP.',
        characteristics: [
            'SUARA: LEMBUT DAN JERNIH',
            'MENGGUNAKAN SINGLE REED',
            'MEMILIKI BANYAK TOMBOL',
            'RENTANG NADA CUKUP LUAS',
            'COCOK UNTUK MELODI',
        ],
        advantages: [
            'SUARA FLEKSIBEL',
            'COCOK UNTUK BERBAGAI GENRE',
            'RENTANG NADA LUAS',
        ],
        challenges: [
            'KONTROL NAPAS',
            'TEKNIK JARI CUKUP KOMPLEKS',
            'PERAWATAN REED',
        ],
    },
    Saksofon: {
        description:
            'SAKSOFON ADALAH ALAT MUSIK TIUP YANG TERBUAT DARI LOGAM DAN MENGGUNAKAN REED. SAKSOFON MEMILIKI SUARA YANG KHAS DAN SERING DIGUNAKAN DALAM JAZZ, POP, ROCK, DAN BERBAGAI MUSIK MODERN.',
        characteristics: [
            'SUARA: TEBAL DAN EKSPRESIF',
            'TERBUAT DARI LOGAM',
            'MENGGUNAKAN SINGLE REED',
            'MEMILIKI TOMBOL NADA',
            'BANYAK DIGUNAKAN DALAM JAZZ',
        ],
        advantages: [
            'SUARA KHAS DAN KUAT',
            'COCOK UNTUK BANYAK GENRE',
            'EKSPRESI MUSIK SANGAT LUAS',
        ],
        challenges: [
            'MEMBUTUHKAN KONTROL NAPAS',
            'TEKNIK EMBOUCHURE',
            'UKURAN CUKUP BESAR',
        ],
    },
    Trompet: {
        description:
            'TROMPET ADALAH ALAT MUSIK TIUP LOGAM YANG MENGHASILKAN SUARA MELALUI GETARAN BIBIR PADA MOUTHPIECE. TROMPET MEMILIKI SUARA CERAH DAN KUAT SERTA SERING DIGUNAKAN DALAM BAND, JAZZ, DAN ORKESTRA.',
        characteristics: [
            'SUARA: CERAH DAN LANTANG',
            'TERBUAT DARI LOGAM',
            'MENGGUNAKAN MOUTHPIECE',
            'MEMILIKI TIGA VALVE',
            'RENTANG NADA CUKUP LUAS',
        ],
        advantages: [
            'SUARA KUAT DAN JELAS',
            'BANYAK DIGUNAKAN DALAM BAND',
            'MUDAH DIBAWA',
        ],
        challenges: ['KONTROL NAPAS', 'KEKUATAN BIBIR', 'KETEPATAN NADA'],
    },
    Trombon: {
        description:
            'TROMBON ADALAH ALAT MUSIK TIUP LOGAM YANG MENGGUNAKAN SLIDE UNTUK MENGUBAH PANJANG TABUNG DAN NADA. TROMBON MEMILIKI SUARA YANG KUAT DAN DALAM SERTA SERING DIGUNAKAN DALAM BAND DAN ORKESTRA.',
        characteristics: [
            'SUARA: KUAT DAN DALAM',
            'MENGGUNAKAN SLIDE',
            'TERBUAT DARI LOGAM',
            'TIDAK MENGGUNAKAN VALVE',
            'MEMILIKI KARAKTER SUARA KHAS',
        ],
        advantages: [
            'SUARA KUAT DAN EKSPRESIF',
            'TEKNIK SLIDE UNIK',
            'COCOK UNTUK ENSEMBLE',
        ],
        challenges: [
            'KETEPATAN POSISI SLIDE',
            'KONTROL NAPAS',
            'MEMBUTUHKAN LATIHAN INTONASI',
        ],
    },
    'French Horn': {
        description:
            'FRENCH HORN ADALAH ALAT MUSIK TIUP LOGAM DENGAN BENTUK TABUNG YANG MELINGKAR. ALAT INI MEMILIKI SUARA YANG LEMBUT, DALAM, DAN KAYA SERTA BANYAK DIGUNAKAN DALAM ORKESTRA.',
        characteristics: [
            'SUARA: HANGAT DAN DALAM',
            'TABUNG BERBENTUK MELINGKAR',
            'MENGGUNAKAN VALVE',
            'RENTANG NADA LUAS',
            'BANYAK DIGUNAKAN DALAM ORKESTRA',
        ],
        advantages: [
            'WARNA SUARA SANGAT KHAS',
            'RENTANG NADA LUAS',
            'COCOK UNTUK HARMONI',
        ],
        challenges: [
            'TEKNIK NAPAS KOMPLEKS',
            'INTONASI SULIT DIKONTROL',
            'MEMBUTUHKAN LATIHAN TINGGI',
        ],
    },
    'Gitar Akustik': {
        description:
            'GITAR AKUSTIK ADALAH ALAT MUSIK PETIK YANG MENGHASILKAN SUARA MELALUI GETARAN SENAR DAN RESONANSI BADAN GITAR. ALAT INI POPULER KARENA DAPAT DIGUNAKAN UNTUK MEMAINKAN AKOR, MELODI, DAN IRINGAN LAGU.',
        characteristics: [
            'SUARA: HANGAT DAN NATURAL',
            'MEMILIKI ENAM SENAR',
            'DIMAINKAN DENGAN PETIKAN',
            'MEMILIKI FRET DAN NECK',
            'DAPAT MEMAINKAN AKOR',
        ],
        advantages: [
            'MUDAH DIBAWA',
            'COCOK UNTUK PEMULA',
            'BANYAK DIGUNAKAN DALAM MUSIK',
        ],
        challenges: [
            'JARI AWALNYA MUDAH SAKIT',
            'PERPINDAHAN AKOR',
            'KETEPATAN PETIKAN',
        ],
    },
    Biola: {
        description:
            'BIOLA ADALAH ALAT MUSIK GESEK DENGAN EMPAT SENAR YANG DIMAINKAN MENGGUNAKAN BOW. BIOLA MEMILIKI RENTANG NADA LUAS DAN BANYAK DIGUNAKAN DALAM ORKESTRA, MUSIK KLASIK, DAN MUSIK TRADISIONAL.',
        characteristics: [
            'SUARA: CERAH DAN EKSPRESIF',
            'MEMILIKI EMPAT SENAR',
            'DIMAINKAN DENGAN BOW',
            'TIDAK MEMILIKI FRET',
            'DAPAT MEMAINKAN MELODI',
        ],
        advantages: [
            'EKSPRESI SUARA SANGAT LUAS',
            'COCOK UNTUK SOLO',
            'BANYAK DIGUNAKAN DALAM ORKESTRA',
        ],
        challenges: [
            'KETEPATAN INTONASI',
            'TEKNIK BOW',
            'POSISI JARI HARUS TEPAT',
        ],
    },
    Cello: {
        description:
            'CELLO ADALAH ALAT MUSIK GESEK BERUKURAN BESAR DENGAN EMPAT SENAR. CELLO DIMAINKAN DALAM POSISI DUDUK DAN MAMPU MENGHASILKAN SUARA YANG DALAM, HANGAT, DAN EKSPRESIF.',
        characteristics: [
            'SUARA: DALAM DAN HANGAT',
            'MEMILIKI EMPAT SENAR',
            'DIMAINKAN DENGAN BOW',
            'DIMAINKAN DALAM POSISI DUDUK',
            'MEMILIKI RENTANG NADA LUAS',
        ],
        advantages: [
            'SUARA KAYA DAN EKSPRESIF',
            'COCOK UNTUK SOLO',
            'BERPERAN DALAM MELODI DAN HARMONI',
        ],
        challenges: [
            'UKURAN ALAT BESAR',
            'TEKNIK BOW CUKUP SULIT',
            'MEMBUTUHKAN KETEPATAN INTONASI',
        ],
    },
};

/** Fallback ringkas untuk instrument yang belum punya entri detail di atas. */
export function getInstrumentDetail(
    name: string,
    fallbackDescription?: string,
): InstrumentDetail | null {
    const known = INSTRUMENT_DETAILS[name];
    if (known) return known;
    if (!fallbackDescription) return null;
    return {
        description: fallbackDescription.toUpperCase(),
        characteristics: [],
        advantages: [],
        challenges: [],
    };
}

const DIFFICULTY_STARS: Record<Difficulty, number> = {
    Beginner: 2,
    Intermediate: 3,
    Advanced: 4,
};

export function starsForDifficulty(difficulty?: string | null): number {
    if (!difficulty) return 0;
    return DIFFICULTY_STARS[difficulty as Difficulty] ?? 0;
}

export function difficultyLabel(difficulty?: string | null): string {
    switch (difficulty) {
        case 'Beginner':
            return 'PEMULA';
        case 'Intermediate':
            return 'MENENGAH';
        case 'Advanced':
            return 'MAHIR';
        default:
            return '';
    }
}
