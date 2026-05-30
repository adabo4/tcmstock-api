import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is missing');
}

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });

const tablets = [
  { code: '001', name: 'Kúzlo prvej pomoci' },
  { code: '002', name: 'Chlad rannej hmly' },
  { code: '003', name: 'Krehkosť zvinutého lístku' },
  { code: '004', name: 'Priesmyk veternej hory' },
  { code: '007', name: 'Vyvanutie dračej jaskyne' },
  { code: '009', name: 'Zrodenie Fénixa' },
  { code: '010', name: 'Pôvab jazmínovej pleti' },
  { code: '011', name: 'Pätoro uhasení sopky' },
  { code: '012', name: 'Tieň brokátového závoja' },
  { code: '013', name: 'Vychladnutie horúcej platne' },
  { code: '014', name: 'Pilulka horca' },
  { code: '015', name: 'Obnova spálenej zeme' },
  { code: '016', name: 'Zdolanie ohnivého zrázu' },
  { code: '017', name: 'Trón cisárskej milosti' },
  { code: '018', name: 'Skrotenie teplokrvníka' },
  { code: '019', name: 'Zvlieknutie hadej kože' },
  { code: '020', name: 'Kamene z údolia Šaolin' },
  { code: '021', name: 'Vysušenie ryžových terás' },
  { code: '022', name: 'Tančenice z hruškovej záhrady' },
  { code: '025', name: 'Ladnosť štíhlej gazely' },
  { code: '030', name: 'Ukotvenie horkovzdušného balónu' },
  { code: '031', name: 'Vôňa borovicového hája' },
  { code: '032', name: 'Ozveny himalájskeho hromu' },
  { code: '033', name: 'Zvlaženie vyprahnutej stepi' },
  { code: '034', name: 'Ovocie stromu života' },
  { code: '036', name: 'Baldachýnova komnata' },
  { code: '037', name: 'Hebkosť labutej šije' },
  { code: '038', name: 'Klenba malebného chrámu' },
  { code: '039', name: 'Druhý dych sokola' },
  { code: '040', name: 'Vytiahnutie zakliesnených stavidiel' },
  { code: '041', name: 'Vytiahnutie zakliesnených stavidiel' },
  { code: '042', name: 'Ušľachtilosť lotosového kvetu' },
  { code: '043', name: 'Prechádzka ružovým sadom' },
  { code: '050', name: 'Prebudenie šípkovej princezny' },
  { code: '051', name: 'Uvoľnenie karmínovej rieky' },
  { code: '052', name: 'Jemnosť nebeskej víly' },
  { code: '053', name: 'Záveje plné nádeje' },
  { code: '054', name: 'Stena deviatich drakov' },
  { code: '055', name: 'Zvelebenie rumelkového poľa' },
  { code: '056', name: 'Rast hory Tchaj' },
  { code: '057', name: 'Údolie oblakov a ďažďov' },
  { code: '060', name: 'Kropaj z lesnej studničky' },
  { code: '061', name: 'Voľnosť slobodného pútnika' },
  { code: '062', name: 'Skľudnenie rozbúrenej hladiny' },
  { code: '063', name: 'Súznenie kúzelnej premeny' },
  { code: '064', name: 'Stíšenie veternej búrky' },
  { code: '065', name: 'Zružovenie sedmikrásky' },
  { code: '066', name: 'Vidina pokojného odpočinku' },
  { code: '068', name: 'Rozpletenie zamotaného klbka' },
  { code: '070', name: 'Východ zo slepej uličky' },
  { code: '073', name: 'Upratovanie obilnej sýpky' },
  { code: '079', name: 'Posilnenie ríše stredu' },
  { code: '081', name: 'Spadnutie kameňa zo srdca' },
  { code: '091', name: 'Naplnenie vyschnutého riečištia' },
  { code: '101', name: 'Šabľa malého samuraja' },
  { code: '102', name: 'Prečistenie kalnej studničky' },
  { code: '105', name: 'Hostina pěti chutí' },
  { code: '108', name: 'Vodopád z modré laguny' },
  { code: '111', name: 'Zastavenie toku žltej rieky' },
  { code: '112', name: 'Uvoľnenie napätej tetivy' },
  { code: '113', name: 'Vánok hodvábneho vejára' },
  { code: '114', name: 'Zátišie pustovníka Changa' },
  { code: '115', name: 'Pohlazení medvídka pandy' },
  { code: '119', name: 'Hriva čierneho vraníka' },
  { code: '121', name: 'Elixír nebeského císaře' },
  { code: '127', name: 'Radosť prichádzajúceho spánku' },
  { code: '131', name: 'Hvizd striebornej píšťalky' },
  { code: '152', name: 'Tygrí prameň' },
  { code: '153', name: 'Ebenový vetrolam' },
  { code: '171', name: 'Tajomstvo zlatej skrinky' },
  { code: '172', name: 'Slasť uprostred noci' },
  { code: '183', name: 'Návrat rysa ostrovida' },
  { code: '184', name: 'Tíšenie mingských zvonov' },
  { code: '185', name: 'Sviežosť podvečernej pagody' },
  { code: '186', name: 'Rýchlosť lúčneho škorpióna' },
  { code: '190', name: 'Sladké plody z Yunnanu' },
  { code: '191', name: 'Náramok ôsmych perál' },
  { code: '192', name: 'Harmónia broskyňového hája' },
  { code: '198', name: 'Tibetský klenot Cordyceps' },
  { code: '199', name: 'Královská houba Yunzhi' },
  { code: '200', name: 'Lingzhi koreň života' },
  { code: '201', name: 'Pevnost palácového piliera' },
  { code: '202', name: 'Ochladenie horúcej lávy' },
  { code: '203', name: 'Mávnutie motýlích krídel' },
  { code: '204', name: 'Sila ozajstného bojovníka' },
  { code: '205', name: 'Húževnatosť bambusového výhonku' },
  { code: '206', name: 'Vyhladenie slonovej kosti' },
];

async function main() {
  for (const tablet of tablets) {
    await prisma.tabletCatalog.upsert({
      where: { code: tablet.code },
      update: { name: tablet.name },
      create: tablet,
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
