// ============================================================
//  KÉPKONFIGURÁCIÓ — itt kezeld az összes szoba képét
// ============================================================

const SITE_CONFIG = {

  // A főoldal hero slideshow képei
  hero: [
    "pictures/37945463.jpg",
    "pictures/40306904.jpg",
    "pictures/IMG_20260411_091114.jpg",
    "pictures/IMG_20260411_091130.jpg",
    "pictures/38654883.jpg",
    "pictures/40593815.jpg",
    "pictures/IMG_20260528_104516.jpg",
    "pictures/IMG_20260528_104525.jpg",
    "pictures/IMG_20260528_104546.jpg"
  ],

  // Szobák tömbje — sorrendben jelennek meg a "Szobáink" szekcióban
  rooms: [
    {
      id: 1,
      name: "1-es szoba",
      desc: "",          // opcionális leírás
      features: ["Franciaágy", "WiFi"],
      badge: null,       // pl. "Legnépszerűbb" — null = nincs jelvény
      autoDelay: 5000,   // ms, 0 = nincs automatikus lapozás
      images: [
        "pictures/1/1.jpg",
        "pictures/1/2.jpg",
        "pictures/1/3.jpg",
        "pictures/1/4.jpg",
        "pictures/1/5.jpg",
        "pictures/1/6.jpg",
        "pictures/1/7.jpg",
      ],
    },
    {
      id: 2,
      name: "2-es szoba",
      desc: "",
      features: ["Ikerágyak", "Tetőtér", "WiFi", "TV"],
      badge: null,
      autoDelay: 5500,
      images: [
        "pictures/2/1.jpg",
        "pictures/2/2.jpg",
        "pictures/2/3.jpg",
        "pictures/2/4.jpg",
        "pictures/2/5.jpg",
      ],
    },
    {
      id: 3,
      name: "3-as szoba",
      desc: "",
      features: ["Franciaágy", "Saját fürdő", "WiFi"],
      badge: null,
      autoDelay: 6000,
      images: [
        "pictures/3/1.jpg",
        "pictures/3/2.jpg",
        "pictures/3/3.jpg",
        "pictures/3/4.jpg",
        "pictures/3/5.jpg",
      ],
    },
    {
      id: 4,
      name: "4-es szoba",
      desc: "",
      features: ["Franciaágy", "Saját fürdő", "WiFi"],
      badge: null,
      autoDelay: 6500,
      images: [
        "pictures/4/1.jpg",
        "pictures/4/2.jpg",
        "pictures/4/3.jpg",
        "pictures/4/4.jpg",
        "pictures/4/5.jpg",
        "pictures/4/6.jpg",
        "pictures/4/7.jpg",
        "pictures/4/8.jpg",
        "pictures/4/9.jpg",
      ],
    },
    {
      id: 5,
      name: "5-ös szoba",
      desc: "",
      features: ["Franciaágy", "WiFi"],
      badge: null,
      autoDelay: 5000,
      images: [
        "pictures/5/1.jpg",
        "pictures/5/2.jpg",
        "pictures/5/3.jpg",
        "pictures/5/4.jpg"
      ],
    },
    {
      id: 6,
      name: "6-os szoba",
      desc: "",
      features: ["Franciaágy", "WiFi"],
      badge: null,
      autoDelay: 5000,
      images: [
        "pictures/6/1.jpg",
        "pictures/6/2.jpg",
        "pictures/6/3.jpg",
        "pictures/6/4.jpg",
        "pictures/6/5.jpg",
        "pictures/6/6.jpg",
      ],
    },
    {
      id: 7,
      name: "7-es szoba",
      desc: "",
      features: ["Franciaágy", "WiFi"],
      badge: null,
      autoDelay: 5000,
      images: [
        "pictures/7/1.jpg",
        "pictures/7/2.jpg",
        "pictures/7/3.jpg",
        "pictures/7/4.jpg",
        "pictures/7/5.jpg",
        "pictures/7/6.jpg"
      ],
    },
    {
      id: 8,
      name: "8-as szoba",
      desc: "",
      features: ["Franciaágy", "WiFi"],
      badge: null,
      autoDelay: 5000,
      images: [
        "pictures/8/1.jpg",
        "pictures/8/2.jpg",
        "pictures/8/3.jpg",
        "pictures/8/4.jpg",
        "pictures/8/5.jpg",
        "pictures/8/6.jpg"
      ],
    },
    {
      id: 9,
      name: "9-es szoba",
      desc: "",
      features: ["Franciaágy", "Saját fürdő", "WiFi"],
      badge: null,
      autoDelay: 7000,
      images: [
        "pictures/9/1.jpg",
        "pictures/9/2.jpg",
        "pictures/9/3.jpg",
        "pictures/9/4.jpg",
        "pictures/9/5.jpg",
      ],
    },
  ],
};
