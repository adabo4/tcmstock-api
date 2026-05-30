import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

type SeedTablet = {
  code: string;
  name: string;
  productType:
    | 'TABLET'
    | 'DRINK'
    | 'BOOK'
    | 'OIL'
    | 'SYRUP'
    | 'CELL_SALT'
    | 'CREAM'
    | 'SUPPOSITORY';
};

const tablets: SeedTablet[] = [
  // TABLETY
  { code: '001', name: 'Kúzlo prvej pomoci', productType: 'TABLET' },
  { code: '002', name: 'Chlad rannej hmly', productType: 'TABLET' },
  { code: '003', name: 'Krehkosť zvinutého lístku', productType: 'TABLET' },
  { code: '004', name: 'Priesmyk veternej hory', productType: 'TABLET' },
  { code: '007', name: 'Vyvanutie dračej jaskyne', productType: 'TABLET' },
  { code: '009', name: 'Zrodenie Fénixa', productType: 'TABLET' },
  { code: '010', name: 'Pôvab jazmínovej pleti', productType: 'TABLET' },
  { code: '011', name: 'Pätoro uhasení sopky', productType: 'TABLET' },
  { code: '012', name: 'Tieň brokátového závoja', productType: 'TABLET' },
  { code: '013', name: 'Vychladnutie horúcej platne', productType: 'TABLET' },
  { code: '014', name: 'Pilulka horca', productType: 'TABLET' },
  { code: '015', name: 'Obnova spálenej zeme', productType: 'TABLET' },
  { code: '016', name: 'Zdolanie ohnivého zrázu', productType: 'TABLET' },
  { code: '017', name: 'Trón cisárskej milosti', productType: 'TABLET' },
  { code: '018', name: 'Skrotenie teplokrvníka', productType: 'TABLET' },
  { code: '019', name: 'Zvlieknutie hadej kože', productType: 'TABLET' },
  { code: '020', name: 'Kamene z údolia Šaolin', productType: 'TABLET' },
  { code: '021', name: 'Vysušenie ryžových terás', productType: 'TABLET' },
  { code: '022', name: 'Tančenice z hruškovej záhrady', productType: 'TABLET' },
  { code: '025', name: 'Ladnosť štíhlej gazely', productType: 'TABLET' },
  {
    code: '030',
    name: 'Ukotvenie horkovzdušného balónu',
    productType: 'TABLET',
  },
  { code: '031', name: 'Vôňa borovicového hája', productType: 'TABLET' },
  { code: '032', name: 'Ozveny himalájskeho hromu', productType: 'TABLET' },
  { code: '033', name: 'Zvlaženie vyprahnutej stepi', productType: 'TABLET' },
  { code: '034', name: 'Ovocie stromu života', productType: 'TABLET' },
  { code: '036', name: 'Baldachýnova komnata', productType: 'TABLET' },
  { code: '037', name: 'Hebkosť labutej šije', productType: 'TABLET' },
  { code: '038', name: 'Klenba malebného chrámu', productType: 'TABLET' },
  { code: '039', name: 'Druhý dych sokola', productType: 'TABLET' },
  {
    code: '040',
    name: 'Vytiahnutie zakliesnených stavidiel',
    productType: 'TABLET',
  },
  {
    code: '041',
    name: 'Vytiahnutie zakliesnených stavidiel',
    productType: 'TABLET',
  },
  { code: '042', name: 'Ušľachtilosť lotosového kvetu', productType: 'TABLET' },
  { code: '043', name: 'Prechádzka ružovým sadom', productType: 'TABLET' },
  { code: '050', name: 'Prebudenie šípkovej princezny', productType: 'TABLET' },
  { code: '051', name: 'Uvoľnenie karmínovej rieky', productType: 'TABLET' },
  { code: '052', name: 'Jemnosť nebeskej víly', productType: 'TABLET' },
  { code: '053', name: 'Záveje plné nádeje', productType: 'TABLET' },
  { code: '054', name: 'Stena deviatich drakov', productType: 'TABLET' },
  { code: '055', name: 'Zvelebenie rumelkového poľa', productType: 'TABLET' },
  { code: '056', name: 'Rast hory Tchaj', productType: 'TABLET' },
  { code: '057', name: 'Údolie oblakov a dažďov', productType: 'TABLET' },
  { code: '060', name: 'Kropaj z lesnej studničky', productType: 'TABLET' },
  { code: '061', name: 'Voľnosť slobodného pútnika', productType: 'TABLET' },
  { code: '062', name: 'Skľudnenie rozbúrenej hladiny', productType: 'TABLET' },
  { code: '063', name: 'Súznenie kúzelnej premeny', productType: 'TABLET' },
  { code: '064', name: 'Stíšenie veternej búrky', productType: 'TABLET' },
  { code: '065', name: 'Zružovenie sedmikrásky', productType: 'TABLET' },
  { code: '066', name: 'Vidina pokojného odpočinku', productType: 'TABLET' },
  { code: '068', name: 'Rozpletenie zamotaného klbka', productType: 'TABLET' },
  { code: '070', name: 'Východ zo slepej uličky', productType: 'TABLET' },
  { code: '073', name: 'Upratovanie obilnej sýpky', productType: 'TABLET' },
  { code: '079', name: 'Posilnenie ríše stredu', productType: 'TABLET' },
  { code: '081', name: 'Spadnutie kameňa zo srdca', productType: 'TABLET' },
  {
    code: '091',
    name: 'Naplnenie vyschnutého riečištia',
    productType: 'TABLET',
  },
  { code: '101', name: 'Šabľa malého samuraja', productType: 'TABLET' },
  { code: '102', name: 'Prečistenie kalnej studničky', productType: 'TABLET' },
  { code: '105', name: 'Hostina piatich chutí', productType: 'TABLET' },
  { code: '108', name: 'Vodopád z modrej lagúny', productType: 'TABLET' },
  { code: '111', name: 'Zastavenie toku žltej rieky', productType: 'TABLET' },
  { code: '112', name: 'Uvoľnenie napätej tetivy', productType: 'TABLET' },
  { code: '113', name: 'Vánok hodvábneho vejára', productType: 'TABLET' },
  { code: '114', name: 'Zátišie pustovníka Changa', productType: 'TABLET' },
  { code: '115', name: 'Pohladenie medvedíka pandy', productType: 'TABLET' },
  { code: '119', name: 'Hriva čierneho vraníka', productType: 'TABLET' },
  { code: '121', name: 'Elixír nebeského cisára', productType: 'TABLET' },
  { code: '127', name: 'Radosť prichádzajúceho spánku', productType: 'TABLET' },
  { code: '131', name: 'Hvizd striebornej píšťalky', productType: 'TABLET' },
  { code: '152', name: 'Tigrí prameň', productType: 'TABLET' },
  { code: '153', name: 'Ebenový vetrolam', productType: 'TABLET' },
  { code: '171', name: 'Tajomstvo zlatej skrinky', productType: 'TABLET' },
  { code: '172', name: 'Slasť uprostred noci', productType: 'TABLET' },
  { code: '183', name: 'Návrat rysa ostrovida', productType: 'TABLET' },
  { code: '184', name: 'Tíšenie mingských zvonov', productType: 'TABLET' },
  { code: '185', name: 'Sviežosť podvečernej pagody', productType: 'TABLET' },
  { code: '186', name: 'Rýchlosť lúčneho škorpióna', productType: 'TABLET' },
  { code: '190', name: 'Sladké plody z Yunnanu', productType: 'TABLET' },
  { code: '191', name: 'Náramok ôsmych perál', productType: 'TABLET' },
  { code: '192', name: 'Harmónia broskyňového hája', productType: 'TABLET' },
  { code: '198', name: 'Tibetský klenot Cordyceps', productType: 'TABLET' },
  { code: '199', name: 'Kráľovská huba Yunzhi', productType: 'TABLET' },
  { code: '200', name: 'Lingzhi koreň života', productType: 'TABLET' },
  { code: '201', name: 'Pevnosť palácového piliera', productType: 'TABLET' },
  { code: '202', name: 'Ochladenie horúcej lávy', productType: 'TABLET' },
  { code: '203', name: 'Mávnutie motýlích krídel', productType: 'TABLET' },
  { code: '204', name: 'Sila ozajstného bojovníka', productType: 'TABLET' },
  {
    code: '205',
    name: 'Húževnatosť bambusového výhonku',
    productType: 'TABLET',
  },
  { code: '206', name: 'Vyhladenie slonovej kosti', productType: 'TABLET' },

  // NÁPOJE
  { code: '811', name: 'Nápoj siedmich statočných', productType: 'DRINK' },
  { code: '822', name: 'Nápoj z pravého ženšenu', productType: 'DRINK' },
  { code: '844', name: 'Nápoj strieborného vetra', productType: 'DRINK' },
  { code: '850', name: 'Nápoj piatich hviezd', productType: 'DRINK' },
  { code: '888', name: 'Nápoj nebeskej víly', productType: 'DRINK' },
  { code: '900', name: 'Nápoj čínskych MUDr.', productType: 'DRINK' },
  { code: '901', name: 'Nápoj čínskych MUDr. 200g', productType: 'DRINK' },

  // SIRUPY
  { code: '311', name: 'Mišpuľníkový sirup', productType: 'SYRUP' },

  // KRÉMY A MASTI
  { code: '367', name: 'Čípky dymiacej rokliny', productType: 'SUPPOSITORY' },
  { code: '368', name: 'Balzam dymiacej rokliny', productType: 'CREAM' },
  { code: '380', name: 'Masť MYAO YAO', productType: 'CREAM' },

  // OLEJE
  {
    code: '626',
    name: 'Biodynamický olej z hroznových jadier',
    productType: 'OIL',
  },
  { code: '700', name: 'Šaolínový olej 25ml', productType: 'OIL' },
  { code: '701', name: 'Šaolínový olej 50ml', productType: 'OIL' },

  // BUNKOVÉ SOLI
  { code: '2003', name: 'Oranžová / Kali Mur', productType: 'CELL_SALT' },
  { code: '2005', name: 'Žltá / Mag Phos', productType: 'CELL_SALT' },
  { code: '2006', name: 'Olivová / Kali Sulph', productType: 'CELL_SALT' },
  { code: '2007', name: 'Zelená / Nat Phos', productType: 'CELL_SALT' },
  { code: '2009', name: 'Modrá / Silicea', productType: 'CELL_SALT' },
  { code: '2011', name: 'Fialová / Nat Mur', productType: 'CELL_SALT' },

  // KNIHY
  {
    code: '333',
    name: 'Kniha Na frekvencii čínskej medicíny',
    productType: 'BOOK',
  },
  { code: '775', name: 'Kniha Bunkové soli', productType: 'BOOK' },
  {
    code: '777',
    name: 'Kniha Od prameňa čínskej medicíny',
    productType: 'BOOK',
  },
];

async function main() {
  for (const tablet of tablets) {
    await prisma.tabletCatalog.upsert({
      where: { code: tablet.code },
      update: {
        name: tablet.name,
        productType: tablet.productType,
      },
      create: {
        code: tablet.code,
        name: tablet.name,
        productType: tablet.productType,
      },
    });
  }

  console.log(`Seeded ${tablets.length} tablets`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
