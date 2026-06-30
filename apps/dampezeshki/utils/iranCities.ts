/**
 * Iran Provinces and Cities Data
 * Source: Based on Persian Tools data
 * https://github.com/persian-tools/persian-tools
 */

export interface City {
  id: number
  name: string
  slug: string
}

export interface Province {
  id: number
  name: string
  slug: string
  cities: City[]
}

export const iranProvinces: Province[] = [
  {
    id: 1,
    name: 'آذربایجان شرقی',
    slug: 'azarbayjan-sharghi',
    cities: [
      { id: 1, name: 'تبریز', slug: 'tabriz' },
      { id: 2, name: 'مراغه', slug: 'maragheh' },
      { id: 3, name: 'مرند', slug: 'marand' },
      { id: 4, name: 'اهر', slug: 'ahar' },
      { id: 5, name: 'سراب', slug: 'sarab' },
      { id: 6, name: 'شبستر', slug: 'shabestar' },
      { id: 7, name: 'بناب', slug: 'bonab' },
      { id: 8, name: 'میانه', slug: 'miyaneh' },
      { id: 9, name: 'هشترود', slug: 'hashtrud' },
      { id: 10, name: 'اسکو', slug: 'osku' },
      { id: 11, name: 'جلفا', slug: 'jolfa' },
      { id: 12, name: 'هریس', slug: 'heris' },
      { id: 13, name: 'کلیبر', slug: 'kalibar' },
    ]
  },
  {
    id: 2,
    name: 'آذربایجان غربی',
    slug: 'azarbayjan-gharbi',
    cities: [
      { id: 1, name: 'ارومیه', slug: 'urmia' },
      { id: 2, name: 'خوی', slug: 'khoy' },
      { id: 3, name: 'مهاباد', slug: 'mahabad' },
      { id: 4, name: 'بوکان', slug: 'bukan' },
      { id: 5, name: 'میاندوآب', slug: 'miandoab' },
      { id: 6, name: 'سلماس', slug: 'salmas' },
      { id: 7, name: 'نقده', slug: 'naqadeh' },
      { id: 8, name: 'سردشت', slug: 'sardasht' },
      { id: 9, name: 'پیرانشهر', slug: 'piranshahr' },
      { id: 10, name: 'تکاب', slug: 'tekab' },
      { id: 11, name: 'اشنویه', slug: 'oshnavieh' },
    ]
  },
  {
    id: 3,
    name: 'اردبیل',
    slug: 'ardabil',
    cities: [
      { id: 1, name: 'اردبیل', slug: 'ardabil' },
      { id: 2, name: 'مشکین شهر', slug: 'meshkin-shahr' },
      { id: 3, name: 'پارس آباد', slug: 'parsabad' },
      { id: 4, name: 'خلخال', slug: 'khalkhal' },
      { id: 5, name: 'سرعین', slug: 'sarein' },
      { id: 6, name: 'گرمی', slug: 'germi' },
      { id: 7, name: 'نمین', slug: 'namin' },
      { id: 8, name: 'نیر', slug: 'nir' },
    ]
  },
  {
    id: 4,
    name: 'اصفهان',
    slug: 'esfahan',
    cities: [
      { id: 1, name: 'اصفهان', slug: 'esfahan' },
      { id: 2, name: 'کاشان', slug: 'kashan' },
      { id: 3, name: 'نجف آباد', slug: 'najafabad' },
      { id: 4, name: 'خمینی شهر', slug: 'khomeini-shahr' },
      { id: 5, name: 'شاهین شهر', slug: 'shahin-shahr' },
      { id: 6, name: 'فلاورجان', slug: 'falavarjan' },
      { id: 7, name: 'زرین شهر', slug: 'zarrin-shahr' },
      { id: 8, name: 'نطنز', slug: 'natanz' },
      { id: 9, name: 'شهرضا', slug: 'shahreza' },
      { id: 10, name: 'گلپایگان', slug: 'golpayegan' },
      { id: 11, name: 'خوانسار', slug: 'khvansar' },
      { id: 12, name: 'دولت آباد', slug: 'dowlatabad' },
      { id: 13, name: 'اردستان', slug: 'ardestan' },
      { id: 14, name: 'نائین', slug: 'naein' },
    ]
  },
  {
    id: 5,
    name: 'البرز',
    slug: 'alborz',
    cities: [
      { id: 1, name: 'کرج', slug: 'karaj' },
      { id: 2, name: 'فردیس', slug: 'fardis' },
      { id: 3, name: 'نظرآباد', slug: 'nazarabad' },
      { id: 4, name: 'اشتهارد', slug: 'eshtehard' },
      { id: 5, name: 'طالقان', slug: 'taleghan' },
      { id: 6, name: 'ساوجبلاغ', slug: 'saveh-bolagh' },
      { id: 7, name: 'هشتگرد', slug: 'hashtgerd' },
    ]
  },
  {
    id: 6,
    name: 'ایلام',
    slug: 'ilam',
    cities: [
      { id: 1, name: 'ایلام', slug: 'ilam' },
      { id: 2, name: 'دهلران', slug: 'dehloran' },
      { id: 3, name: 'آبدانان', slug: 'abdanan' },
      { id: 4, name: 'ایوان', slug: 'ivan' },
      { id: 5, name: 'مهران', slug: 'mehran' },
      { id: 6, name: 'دره شهر', slug: 'dareh-shahr' },
    ]
  },
  {
    id: 7,
    name: 'بوشهر',
    slug: 'bushehr',
    cities: [
      { id: 1, name: 'بوشهر', slug: 'bushehr' },
      { id: 2, name: 'برازجان', slug: 'borazjan' },
      { id: 3, name: 'کنگان', slug: 'kangan' },
      { id: 4, name: 'گناوه', slug: 'genaveh' },
      { id: 5, name: 'دیر', slug: 'deyr' },
      { id: 6, name: 'دشتستان', slug: 'dashtestan' },
      { id: 7, name: 'دشتی', slug: 'dashti' },
      { id: 8, name: 'جم', slug: 'jam' },
    ]
  },
  {
    id: 8,
    name: 'تهران',
    slug: 'tehran',
    cities: [
      { id: 1, name: 'تهران', slug: 'tehran' },
      { id: 2, name: 'ری', slug: 'rey' },
      { id: 3, name: 'شمیرانات', slug: 'shemiranat' },
      { id: 4, name: 'اسلامشهر', slug: 'eslamshahr' },
      { id: 5, name: 'شهریار', slug: 'shahriar' },
      { id: 6, name: 'ورامین', slug: 'varamin' },
      { id: 7, name: 'پاکدشت', slug: 'pakdasht' },
      { id: 8, name: 'دماوند', slug: 'damavand' },
      { id: 9, name: 'فیروزکوه', slug: 'firozkoh' },
      { id: 10, name: 'رباط کریم', slug: 'robat-karim' },
      { id: 11, name: 'قدس', slug: 'qods' },
      { id: 12, name: 'ملارد', slug: 'malard' },
      { id: 13, name: 'قرچک', slug: 'qarchak' },
      { id: 14, name: 'پردیس', slug: 'pardis' },
    ]
  },
  {
    id: 9,
    name: 'چهارمحال و بختیاری',
    slug: 'chaharmahal-bakhtiari',
    cities: [
      { id: 1, name: 'شهرکرد', slug: 'shahrekord' },
      { id: 2, name: 'بروجن', slug: 'borujen' },
      { id: 3, name: 'فارسان', slug: 'farsan' },
      { id: 4, name: 'لردگان', slug: 'lordegan' },
      { id: 5, name: 'اردل', slug: 'ardal' },
      { id: 6, name: 'کوهرنگ', slug: 'kuhrang' },
    ]
  },
  {
    id: 10,
    name: 'خراسان جنوبی',
    slug: 'khorasan-jonubi',
    cities: [
      { id: 1, name: 'بیرجند', slug: 'birjand' },
      { id: 2, name: 'قائنات', slug: 'ghayen' },
      { id: 3, name: 'فردوس', slug: 'ferdows' },
      { id: 4, name: 'طبس', slug: 'tabas' },
      { id: 5, name: 'نهبندان', slug: 'nehbandan' },
      { id: 6, name: 'سربیشه', slug: 'sarbisheh' },
      { id: 7, name: 'سرایان', slug: 'sarayan' },
      { id: 8, name: 'درمیان', slug: 'darmian' },
    ]
  },
  {
    id: 11,
    name: 'خراسان رضوی',
    slug: 'khorasan-razavi',
    cities: [
      { id: 1, name: 'مشهد', slug: 'mashhad' },
      { id: 2, name: 'نیشابور', slug: 'neyshabur' },
      { id: 3, name: 'سبزوار', slug: 'sabzevar' },
      { id: 4, name: 'تربت حیدریه', slug: 'torbat-heydariyeh' },
      { id: 5, name: 'تربت جام', slug: 'torbat-jam' },
      { id: 6, name: 'قوچان', slug: 'quchan' },
      { id: 7, name: 'گناباد', slug: 'gonabad' },
      { id: 8, name: 'کاشمر', slug: 'kashmar' },
      { id: 9, name: 'بردسکن', slug: 'bardaskan' },
      { id: 10, name: 'سرخس', slug: 'sarakhs' },
      { id: 11, name: 'فریمان', slug: 'fariman' },
      { id: 12, name: 'تایباد', slug: 'taybad' },
      { id: 13, name: 'خواف', slug: 'khaf' },
      { id: 14, name: 'چناران', slug: 'chenaran' },
      { id: 15, name: 'درگز', slug: 'dargaz' },
    ]
  },
  {
    id: 12,
    name: 'خراسان شمالی',
    slug: 'khorasan-shomali',
    cities: [
      { id: 1, name: 'بجنورد', slug: 'bojnord' },
      { id: 2, name: 'شیروان', slug: 'shirvan' },
      { id: 3, name: 'اسفراین', slug: 'esfarayen' },
      { id: 4, name: 'جاجرم', slug: 'jajarm' },
      { id: 5, name: 'فاروج', slug: 'faruj' },
      { id: 6, name: 'مانه و سملقان', slug: 'maneh-samalqan' },
    ]
  },
  {
    id: 13,
    name: 'خوزستان',
    slug: 'khuzestan',
    cities: [
      { id: 1, name: 'اهواز', slug: 'ahvaz' },
      { id: 2, name: 'آبادان', slug: 'abadan' },
      { id: 3, name: 'خرمشهر', slug: 'khorramshahr' },
      { id: 4, name: 'دزفول', slug: 'dezful' },
      { id: 5, name: 'اندیمشک', slug: 'andimeshk' },
      { id: 6, name: 'مسجد سلیمان', slug: 'masjed-soleyman' },
      { id: 7, name: 'شوشتر', slug: 'shushtar' },
      { id: 8, name: 'بهبهان', slug: 'behbahan' },
      { id: 9, name: 'ایذه', slug: 'izeh' },
      { id: 10, name: 'رامهرمز', slug: 'ramhormoz' },
      { id: 11, name: 'شادگان', slug: 'shadegan' },
      { id: 12, name: 'سوسنگرد', slug: 'susangerd' },
      { id: 13, name: 'بندر ماهشهر', slug: 'bandar-mahshahr' },
      { id: 14, name: 'هندیجان', slug: 'hendijan' },
      { id: 15, name: 'شوش', slug: 'sush' },
    ]
  },
  {
    id: 14,
    name: 'زنجان',
    slug: 'zanjan',
    cities: [
      { id: 1, name: 'زنجان', slug: 'zanjan' },
      { id: 2, name: 'ابهر', slug: 'abhar' },
      { id: 3, name: 'خدابنده', slug: 'khodabandeh' },
      { id: 4, name: 'خرمدره', slug: 'khorramdarreh' },
      { id: 5, name: 'طارم', slug: 'tarom' },
      { id: 6, name: 'ماه نشان', slug: 'mahneshan' },
      { id: 7, name: 'قیدار', slug: 'qeydar' },
    ]
  },
  {
    id: 15,
    name: 'سمنان',
    slug: 'semnan',
    cities: [
      { id: 1, name: 'سمنان', slug: 'semnan' },
      { id: 2, name: 'شاهرود', slug: 'shahrud' },
      { id: 3, name: 'دامغان', slug: 'damghan' },
      { id: 4, name: 'گرمسار', slug: 'garmsar' },
      { id: 5, name: 'مهدی شهر', slug: 'mehdishahr' },
      { id: 6, name: 'سرخه', slug: 'sorkheh' },
      { id: 7, name: 'بسطام', slug: 'bastam' },
    ]
  },
  {
    id: 16,
    name: 'سیستان و بلوچستان',
    slug: 'sistan-baluchestan',
    cities: [
      { id: 1, name: 'زاهدان', slug: 'zahedan' },
      { id: 2, name: 'زابل', slug: 'zabol' },
      { id: 3, name: 'چابهار', slug: 'chabahar' },
      { id: 4, name: 'ایرانشهر', slug: 'iranshahr' },
      { id: 5, name: 'سراوان', slug: 'saravan' },
      { id: 6, name: 'خاش', slug: 'khash' },
      { id: 7, name: 'نیکشهر', slug: 'nikshahr' },
      { id: 8, name: 'کنارک', slug: 'konarak' },
      { id: 9, name: 'سرباز', slug: 'sarbaz' },
      { id: 10, name: 'میرجاوه', slug: 'mirjaveh' },
    ]
  },
  {
    id: 17,
    name: 'فارس',
    slug: 'fars',
    cities: [
      { id: 1, name: 'شیراز', slug: 'shiraz' },
      { id: 2, name: 'مرودشت', slug: 'marvdasht' },
      { id: 3, name: 'جهرم', slug: 'jahrom' },
      { id: 4, name: 'فسا', slug: 'fasa' },
      { id: 5, name: 'کازرون', slug: 'kazerun' },
      { id: 6, name: 'لارستان', slug: 'larestan' },
      { id: 7, name: 'آباده', slug: 'abadeh' },
      { id: 8, name: 'داراب', slug: 'darab' },
      { id: 9, name: 'فیروزآباد', slug: 'firuzabad' },
      { id: 10, name: 'سپیدان', slug: 'sepidan' },
      { id: 11, name: 'لامرد', slug: 'lamerd' },
      { id: 12, name: 'ممسنی', slug: 'mamasani' },
      { id: 13, name: 'استهبان', slug: 'estahban' },
      { id: 14, name: 'نی ریز', slug: 'neyriz' },
    ]
  },
  {
    id: 18,
    name: 'قزوین',
    slug: 'qazvin',
    cities: [
      { id: 1, name: 'قزوین', slug: 'qazvin' },
      { id: 2, name: 'تاکستان', slug: 'takestan' },
      { id: 3, name: 'آبیک', slug: 'abyek' },
      { id: 4, name: 'بوئین زهرا', slug: 'buinzahra' },
      { id: 5, name: 'الوند', slug: 'alvand' },
      { id: 6, name: 'آوج', slug: 'avaj' },
    ]
  },
  {
    id: 19,
    name: 'قم',
    slug: 'qom',
    cities: [
      { id: 1, name: 'قم', slug: 'qom' },
      { id: 2, name: 'جعفریه', slug: 'jafarieh' },
    ]
  },
  {
    id: 20,
    name: 'کردستان',
    slug: 'kurdistan',
    cities: [
      { id: 1, name: 'سنندج', slug: 'sanandaj' },
      { id: 2, name: 'سقز', slug: 'saqqez' },
      { id: 3, name: 'مریوان', slug: 'marivan' },
      { id: 4, name: 'بانه', slug: 'baneh' },
      { id: 5, name: 'قروه', slug: 'qorveh' },
      { id: 6, name: 'بیجار', slug: 'bijar' },
      { id: 7, name: 'کامیاران', slug: 'kamyaran' },
      { id: 8, name: 'دیواندره', slug: 'divandarreh' },
      { id: 9, name: 'سروآباد', slug: 'sarvabd' },
    ]
  },
  {
    id: 21,
    name: 'کرمان',
    slug: 'kerman',
    cities: [
      { id: 1, name: 'کرمان', slug: 'kerman' },
      { id: 2, name: 'رفسنجان', slug: 'rafsanjan' },
      { id: 3, name: 'جیرفت', slug: 'jiroft' },
      { id: 4, name: 'سیرجان', slug: 'sirjan' },
      { id: 5, name: 'بم', slug: 'bam' },
      { id: 6, name: 'زرند', slug: 'zarand' },
      { id: 7, name: 'شهربابک', slug: 'shahrbabak' },
      { id: 8, name: 'کهنوج', slug: 'kahnuj' },
      { id: 9, name: 'بردسیر', slug: 'bardsir' },
      { id: 10, name: 'بافت', slug: 'baft' },
      { id: 11, name: 'راور', slug: 'ravar' },
      { id: 12, name: 'انار', slug: 'anar' },
      { id: 13, name: 'ماهان', slug: 'mahan' },
    ]
  },
  {
    id: 22,
    name: 'کرمانشاه',
    slug: 'kermanshah',
    cities: [
      { id: 1, name: 'کرمانشاه', slug: 'kermanshah' },
      { id: 2, name: 'اسلام آباد غرب', slug: 'islamabad-gharb' },
      { id: 3, name: 'پاوه', slug: 'paveh' },
      { id: 4, name: 'جوانرود', slug: 'javanrud' },
      { id: 5, name: 'سرپل ذهاب', slug: 'sarpol-zahab' },
      { id: 6, name: 'قصر شیرین', slug: 'qasr-shirin' },
      { id: 7, name: 'کنگاور', slug: 'kangavar' },
      { id: 8, name: 'صحنه', slug: 'sahneh' },
      { id: 9, name: 'هرسین', slug: 'harsin' },
      { id: 10, name: 'گیلانغرب', slug: 'gilan-gharb' },
      { id: 11, name: 'روانسر', slug: 'ravansar' },
      { id: 12, name: 'سنقر', slug: 'songhor' },
    ]
  },
  {
    id: 23,
    name: 'کهگیلویه و بویراحمد',
    slug: 'kohgiluyeh-boyerahmad',
    cities: [
      { id: 1, name: 'یاسوج', slug: 'yasuj' },
      { id: 2, name: 'گچساران', slug: 'gachsaran' },
      { id: 3, name: 'دوگنبدان', slug: 'dogonbadan' },
      { id: 4, name: 'دهدشت', slug: 'dehdasht' },
      { id: 5, name: 'سی سخت', slug: 'sisakh' },
      { id: 6, name: 'دنا', slug: 'dena' },
    ]
  },
  {
    id: 24,
    name: 'گلستان',
    slug: 'golestan',
    cities: [
      { id: 1, name: 'گرگان', slug: 'gorgan' },
      { id: 2, name: 'گنبد کاووس', slug: 'gonbad-kavus' },
      { id: 3, name: 'علی آباد کتول', slug: 'aliabad-katoul' },
      { id: 4, name: 'آق قلا', slug: 'aq-qala' },
      { id: 5, name: 'بندر ترکمن', slug: 'bandar-torkaman' },
      { id: 6, name: 'کردکوی', slug: 'kordkuy' },
      { id: 7, name: 'بندرگز', slug: 'bandar-gaz' },
      { id: 8, name: 'آزادشهر', slug: 'azadshahr' },
      { id: 9, name: 'مینودشت', slug: 'minudasht' },
      { id: 10, name: 'رامیان', slug: 'ramian' },
      { id: 11, name: 'کلاله', slug: 'kalaleh' },
      { id: 12, name: 'گمیشان', slug: 'gomishan' },
    ]
  },
  {
    id: 25,
    name: 'گیلان',
    slug: 'gilan',
    cities: [
      { id: 1, name: 'رشت', slug: 'rasht' },
      { id: 2, name: 'انزلی', slug: 'anzali' },
      { id: 3, name: 'لاهیجان', slug: 'lahijan' },
      { id: 4, name: 'لنگرود', slug: 'langarud' },
      { id: 5, name: 'رودسر', slug: 'rudsar' },
      { id: 6, name: 'تالش', slug: 'talesh' },
      { id: 7, name: 'آستارا', slug: 'astara' },
      { id: 8, name: 'آستانه اشرفیه', slug: 'astaneh-ashrafiyeh' },
      { id: 9, name: 'رضوانشهر', slug: 'rezvanshahr' },
      { id: 10, name: 'فومن', slug: 'fuman' },
      { id: 11, name: 'صومعه سرا', slug: 'sowme_sara' },
      { id: 12, name: 'ماسال', slug: 'masal' },
      { id: 13, name: 'شفت', slug: 'shaft' },
      { id: 14, name: 'املش', slug: 'amlash' },
    ]
  },
  {
    id: 26,
    name: 'لرستان',
    slug: 'lorestan',
    cities: [
      { id: 1, name: 'خرم آباد', slug: 'khorramabad' },
      { id: 2, name: 'بروجرد', slug: 'borujerd' },
      { id: 3, name: 'دورود', slug: 'dorud' },
      { id: 4, name: 'الیگودرز', slug: 'aligudarz' },
      { id: 5, name: 'ازنا', slug: 'azna' },
      { id: 6, name: 'کوهدشت', slug: 'kuhdasht' },
      { id: 7, name: 'الشتر', slug: 'alashtar' },
      { id: 8, name: 'نورآباد', slug: 'nurabad' },
      { id: 9, name: 'پلدختر', slug: 'pol-dokhtar' },
    ]
  },
  {
    id: 27,
    name: 'مازندران',
    slug: 'mazandaran',
    cities: [
      { id: 1, name: 'ساری', slug: 'sari' },
      { id: 2, name: 'بابل', slug: 'babol' },
      { id: 3, name: 'آمل', slug: 'amol' },
      { id: 4, name: 'قائم شهر', slug: 'qaemshahr' },
      { id: 5, name: 'بابلسر', slug: 'babolsar' },
      { id: 6, name: 'تنکابن', slug: 'tonekabon' },
      { id: 7, name: 'چالوس', slug: 'chalus' },
      { id: 8, name: 'نوشهر', slug: 'nowshahr' },
      { id: 9, name: 'رامسر', slug: 'ramsar' },
      { id: 10, name: 'محمودآباد', slug: 'mahmudabad' },
      { id: 11, name: 'نکا', slug: 'neka' },
      { id: 12, name: 'جویبار', slug: 'juybar' },
      { id: 13, name: 'بهشهر', slug: 'behshahr' },
      { id: 14, name: 'سواد کوه', slug: 'savadkuh' },
      { id: 15, name: 'نور', slug: 'nur' },
    ]
  },
  {
    id: 28,
    name: 'مرکزی',
    slug: 'markazi',
    cities: [
      { id: 1, name: 'اراک', slug: 'arak' },
      { id: 2, name: 'ساوه', slug: 'saveh' },
      { id: 3, name: 'خمین', slug: 'khomein' },
      { id: 4, name: 'محلات', slug: 'mahallat' },
      { id: 5, name: 'دلیجان', slug: 'delijan' },
      { id: 6, name: 'تفرش', slug: 'tafresh' },
      { id: 7, name: 'شازند', slug: 'shazand' },
      { id: 8, name: 'آشتیان', slug: 'ashtian' },
    ]
  },
  {
    id: 29,
    name: 'هرمزگان',
    slug: 'hormozgan',
    cities: [
      { id: 1, name: 'بندرعباس', slug: 'bandar-abbas' },
      { id: 2, name: 'میناب', slug: 'minab' },
      { id: 3, name: 'بندر لنگه', slug: 'bandar-lengeh' },
      { id: 4, name: 'قشم', slug: 'qeshm' },
      { id: 5, name: 'کیش', slug: 'kish' },
      { id: 6, name: 'جاسک', slug: 'jask' },
      { id: 7, name: 'بستک', slug: 'bastak' },
      { id: 8, name: 'حاجی آباد', slug: 'hajiabad' },
      { id: 9, name: 'رودان', slug: 'rudan' },
      { id: 10, name: 'ابوموسی', slug: 'abu-musa' },
    ]
  },
  {
    id: 30,
    name: 'همدان',
    slug: 'hamadan',
    cities: [
      { id: 1, name: 'همدان', slug: 'hamadan' },
      { id: 2, name: 'ملایر', slug: 'malayer' },
      { id: 3, name: 'نهاوند', slug: 'nahavand' },
      { id: 4, name: 'تویسرکان', slug: 'toyserkan' },
      { id: 5, name: 'اسدآباد', slug: 'asadabad' },
      { id: 6, name: 'بهار', slug: 'bahar' },
      { id: 7, name: 'رزن', slug: 'razan' },
      { id: 8, name: 'کبودرآهنگ', slug: 'kabudarahang' },
      { id: 9, name: 'فامنین', slug: 'famenin' },
    ]
  },
  {
    id: 31,
    name: 'یزد',
    slug: 'yazd',
    cities: [
      { id: 1, name: 'یزد', slug: 'yazd' },
      { id: 2, name: 'میبد', slug: 'meybod' },
      { id: 3, name: 'اردکان', slug: 'ardakan' },
      { id: 4, name: 'ابرکوه', slug: 'abarkuh' },
      { id: 5, name: 'تفت', slug: 'taft' },
      { id: 6, name: 'مهریز', slug: 'mehriz' },
      { id: 7, name: 'بافق', slug: 'bafq' },
      { id: 8, name: 'طبس', slug: 'tabas' },
      { id: 9, name: 'هرات', slug: 'harat' },
    ]
  },
]

/**
 * Get all province names
 */
export const getProvinceNames = (): string[] => {
  return iranProvinces.map(p => p.name)
}

/**
 * Get cities by province name
 */
export const getCitiesByProvince = (provinceName: string): City[] => {
  const province = iranProvinces.find(p => p.name === provinceName)
  return province?.cities || []
}

/**
 * Search provinces and cities
 */
export const searchLocation = (query: string): { provinces: Province[], cities: City[] } => {
  const lowerQuery = query.toLowerCase()
  
  const matchingProvinces = iranProvinces.filter(p => 
    p.name.includes(query) || p.slug.includes(lowerQuery)
  )
  
  const matchingCities: City[] = []
  iranProvinces.forEach(province => {
    const cities = province.cities.filter(c => 
      c.name.includes(query) || c.slug.includes(lowerQuery)
    )
    matchingCities.push(...cities)
  })
  
  return {
    provinces: matchingProvinces,
    cities: matchingCities
  }
}
