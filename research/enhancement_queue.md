# Enhancement Queue — Apply After Initial Build

## Priority 1: Data Corrections
Apply data_corrections.md findings to seed files

## Priority 2: Missing Persons to Add
From data_corrections.md:
- Tom Lembong (tersangka impor gula Nov 2024)
- Hasto Kristiyanto (PDIP Sekjen, tersangka KPK Jan 2025)
- Kaesang Pangarep (PSI Ketum, Jokowi's son)
- Hashim Djojohadikusumo (Prabowo's brother, Arsari Group)
- Anwar Usman (eks-Ketua MK, Jokowi's brother-in-law)
- Ganjar Pranowo (PDIP Capres 2024)
- Mahfud MD (Cawapres 2024, born Sampang Jatim)
- Hary Tanoesoedibjo (MNC Group, Perindo, born Surabaya)

## Priority 3: Connections to Add
- Prabowo ↔ Hashim: keluarga (kakak-adik)
- Jokowi ↔ Kaesang: keluarga (bapak-anak)
- Jokowi ↔ Anwar Usman: keluarga (ipar)
- Anies ↔ Tom Lembong: rekan politik (NasDem/Perubahan camp)
- Hasto ↔ Harun Masiku: obstruction case connection
- Megawati ↔ Hasto: patron-loyalist
- Prabowo ↔ Hary Tanoe: media/koalisi support

## Priority 4: Controversies Section
Add `controversies` array to key persons:
```js
controversies: [
  { title: "Penculikan Aktivis 1998", 
    severity: "kritis",
    description: "Kopassus Tim Mawar menculik 23 aktivis pro-demokrasi...",
    status: "tidak pernah diadili",
    source: "Human Rights Watch, Kontras" },
]
```

## Priority 5: Pileg Historical Data
Add complete pileg results 2004, 2009, 2014, 2019, 2024 per party

## Priority 6: DPRD Jatim
120 members of DPRD Jatim — leadership at minimum

## Priority 7: Media Ownership Data
Create media.js with ownership connections
