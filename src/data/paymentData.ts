export interface ProviderOption {
  id: string;
  name: string;
  category?: string;
  logoText?: string;
  badgeBg?: string;
}

export interface PackageItem {
  id: string;
  name: string;
  amount: number;
  itemDescription?: string;
  badge?: string;
}

// 1. TV Kabel Providers
export const TV_PROVIDERS: ProviderOption[] = [
  { id: 'mnc', name: 'MNC Vision', badgeBg: 'bg-blue-600' },
  { id: 'transvision', name: 'Transvision', badgeBg: 'bg-red-600' },
  { id: 'firstmedia', name: 'First Media', badgeBg: 'bg-emerald-600' },
  { id: 'kvision', name: 'K-Vision', badgeBg: 'bg-indigo-600' },
  { id: 'indihometv', name: 'IndiHome TV', badgeBg: 'bg-rose-600' },
  { id: 'nexparabola', name: 'Nex Parabola', badgeBg: 'bg-amber-600' },
];

// 2. Layanan Musik Platforms & Packages
export const MUSIC_PROVIDERS: ProviderOption[] = [
  { id: 'spotify', name: 'Spotify Premium' },
  { id: 'youtube', name: 'YouTube Music' },
  { id: 'apple', name: 'Apple Music' },
  { id: 'joox', name: 'JOOX VIP' },
];

export const MUSIC_PACKAGES: Record<string, PackageItem[]> = {
  spotify: [
    { id: 'sp-mini', name: 'Spotify Mini 1 Hari', amount: 2500, itemDescription: 'Bebas iklan untuk 1 hari' },
    { id: 'sp-ind', name: 'Spotify Individual 1 Bulan', amount: 54990, itemDescription: 'Bebas iklan, download lagu, 1 akun', badge: 'Populer' },
    { id: 'sp-duo', name: 'Spotify Duo 1 Bulan', amount: 71490, itemDescription: '2 Akun Premium untuk pasangan' },
    { id: 'sp-fam', name: 'Spotify Family 1 Bulan', amount: 86900, itemDescription: 'Hingga 6 akun untuk 1 keluarga', badge: 'Hemat' },
    { id: 'sp-3bln', name: 'Spotify Individual 3 Bulan', amount: 165000, itemDescription: '3 Bulan akses premium hemat' },
  ],
  youtube: [
    { id: 'yt-ind', name: 'YouTube Music 1 Bulan', amount: 49000, itemDescription: 'Putar di latar belakang tanpa iklan', badge: 'Populer' },
    { id: 'yt-fam', name: 'YouTube Music Family 1 Bulan', amount: 75000, itemDescription: 'Hingga 5 anggota keluarga' },
    { id: 'yt-prem', name: 'YouTube Premium All-in-One 1 Bulan', amount: 59000, itemDescription: 'Termasuk YouTube Video & Music Bebas Iklan', badge: 'Terlaris' },
  ],
  apple: [
    { id: 'ap-ind', name: 'Apple Music Individual 1 Bulan', amount: 49000, itemDescription: 'Akses 100 juta lagu & Spatial Audio', badge: 'Populer' },
    { id: 'ap-fam', name: 'Apple Music Family 1 Bulan', amount: 75000, itemDescription: 'Hingga 6 orang via Family Sharing' },
    { id: 'ap-3bln', name: 'Apple Music 3 Bulan', amount: 147000, itemDescription: 'Paket langganan hemat 3 bulan' },
  ],
  joox: [
    { id: 'jx-1bln', name: 'JOOX VIP 1 Bulan', amount: 49000, itemDescription: 'Akses VIP tanpa batas & kualitas Hi-Fi', badge: 'Populer' },
    { id: 'jx-3bln', name: 'JOOX VIP 3 Bulan', amount: 139000, itemDescription: 'Langganan VIP hemat 90 hari' },
  ],
};

// 3. Voucher Game Titles & Item Packages
export interface GameOption {
  id: string;
  name: string;
  shortName: string;
  hasZoneId: boolean;
  idLabel: string;
  idPlaceholder: string;
  zonePlaceholder?: string;
  mockNicknames: string[];
}

export const GAME_LIST: GameOption[] = [
  {
    id: 'mlbb',
    name: 'Mobile Legends: Bang Bang',
    shortName: 'MLBB',
    hasZoneId: true,
    idLabel: 'User ID Game & Server/Zone ID',
    idPlaceholder: 'User ID (contoh: 19827364)',
    zonePlaceholder: 'Zone (2034)',
    mockNicknames: ['Alucard_Pro', 'MythicGlory_99', 'SavageHunter_ID', 'GusionFastHand'],
  },
  {
    id: 'freefire',
    name: 'Free Fire',
    shortName: 'FF',
    hasZoneId: false,
    idLabel: 'Player ID Free Fire',
    idPlaceholder: 'Contoh: 8492019482',
    mockNicknames: ['Sultan_Booyah', 'HeadshotMaster', 'Ruok_ID', 'EagleOne_FF'],
  },
  {
    id: 'pubgm',
    name: 'PUBG Mobile',
    shortName: 'PUBG-M',
    hasZoneId: false,
    idLabel: 'Player ID (UID) PUBG Mobile',
    idPlaceholder: 'Contoh: 5128493019',
    mockNicknames: ['SniperGod_ID', 'PredatorChicken', 'Vanguard_Ace'],
  },
  {
    id: 'valorant',
    name: 'Valorant Points',
    shortName: 'Valorant',
    hasZoneId: false,
    idLabel: 'Riot ID & Tagline',
    idPlaceholder: 'Contoh: VandalMaster#ID1',
    mockNicknames: ['Radiant_Duelist', 'AceOperator#ID1', 'ClutchGod#SEA'],
  },
  {
    id: 'genshin',
    name: 'Genshin Impact',
    shortName: 'Genshin',
    hasZoneId: true,
    idLabel: 'UID & Server Genshin Impact',
    idPlaceholder: 'UID (contoh: 810928374)',
    zonePlaceholder: 'Server (Asia)',
    mockNicknames: ['Traveler_Lumine', 'ArlecchinoMain', 'ArchonOfTeyvat'],
  },
  {
    id: 'roblox',
    name: 'Roblox (Robux)',
    shortName: 'Roblox',
    hasZoneId: false,
    idLabel: 'Username Roblox',
    idPlaceholder: 'Contoh: RobuxProGamer',
    mockNicknames: ['RobloxLegend_ID', 'BloxBuilder99', 'ProBlox_VIP'],
  },
];

export const GAME_PACKAGES: Record<string, PackageItem[]> = {
  mlbb: [
    { id: 'ml-53', name: '53 Diamonds', amount: 15000 },
    { id: 'ml-86', name: '86 Diamonds', amount: 25000 },
    { id: 'ml-172', name: '172 Diamonds', amount: 50000, badge: 'Populer' },
    { id: 'ml-257', name: '257 Diamonds', amount: 75000 },
    { id: 'ml-344', name: '344 Diamonds', amount: 100000 },
    { id: 'ml-706', name: '706 Diamonds', amount: 200000, badge: 'Terlaris' },
    { id: 'ml-wdp', name: 'Weekly Diamond Pass', amount: 28500, badge: 'Best Value' },
  ],
  freefire: [
    { id: 'ff-70', name: '70 Diamonds', amount: 10000 },
    { id: 'ff-140', name: '140 Diamonds', amount: 20000 },
    { id: 'ff-355', name: '355 Diamonds', amount: 50000, badge: 'Populer' },
    { id: 'ff-720', name: '720 Diamonds', amount: 100000, badge: 'Terlaris' },
    { id: 'ff-1450', name: '1.450 Diamonds', amount: 200000 },
    { id: 'ff-member', name: 'Membership Mingguan', amount: 30000, badge: 'Hemat' },
  ],
  pubgm: [
    { id: 'pb-60', name: '60 UC', amount: 15000 },
    { id: 'pb-325', name: '325 UC', amount: 75000, badge: 'Populer' },
    { id: 'pb-660', name: '660 UC (Royale Pass)', amount: 150000, badge: 'Terlaris' },
    { id: 'pb-1800', name: '1.800 UC', amount: 375000 },
  ],
  valorant: [
    { id: 'val-300', name: '300 VP', amount: 35000 },
    { id: 'val-625', name: '625 VP', amount: 70000, badge: 'Populer' },
    { id: 'val-1125', name: '1.125 VP', amount: 125000 },
    { id: 'val-1650', name: '1.650 VP (Battlepass)', amount: 175000, badge: 'Terlaris' },
    { id: 'val-3400', name: '3.400 VP', amount: 350000 },
  ],
  genshin: [
    { id: 'gen-welkin', name: 'Blessing of Welkin Moon', amount: 79000, badge: 'Best Value' },
    { id: 'gen-300', name: '300+30 Genesis Crystals', amount: 75000 },
    { id: 'gen-980', name: '980+110 Genesis Crystals', amount: 245000, badge: 'Populer' },
    { id: 'gen-1980', name: '1.980+260 Genesis Crystals', amount: 479000 },
  ],
  roblox: [
    { id: 'rbx-80', name: '80 Robux', amount: 16000 },
    { id: 'rbx-400', name: '400 Robux', amount: 75000, badge: 'Populer' },
    { id: 'rbx-800', name: '800 Robux', amount: 150000, badge: 'Terlaris' },
    { id: 'rbx-1700', name: '1.700 Robux', amount: 300000 },
  ],
};

// 4. Voucher Makanan Merchants & Packages
export const FOOD_MERCHANTS: ProviderOption[] = [
  { id: 'kfc', name: 'KFC', badgeBg: 'bg-red-600' },
  { id: 'kopken', name: 'Kopi Kenangan', badgeBg: 'bg-amber-800' },
  { id: 'grabfood', name: 'GrabFood Dine Out', badgeBg: 'bg-emerald-600' },
  { id: 'boga', name: 'Boga Group (Pepper Lunch, Kimukatsu)', badgeBg: 'bg-orange-600' },
  { id: 'mcd', name: "McDonald's", badgeBg: 'bg-yellow-500' },
  { id: 'chatime', name: 'Chatime', badgeBg: 'bg-purple-600' },
];

export const FOOD_PACKAGES: Record<string, PackageItem[]> = {
  kfc: [
    { id: 'kfc-25', name: 'Voucher KFC Rp 25.000', amount: 25000 },
    { id: 'kfc-50', name: 'Voucher KFC Rp 50.000', amount: 50000, badge: 'Populer' },
    { id: 'kfc-100', name: 'Voucher KFC Rp 100.000', amount: 100000, badge: 'Terlaris' },
    { id: 'kfc-200', name: 'Voucher KFC Rp 200.000', amount: 200000 },
  ],
  kopken: [
    { id: 'kk-20', name: 'Voucher Kopi Kenangan Rp 20.000', amount: 20000 },
    { id: 'kk-50', name: 'Voucher Kopi Kenangan Rp 50.000', amount: 50000, badge: 'Populer' },
    { id: 'kk-100', name: 'Voucher Kopi Kenangan Rp 100.000', amount: 100000 },
  ],
  grabfood: [
    { id: 'gf-25', name: 'Voucher GrabFood Rp 25.000', amount: 25000 },
    { id: 'gf-50', name: 'Voucher GrabFood Rp 50.000', amount: 50000, badge: 'Populer' },
    { id: 'gf-100', name: 'Voucher GrabFood Rp 100.000', amount: 100000, badge: 'Terlaris' },
  ],
  boga: [
    { id: 'bg-50', name: 'Voucher Boga Group Rp 50.000', amount: 50000 },
    { id: 'bg-100', name: 'Voucher Boga Group Rp 100.000', amount: 100000, badge: 'Populer' },
    { id: 'bg-200', name: 'Voucher Boga Group Rp 200.000', amount: 200000, badge: 'Hemat' },
  ],
  mcd: [
    { id: 'mcd-25', name: 'Voucher McD Rp 25.000', amount: 25000 },
    { id: 'mcd-50', name: 'Voucher McD Rp 50.000', amount: 50000, badge: 'Populer' },
    { id: 'mcd-100', name: 'Voucher McD Rp 100.000', amount: 100000, badge: 'Terlaris' },
  ],
  chatime: [
    { id: 'ct-20', name: 'Voucher Chatime Rp 20.000', amount: 20000 },
    { id: 'ct-50', name: 'Voucher Chatime Rp 50.000', amount: 50000, badge: 'Populer' },
    { id: 'ct-100', name: 'Voucher Chatime Rp 100.000', amount: 100000 },
  ],
};

// 5. Kurban Packages & Lembaga Penyalur
export const KURBAN_INSTITUTIONS: ProviderOption[] = [
  { id: 'baznas', name: 'BAZNAS (Badan Amil Zakat Nasional)' },
  { id: 'rumahzakat', name: 'Rumah Zakat' },
  { id: 'dompetdhuafa', name: 'Dompet Dhuafa' },
  { id: 'humaninitiative', name: 'Human Initiative' },
];

export const KURBAN_PACKAGES: PackageItem[] = [
  {
    id: 'k-kambing-std',
    name: 'Kambing Standar (20-22 kg)',
    amount: 1950000,
    itemDescription: 'Bobot 20-22 kg, disalurkan ke desa pelosok & 3T',
    badge: 'Populer',
  },
  {
    id: 'k-kambing-med',
    name: 'Kambing Medium (23-25 kg)',
    amount: 2250000,
    itemDescription: 'Bobot 23-25 kg, kualitas ternak prima & sehat',
  },
  {
    id: 'k-kambing-prem',
    name: 'Kambing Premium (26-29 kg)',
    amount: 2650000,
    itemDescription: 'Bobot 26-29 kg, daging melimpah bersertifikat',
    badge: 'Pilihan Terbaik',
  },
  {
    id: 'k-sapi-patungan',
    name: 'Patungan 1/7 Sapi (220-250 kg)',
    amount: 2800000,
    itemDescription: '1 bagian dari 7 pekurban sapi bobot 220-250 kg',
    badge: 'Terlaris',
  },
  {
    id: 'k-sapi-utuh',
    name: '1 Ekor Sapi Utuh (220-250 kg)',
    amount: 19500000,
    itemDescription: '1 Ekor Sapi utuh atas nama keluarga / 7 nama',
  },
];

// 6. Zakat Types & Mitra LAZ Resmi
export const ZAKAT_TYPES: ProviderOption[] = [
  { id: 'penghasilan', name: 'Zakat Penghasilan / Profesi (2,5%)' },
  { id: 'maal', name: 'Zakat Maal (Harta Kekayaan Simpanan)' },
  { id: 'fitrah', name: 'Zakat Fitrah (Rp 45.000 / Jiwa)' },
  { id: 'emas', name: 'Zakat Tabungan & Emas/Perak' },
];

export const ZAKAT_INSTITUTIONS: ProviderOption[] = [
  { id: 'baznas', name: 'BAZNAS (Badan Amil Zakat Nasional)' },
  { id: 'rumahzakat', name: 'Rumah Zakat' },
  { id: 'dompetdhuafa', name: 'Dompet Dhuafa' },
  { id: 'lazismu', name: 'LAZISMU (Muhammadiyah)' },
  { id: 'nucare', name: 'NU Care-LAZISNU' },
];

export const ZAKAT_PRESETS = [50000, 100000, 250000, 500000, 1000000, 2000000];
