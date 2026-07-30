// ============================================================
//  ÁRKONFIGURÁCIÓ — itt add meg a szobák valódi árait
//  FONTOS: az alábbi számok PÉLDA (placeholder) értékek!
//  Cseréld ki mindegyiket a tényleges árakra, mielőtt élesítenéd.
// ============================================================

const PRICING_CONFIG = {

  // A pénznem, ami a kalkulátorban megjelenik
  currency: "Ft",

  // Legalább ennyi éjszakára lehet foglalni (pl. 2 = min. 2 éjszaka)
  minNights: 1,

  // Szobánkénti árazás — a kulcs az images.js-ben használt room.id
  rooms: {
    1: { pricePerNight: 25000, includedGuests: 2, maxGuests: 2, extraGuestFee: 0 },
    2: { pricePerNight: 32000, includedGuests: 2, maxGuests: 4, extraGuestFee: 4000 },
    3: { pricePerNight: 28000, includedGuests: 2, maxGuests: 3, extraGuestFee: 4000 },
    4: { pricePerNight: 34000, includedGuests: 2, maxGuests: 5, extraGuestFee: 4000 },
    5: { pricePerNight: 24000, includedGuests: 2, maxGuests: 2, extraGuestFee: 0 },
    6: { pricePerNight: 26000, includedGuests: 2, maxGuests: 3, extraGuestFee: 4000 },
    7: { pricePerNight: 26000, includedGuests: 2, maxGuests: 3, extraGuestFee: 4000 },
    8: { pricePerNight: 26000, includedGuests: 2, maxGuests: 3, extraGuestFee: 4000 },
    9: { pricePerNight: 30000, includedGuests: 2, maxGuests: 4, extraGuestFee: 4000 },
    // pricePerNight    — alapár / éjszaka, ennyi fővel: includedGuests
    // includedGuests   — hány fő fér bele az alapárba
    // maxGuests        — a szoba maximális befogadóképessége
    // extraGuestFee    — plusz díj minden fő felett / éjszaka
  },

  // Opcionális: szezonális felár dátumtartományokra.
  // "multiplier": 1.2 = 20% felár az adott időszakban.
  // Ha nem kell szezonalitás, hagyd üresen: []
  seasons: [
    // { start: "2026-07-01", end: "2026-08-31", label: "Főszezon", multiplier: 1.25 },
    // { start: "2026-12-20", end: "2027-01-02", label: "Ünnepek",  multiplier: 1.2  },
  ],

};
