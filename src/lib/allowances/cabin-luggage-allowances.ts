export interface AirlineAllowance {
	id: string;
	airline: string;
	region: string;
	link?: string;
	carryOn: {
		centimeters?: number | number[];
		inches?: number | number[];
		mayNotBeIncluded?: boolean;
	};
	personalItem?: {
		centimeters?: number | number[];
		inches?: number | number[];
	};
	pounds?: number;
	kilograms?: number;
	test?: {
		matchText?: (RegExp | string)[];
		comment?: string;
	};
}

export const allowances: AirlineAllowance[] = [
	{
		id: 'finnair',
		airline: 'Finnair',
		region: 'Europe',
		link: 'https://www.finnair.com/en/baggage-on-finnair-flights/carry-on-baggage',
		kilograms: 8,
		test: {
			matchText: [
				'Carry-on bag maximum dimensions (length x width x height) 55cm x 40cm x 23cm (22in x 16in x 9in)',
				'Small bag a small bag such as a small handbag, a small laptop bag or a small backpackmaximum dimensions (length x width x height) 40cm x 30cm x 15cm (16in x 12in x 6in)'
			]
		},
		carryOn: {
			centimeters: [55, 40, 23],
			inches: [22, 16, 9]
		},
		personalItem: {
			centimeters: [40, 30, 15],
			inches: [15.7, 11.8, 5.9]
		}
	},
	{
		id: 'thai-lion-air',
		airline: 'Thai Lion Air',
		region: 'Asia',
		link: 'https://www.lionairthai.com/en/ThaiLionAir-Experience/Baggage-Allowance',
		kilograms: 7,
		test: {
			matchText: ['not exceed 30 x 40 x 20 cm']
		},
		carryOn: {
			centimeters: [40, 30, 20],
			inches: [15.7, 11.8, 7.9]
		}
	},
	{
		id: 'wizz-air',
		airline: 'Wizz Air',
		region: 'Europe',
		link: 'https://wizzair.com/en-gb/help-centre/booking-information-and-services/baggage/baggage-allowance/cabin-baggage',
		kilograms: 10,
		test: {
			matchText: ['Maximum size: 40 x 30 x 20 cm, 10kg']
		},
		carryOn: {
			centimeters: [55, 40, 23],
			mayNotBeIncluded: true
		},
		personalItem: {
			centimeters: [40, 30, 20]
		}
	},
	{
		id: 'loganair',
		airline: 'Loganair',
		region: 'Europe',
		link: 'https://www.loganair.co.uk/get-ready-to-fly/luggage-guidance/',
		pounds: 13,
		kilograms: 6,
		test: {
			matchText: ['not exceed dimensions of 40cm x 35cm x 18cm']
		},
		carryOn: {
			centimeters: [40, 35, 18]
		}
	},
	{
		id: 'aer-lingus',
		airline: 'Aer Lingus',
		region: 'Europe',
		link: 'https://www.aerlingus.com/travel-information/baggage-information/cabin-baggage/',
		pounds: 22,
		kilograms: 10,
		test: {
			matchText: ['Height: 48cm (18.5") Width: 33cm (13") and Depth: 20cm (8")']
		},
		carryOn: {
			centimeters: [55, 40, 24],
			inches: [21.5, 15.5, 9.5]
		},
		personalItem: {
			centimeters: [40, 30, 20],
			inches: [15.5, 11.5, 8]
		}
	},
	{
		id: 'aer-lingus-regional',
		airline: 'Aer Lingus Regional',
		region: 'Europe',
		link: 'https://www.aerlingus.com/travel-information/baggage-information/cabin-baggage/',
		pounds: 15,
		kilograms: 7,
		test: {
			matchText: ['Height: 48cm (18.5") Width: 33cm (13") and Depth: 20cm (8")']
		},
		carryOn: {
			centimeters: [48, 33, 20],
			inches: [18.5, 13, 8]
		},
		personalItem: {
			centimeters: [40, 30, 20],
			inches: [15.5, 11.5, 8]
		}
	},
	{
		id: 'rex-regional-express-airlines',
		airline: 'REX Regional Express Airlines',
		region: 'Oceania',
		link: 'https://www.rex.com.au/FlightInfo/BaggageAllowance.aspx',
		kilograms: 7,
		carryOn: {
			centimeters: [48, 34, 23]
		}
	},
	{
		id: 'virgin-australia',
		airline: 'Virgin Australia',
		region: 'Oceania',
		link: 'https://www.virginaustralia.com/au/en/travel-info/baggage/carry-on-baggage/',
		kilograms: 7,
		test: {
			matchText: ["maximum of 23 x 36 x 56cm (that's around 9 x 14 x 22 inches)"]
		},
		carryOn: {
			centimeters: [56, 36, 23]
		}
	},
	{
		id: 'qatar-airways',
		airline: 'Qatar Airways',
		region: 'Asia',
		link: 'https://www.qatarairways.com/en/baggage/allowance.html',
		pounds: 15,
		kilograms: 7,
		test: {
			matchText: ['Maximum dimensions for each piece of hand baggage are 50x37x25cm (20x15x10in)']
		},
		carryOn: {
			centimeters: [50, 37, 25],
			inches: [20, 15, 10]
		}
	},
	{
		id: 'air-moldova',
		airline: 'Air Moldova',
		region: 'Europe',
		link: 'https://www.airmoldova.md/hand-baggage-en/',
		kilograms: 8,
		test: {
			matchText: ['maximum total size of 115 cm (50 x 40 x 25 cm)']
		},
		carryOn: {
			centimeters: [50, 40, 25]
		}
	},
	{
		id: 'atlantic-airways',
		airline: 'Atlantic Airways',
		region: 'Europe',
		link: 'https://www.atlanticairways.com/en/travel-info/luggage',
		kilograms: 8,
		test: {
			matchText: ['Maximum measurement: (55x40x25cm) Weight: 8 kg + laptop bag']
		},
		carryOn: {
			centimeters: [55, 40, 25]
		}
	},
	{
		id: 'etihad-airways',
		airline: 'Etihad Airways',
		region: 'Africa',
		link: 'https://www.etihad.com/content/eag/etihadairways/etihadcom/global/en/fly-etihad/baggage/cabin-bags.html',
		kilograms: 7,
		test: {
			matchText: [
				'You can carry one cabin bag weighing up to 7kg. It cannot be bigger than 56cm x 36cm x 23cm.'
			]
		},
		carryOn: {
			centimeters: [56, 36, 23]
		},
		personalItem: {
			centimeters: [39, 23, 19]
		}
	},
	{
		id: 'air-transat',
		airline: 'Air Transat',
		region: 'North America',
		link: 'https://www.airtransat.com/en-CA/Travel-information/Baggage/weight-dimensions',
		test: {
			matchText: ['40 cm in length, 23 cm in width and 55 cm in height']
		},
		carryOn: {
			centimeters: [55, 40, 23]
		},
		personalItem: {
			centimeters: [43, 31, 13]
		}
	},
	{
		id: 'sunwing-airlines',
		airline: 'Sunwing Airlines',
		region: 'North America',
		link: 'https://www.sunwing.ca/en/westjet-airlines/baggage-and-seat-selection',
		carryOn: {
			inches: [22, 14, 9]
		},
		personalItem: {
			inches: [16, 13, 6]
		}
	},
	{
		id: 'westjet',
		airline: 'WestJet',
		region: 'North America',
		link: 'https://www.westjet.com/en-ca/baggage#baggage-carry-on',
		test: {
			matchText: ['53 cm x 23 cm x 38 cm']
		},
		carryOn: {
			centimeters: [53, 38, 23]
		}
	},
	{
		id: 'aerolineas-argentinas',
		airline: 'Aerolineas Argentinas',
		region: 'Latin America',
		link: 'https://www.aerolineas.com.ar/en-us/baggage-allowance',
		kilograms: 8,
		carryOn: {
			centimeters: [55, 35, 25]
		}
	},
	{
		id: 'air-corsica',
		airline: 'Air Corsica',
		region: 'Europe',
		link: 'https://www.aircorsica.com/flights/cabin-hold-baggage.html',
		pounds: 17.6,
		kilograms: 8,
		test: {
			matchText: ['x 35 cm in width x 25 cm in depth']
		},
		carryOn: {
			centimeters: [55, 35, 25]
		}
	},
	{
		id: 'air-europa',
		airline: 'Air Europa',
		region: 'Europe',
		link: 'https://www.aireuropa.com/ot/en/aea/travel-information/baggage/carry-on-luggage.html',
		pounds: 22,
		kilograms: 10,
		test: {
			matchText: ['Its maximum dimensions are height x width x length: 55 x 35 x 25 cm']
		},
		carryOn: {
			centimeters: [55, 35, 25]
		}
	},
	{
		id: 'air-france',
		airline: 'Air France',
		region: 'Europe',
		link: 'https://wwws.airfrance.us/information/bagages/bagage-cabine-soute',
		pounds: 26,
		kilograms: 12,
		test: {
			matchText: [
				'The maximum dimensions of your hand baggage are: 55 x 35 x 25 cm/21.7 x 13.8 x 9.9 in.'
			]
		},
		carryOn: {
			centimeters: [55, 35, 25],
			inches: [21.7, 13.8, 9.9]
		}
	},
	{
		id: 'air-india',
		airline: 'Air India',
		region: 'Asia',
		link: 'https://www.airindia.in/hand-luggage.htm',
		pounds: 17.6,
		kilograms: 8,
		test: {
			matchText: ['55 cm', '(21.6 in)', '40 cm', '(15.7 in)', '20 cm', '(7.8 in)']
		},
		carryOn: {
			centimeters: [55, 40, 20],
			inches: [21.6, 15.7, 7.8]
		}
	},
	{
		id: 'air-mauritius',
		airline: 'Air Mauritius',
		region: 'Africa',
		link: 'https://www.airmauritius.com/baggage/carry-on',
		pounds: 15,
		kilograms: 7,
		test: {
			matchText: ['hand baggage with dimensions 35 x 55 x 25 cm']
		},
		carryOn: {
			centimeters: [55, 35, 25]
		}
	},
	{
		id: 'air-tahiti',
		airline: 'Air Tahiti',
		region: 'Oceania',
		link: 'https://www.airtahiti.com/en/carry-on-baggage',
		pounds: 11,
		kilograms: 5,
		test: {
			matchText: ['Maximum total dimensions: 55 x 35 x 25 cm (21.7 x 13.8 x 9.9 in)']
		},
		carryOn: {
			centimeters: [55, 35, 25],
			inches: [21.7, 13.8, 9.9]
		}
	},
	{
		id: 'avianca-airlines',
		airline: 'Avianca Airlines',
		region: 'Latin America',
		link: 'https://ayuda.avianca.com/hc/en-us/articles/13080259544219-What-is-carry-on-baggage-and-how-can-I-purchase-it',
		pounds: 22,
		kilograms: 10,
		test: {
			matchText: ['not exceeding 22 x 14 x 10 in. (height, length, width)']
		},
		carryOn: {
			inches: [22, 14, 10]
		}
	},
	{
		id: 'georgian-airways',
		airline: 'Georgian Airways',
		region: 'Europe',
		link: 'https://georgian-airways.com/en/service/baggage-information',
		pounds: 17.6,
		kilograms: 8,
		test: {
			matchText: ['not more than 8 kg (115 cm by the sum of 3 dimensions)']
		},
		carryOn: {
			centimeters: 115
		}
	},
	{
		id: 'gol-airlines',
		airline: 'GOL Airlines',
		region: 'Latin America',
		link: 'https://www.voegol.com.br/en/information/baggage',
		kilograms: 10,
		test: {
			matchText: ['35 cm wide, 55 cm high and 25 cm deep']
		},
		carryOn: {
			centimeters: [55, 35, 25]
		}
	},
	{
		id: 'indigo-airlines',
		airline: 'IndiGo Airlines',
		region: 'Asia',
		link: 'https://www.goindigo.in/baggage/baggage-allowance.html',
		kilograms: 7,
		test: {
			matchText: ['One handbag up to 7 kgs and 115 cms (L+W+H) allowed per passenger']
		},
		carryOn: {
			centimeters: 115
		}
	},
	{
		id: 'kenya-airways',
		airline: 'Kenya Airways',
		region: 'Africa',
		link: 'https://www.kenya-airways.com/en/plan/baggage-information/hand-baggage/',
		kilograms: 12,
		test: {
			matchText: ['(max L55xW25xH35cm each)']
		},
		carryOn: {
			centimeters: [55, 35, 25]
		}
	},
	{
		id: 'klm-royal-dutch-airlines',
		airline: 'KLM Royal Dutch Airlines',
		region: 'Europe',
		link: 'https://www.klm.hr/information/baggage/hand-baggage-allowance',
		kilograms: 12,
		test: {
			matchText: ['maximum size of 55 x 35 x 25 cm']
		},
		carryOn: {
			centimeters: [55, 35, 25]
		}
	},
	{
		id: 'latam-airlines',
		airline: 'LATAM Airlines',
		region: 'Latin America',
		link: 'https://www.latamairlines.com/us/en/experience/prepare-your-trip/baggage/carry-on',
		kilograms: 12,
		test: {
			matchText: ['(17.8 x 13.8 x 7.9 in)']
		},
		carryOn: {
			centimeters: [55, 35, 25]
		}
	},
	{
		id: 'spicejet',
		airline: 'SpiceJet',
		region: 'Asia',
		link: 'https://corporate.spicejet.com/AirTravelBaggageFaq.aspx',
		kilograms: 7,
		test: {
			matchText: [
				'Hand baggage size must be within the dimensions of: 55 cm + 35 cm + 25 cm (L+W+H; total 115 cm) on Boeing flights and 50 cm + 35 cm + 23 cm (L+W+H; total 108 cm or 42.5 inches) on Q400'
			]
		},
		carryOn: {
			centimeters: [55, 35, 25]
		}
	},
	{
		id: 'transavia',
		airline: 'Transavia',
		region: 'Europe',
		link: 'https://www.transavia.com/help/en-eu/luggage/cabin-luggage/cabin-bag',
		kilograms: 10,
		test: {
			matchText: ['cabin bag (55 x 35 x 25 cm*)']
		},
		carryOn: {
			centimeters: [55, 35, 25]
		}
	},
	{
		id: 'aurigny',
		airline: 'Aurigny',
		region: 'Europe',
		link: 'https://www.aurigny.com/faqs',
		kilograms: 10,
		test: {
			matchText: ['One piece with maximum dimensions of 55x36x20cm']
		},
		carryOn: {
			centimeters: [55, 36, 20]
		}
	},
	{
		id: 'emirates',
		airline: 'Emirates',
		region: 'Asia',
		link: 'https://www.emirates.com/us/english/before-you-fly/baggage/cabin-baggage-rules/',
		kilograms: 7,
		test: {
			matchText: ['Carry-on dimensions should not exceed 55 x 38 x 22cm']
		},
		carryOn: {
			centimeters: [55, 38, 20]
		}
	},
	{
		id: 'royal-brunei-airlines',
		airline: 'Royal Brunei Airlines',
		region: 'Asia',
		link: 'https://www.flyroyalbrunei.com/brunei/en/information/cabin-baggage/',
		kilograms: 7,
		test: {
			matchText: ['1 Bag 55 x 38 x 20 cms']
		},
		carryOn: {
			centimeters: [55, 38, 20],
			inches: [22, 15, 8]
		}
	},
	{
		id: 'air-austral',
		airline: 'Air Austral',
		region: 'Europe',
		link: 'https://www.air-austral.com/en/prepare-your-flight/your-baggage/carry-on-baggage.html',
		kilograms: 12,
		test: {
			matchText: ['55x35x25 cm ( pockets, wheels and handles included )']
		},
		carryOn: {
			centimeters: [55, 35, 25]
		}
	},
	{
		id: 'air-china',
		airline: 'Air China',
		region: 'Asia',
		link: 'https://www.airchina.us/US/GB/info/carry-on-baggage/',
		pounds: 11,
		kilograms: 5,
		test: {
			matchText: [
				'Each carry-on must not be more than 55cm (22”) in length,\n  40cm (16”) in width and 20cm (8”) in height'
			]
		},
		carryOn: {
			centimeters: [55, 40, 20],
			inches: [22, 16, 8]
		}
	},
	{
		id: 'air-tahiti-nui',
		airline: 'Air Tahiti Nui',
		region: 'Oceania',
		link: 'https://us.airtahitinui.com/baggage-allowances',
		pounds: 22,
		kilograms: 10,
		test: {
			matchText: [
				'All cabin baggage must be less than or equal to 115 cm / 45 inches (sum of the 3 dimensions A + B + C).'
			]
		},
		carryOn: {
			centimeters: 115
		}
	},
	{
		id: 'armenia-aircompany',
		airline: 'Armenia Aircompany',
		region: 'Asia',
		link: 'https://armenianairlines.am/en/baggage/hand-luggage',
		kilograms: 8,
		test: {
			matchText: ['dimensions do not exceed 55x40x20 cm']
		},
		carryOn: {
			centimeters: [55, 40, 20]
		}
	},
	{
		id: 'asiana-airlines',
		airline: 'Asiana Airlines',
		region: 'Asia',
		link: 'https://flyasiana.com/C/US/EN/contents/carry-on-baggage',
		kilograms: 10,
		test: {
			matchText: [
				'the maximum dimension of each side is A (height) 55 cm x B (depth) 20 cm X C (width) 40 cm'
			]
		},
		carryOn: {
			centimeters: [55, 40, 20]
		}
	},
	{
		id: 'azores-airlines',
		airline: 'Azores Airlines',
		region: 'Europe',
		link: 'https://www.azoresairlines.pt/en/information/baggage/carry-on-baggage',
		pounds: 17,
		kilograms: 8,
		test: {
			matchText: ['55x40x20 cm']
		},
		carryOn: {
			centimeters: [55, 40, 20]
		}
	},
	{
		id: 'azul',
		airline: 'Azul',
		region: 'Latin America',
		link: 'https://www.voeazul.com.br/fr/en/your-trip/plan/luggage/carry-on-and-personal-luggage',
		kilograms: 10,
		test: {
			matchText: [
				'The maximum limit for this type of luggage is up to 115 cm (adding up all sides of the suitcase, including pockets, wheels, and handles) and up to 10kg.'
			]
		},
		carryOn: {
			centimeters: 115
		}
	},
	{
		id: 'carpatair',
		airline: 'Carpatair',
		region: 'Europe',
		link: 'https://www.carpatair.com/baggage-rules/',
		pounds: 11,
		kilograms: 5,
		test: {
			matchText: [
				'that may not exceed 5 kg in weight and dimensions may not exceed 55cm x 40cm x 20cm'
			]
		},
		carryOn: {
			centimeters: [55, 40, 20]
		}
	},
	{
		id: 'china-southern',
		airline: 'China Southern',
		region: 'Asia',
		link: 'https://www.csair.com/us/en/tourguide/luggage_service/carryon_luggage/',
		kilograms: 5,
		test: {
			matchText: [
				'The length, width and height of each carry-on shall not exceed ：55 * 40 * 20 cm (or 22 * 16 * 8 inches)'
			]
		},
		carryOn: {
			centimeters: [55, 40, 20],
			inches: [22, 16, 8]
		}
	},
	{
		id: 'condor',
		airline: 'Condor',
		region: 'Europe',
		link: 'https://www.condor.com/eu/flight-preparation/baggage-and-animals/carry-on.jsp',
		kilograms: 8,
		test: {
			matchText: ['Max. size: 55 x 40 x 20 cm']
		},
		carryOn: {
			centimeters: [55, 40, 20]
		}
	},
	{
		id: 'corsair-international',
		airline: 'Corsair International',
		region: 'Europe',
		link: 'https://www.flycorsair.com/en-ca/cabin-luggage/cabin-luggage-allowance',
		kilograms: 12,
		test: {
			matchText: ['55 x 40 x 20 cm']
		},
		carryOn: {
			centimeters: [55, 40, 20]
		}
	},
	{
		id: 'croatia-airlines',
		airline: 'Croatia Airlines',
		region: 'Europe',
		link: 'https://www.croatiaairlines.com/Baggage/Hand-baggage',
		kilograms: 8,
		test: {
			matchText: ['max 115 cm (55x40x20 cm)']
		},
		carryOn: {
			centimeters: [55, 40, 20]
		}
	},
	{
		id: 'hainan-airlines',
		airline: 'Hainan Airlines',
		region: 'Asia',
		link: 'https://www.hainanairlines.com/HUPortal/dyn/portal/DisplayPage?COUNTRY_SITE=US&SITE=CBHZCBHZ&LANGUAGE=US&PAGE=CABA',
		pounds: 22,
		kilograms: 10,
		test: {
			matchText: ['No more than 55cm (22in) X 40cm (16in) X 20cm (8in) (length, width, and height)']
		},
		carryOn: {
			centimeters: [55, 40, 20],
			inches: [22, 16, 8]
		}
	},
	{
		id: 'helvetic-airways',
		airline: 'Helvetic Airways',
		region: 'Europe',
		link: 'https://www.helvetic.com/en/travelinfo#!info=baggage',
		kilograms: 8,
		test: {
			matchText: ['(dimensions 55x40x20 cm)']
		},
		carryOn: {
			centimeters: [55, 40, 20]
		}
	},
	{
		id: 'icelandair',
		airline: 'Icelandair',
		region: 'Europe',
		link: 'https://www.icelandair.com/support/baggage/allowance/#carry-on-baggage-allowance',
		pounds: 22,
		kilograms: 10,
		test: {
			matchText: [
				'Maximum size (including handles and wheels): 21.6x15.7x7.8 inches (55x40x20 cm).'
			]
		},
		carryOn: {
			centimeters: [55, 40, 20],
			inches: [21.6, 15.7, 7.8]
		}
	},
	{
		id: 'jet-time',
		airline: 'Jet Time',
		region: 'Europe',
		link: 'https://jettime.com/bagage/hand-baggage',
		kilograms: 5,
		test: {
			matchText: [/Max\. 5 kg\s+-\s+55 x 40 x 20 cm/]
		},
		carryOn: {
			centimeters: [55, 40, 20]
		}
	},
	{
		id: 'korean-air',
		airline: 'Korean Air',
		region: 'Asia',
		link: 'https://www.koreanair.com/contents/plan-your-travel/baggage/carry-on-baggage',
		kilograms: 10,
		test: {
			matchText: [
				'Within 115 cm (45 in) in total length x width x height (including handles and wheels)'
			]
		},
		carryOn: {
			centimeters: 115
		}
	},
	{
		id: 'miat-mongolian-airlines',
		airline: 'MIAT Mongolian Airlines',
		region: 'Asia',
		link: 'https://www.miat.com/pagecontent.php?pageId=151&lang=en',
		kilograms: 8,
		test: {
			matchText: ['Dimensions cannot exceed 115сm /55(A)x40(C)x20(B) cm']
		},
		carryOn: {
			centimeters: [55, 40, 20]
		}
	},
	{
		id: 'pegasus-airlines',
		airline: 'Pegasus Airlines',
		region: 'Asia',
		link: 'https://www.flypgs.com/en/pegasus-baggage-allowance',
		kilograms: 8,
		carryOn: {
			centimeters: [55, 40, 20],
			inches: [22, 16, 8]
		}
	},
	{
		id: 'plus-ultra',
		airline: 'Plus Ultra',
		region: 'Europe',
		link: 'https://www.plusultra.com/es-es/informacion/equipaje/equipaje-en-cabina/',
		kilograms: 10,
		test: {
			matchText: ['55x40x20 cm']
		},
		carryOn: {
			centimeters: [55, 40, 20]
		}
	},
	{
		id: 'ryanair',
		airline: 'Ryanair',
		region: 'Europe',
		link: 'https://www.ryanair.com/gb/en/useful-info/help-centre/terms-and-conditions/termsandconditionsar_696869348',
		kilograms: 10,
		test: {
			matchText: [
				'large piece of Cabin Baggage, weighing up to 10kg with maximum dimensions of 55cm x 40cm x 20cm'
			]
		},
		carryOn: {
			centimeters: [55, 40, 20]
		}
	},
	{
		id: 'spring-airlines',
		airline: 'Spring Airlines',
		region: 'Asia',
		link: 'https://en.ch.com/flights/excess-baggage',
		kilograms: 7,
		test: {
			matchText: ['L: 30cm W: 20cm  H: 40cm']
		},
		carryOn: {
			centimeters: [40, 30, 20]
		}
	},
	{
		id: 'tap-portugal',
		airline: 'TAP Portugal',
		region: 'Europe',
		link: 'https://www.flytap.com/en-de/baggage/hand-baggage',
		pounds: 22,
		kilograms: 10,
		test: {
			matchText: ['Maximum dimensions: 55 x 40 x 25 cm / 22 x 16 x 10 in (height x length x width)']
		},
		carryOn: {
			centimeters: [55, 40, 25]
		}
	},
	{
		id: 'tarom',
		airline: 'TAROM',
		region: 'Europe',
		link: 'https://www.tarom.ro/en/passenger-information/baggage/hand-baggage/',
		kilograms: 8,
		test: {
			matchText: ['in the cabin one hand baggage sized maximum 55x 40x 20cm']
		},
		carryOn: {
			centimeters: [55, 40, 20]
		}
	},
	{
		id: 'tuifly',
		airline: 'TUIfly',
		region: 'Europe',
		link: 'https://www.tui.com/service-kontakt/flug/handgepaeck',
		kilograms: 10,
		test: {
			matchText: ['55 x 40 x 20 cm']
		},
		carryOn: {
			centimeters: [55, 40, 20]
		}
	},
	{
		id: 'vivaaerobus',
		airline: 'VivaAerobus',
		region: 'South America',
		link: 'https://blog.vivaaerobus.com/en/baggage-policies/',
		pounds: 22,
		kilograms: 10,
		test: {
			matchText: [
				'For Light, Extra, and Smart, your carry-on bag can be 16in long x 10in wide x 22in high (40 cm long, 25cm wide, and 55 cm high).'
			]
		},
		carryOn: {
			centimeters: [55, 40, 25],
			inches: [22, 16, 10]
		}
	},
	{
		id: 'vueling',
		airline: 'Vueling',
		region: 'Europe',
		link: 'https://www.vueling.com/en/vueling-services/prepare-your-trip/luggage',
		kilograms: 10,
		test: {
			matchText: ['10 kg (55x40x20 cm.)']
		},
		carryOn: {
			centimeters: [55, 40, 20]
		}
	},
	{
		id: 'air-baltic',
		airline: 'Air Baltic',
		region: 'Europe',
		link: 'https://www.airbaltic.com/en/baggage/cabin-baggage',
		kilograms: 8,
		test: {
			matchText: ['cabin bag (55 x 40 x 23 cm)']
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'air-canada',
		airline: 'Air Canada',
		region: 'North America',
		link: 'https://www.aircanada.com/us/en/aco/home/plan/baggage/carry-on.html#/',
		test: {
			matchText: [
				'measures 55 cm (21.5 in) in height, 23 cm (9 in) in depth, and 40 cm (15.5 in) in width'
			]
		},
		carryOn: {
			centimeters: [55, 40, 23],
			inches: [21.5, 15.5, 9]
		}
	},
	{
		id: 'air-new-zealand',
		airline: 'Air New Zealand',
		region: 'Oceania',
		link: 'https://www.airnewzealand.com/carry-on-baggage',
		pounds: 15,
		kilograms: 7,
		test: {
			matchText: ['The total can be up to 118cm (46.5 inches)']
		},
		carryOn: {
			centimeters: 118
		}
	},
	{
		id: 'air-serbia',
		airline: 'Air Serbia',
		region: 'Europe',
		link: 'https://www.airserbia.com/en/information/baggage/hand-luggage/hand-luggage-weight',
		kilograms: 8,
		test: {
			matchText: ['40 x 23 x 55 cm']
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'austrian-airlines',
		airline: 'Austrian Airlines',
		region: 'Europe',
		link: 'https://www.austrian.com/gb/en/carry-on-baggage',
		kilograms: 8,
		test: {
			matchText: ['max. 55 x 40 x 23 cm']
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'azerbaijan-airlines',
		airline: 'Azerbaijan Airlines',
		region: 'Asia',
		link: 'https://www.azal.az/en/information/baggage/hand/',
		kilograms: 10,
		test: {
			matchText: [
				'up to 10 kg (one piece) and the size of in three dimension must not exceeds 118 cm (55 * 40 * 23 cm)'
			]
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'brussels-airlines',
		airline: 'Brussels Airlines',
		region: 'Europe',
		link: 'https://www.brusselsairlines.com/be/en/extra-services/baggage/carry-on-baggage',
		kilograms: 8,
		test: {
			matchText: ['max. 55 x 40 x 23 cm']
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'bulgaria-air',
		airline: 'Bulgaria Air',
		region: 'Europe',
		link: 'https://www.air.bg/en/customer-support/your-baggage',
		kilograms: 10,
		test: {
			matchText: ['hand bag up to 10 kg and sizes 55х40х23 cm total length up to 118 cm)']
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'edelweiss',
		airline: 'Edelweiss',
		region: 'Europe',
		link: 'https://www.flyedelweiss.com/EN/prepare/baggage/free-baggage/Pages/hand-baggage.aspx',
		kilograms: 8,
		test: {
			matchText: ['55 x 40 x 23 cm']
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'egypt-air',
		airline: 'Egypt Air',
		region: 'Africa',
		link: 'https://www.egyptair.com/en/fly/baggage/Pages/baggage-allowance.aspx',
		kilograms: 8,
		test: {
			matchText: ['Maximum dimensions 118 Cm ( 55 + 40 + 23 )']
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'ethiopian-airlines',
		airline: 'Ethiopian Airlines',
		region: 'Africa',
		link: 'https://www.ethiopianairlines.com/aa/information/baggage-information/carry-on-baggage',
		kilograms: 7,
		test: {
			matchText: [
				'hand luggage with a maximum weight of 7 kg and a maximum  dimensions equal to 23 x 40 x 55 (cm)'
			]
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'fiji-airways',
		airline: 'Fiji Airways',
		region: 'Oceania',
		link: 'https://www.fijiairways.com/manage/baggage-allowances',
		pounds: 15,
		kilograms: 7,
		test: {
			matchText: ['Total dimensions* of 1 piece should not exceed 118cm (46in) for economy class']
		},
		carryOn: {
			centimeters: 118,
			inches: 46
		}
	},
	{
		id: 'lufthansa',
		airline: 'Lufthansa',
		region: 'Europe',
		link: 'https://www.lufthansa.com/us/en/carry-on-baggage',
		kilograms: 8,
		test: {
			matchText: ['max. 55 x 40 x 23 cm']
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'luxair',
		airline: 'Luxair',
		region: 'Europe',
		link: 'https://www.luxair.lu/en/information/hand-luggage',
		kilograms: 8,
		test: {
			matchText: ['55x40x23 cm']
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'norwegian',
		airline: 'Norwegian',
		region: 'Europe',
		link: 'https://www.norwegian.com/en/travel-info/baggage/hand-baggage/',
		kilograms: 10,
		test: {
			matchText: ['(55x40x23cm)']
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'olympic-air',
		airline: 'Olympic Air',
		region: 'Europe',
		link: 'https://www.olympicair.com/travel-information/travelling-with-olympic-air/baggage/hand-luggage-and-essentials/',
		kilograms: 8,
		test: {
			matchText: [
				'carry-on bag that must, not exceed 55cmX40cmX23cm in dimension (including handles, pockets and wheels) and 8kg in weight and fit in the overhead bin'
			]
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 's7-airlines',
		airline: 'S7 Airlines',
		region: 'Russia',
		link: 'https://www.s7.ru/ru/info/norma-provoza-bagazha/#luggage',
		kilograms: 10,
		test: {
			matchText: ['для ручной клади габариты не более 55×40×23 см']
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'sas-scandinavian-airlines',
		airline: 'SAS Scandinavian Airlines',
		region: 'Europe',
		link: 'https://www.flysas.com/us-en/travel-info/baggage/carry-on/',
		kilograms: 8,
		test: {
			matchText: ['Maximum size: 55 cm x 40 cm x 23 cm (length x width x depth)']
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'sunexpress',
		airline: 'SunExpress',
		region: 'Asia',
		link: 'https://www.sunexpress.com/en-gb/information/luggage-info/cabin-baggage/',
		kilograms: 8,
		test: {
			matchText: ['The dimensions may not exceed 55 x 40 x 23 cm.']
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'swiss-international-air-lines',
		airline: 'Swiss International Air Lines',
		region: 'Europe',
		link: 'https://www.swiss.com/de/en/prepare/baggage/hand-baggage',
		kilograms: 8,
		test: {
			matchText: ['Max. dimensions 55 x 40 x 23 cm']
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'turkish-airlines',
		airline: 'Turkish Airlines',
		region: 'Asia',
		link: 'https://www.turkishairlines.com/en-us/any-questions/carry-on-baggage/index.html',
		kilograms: 8,
		test: {
			matchText: ['maximum dimensions of 23x40x55 cm and a maximum weight of 8 kg']
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'aer-lingus',
		airline: 'Aer Lingus',
		region: 'Europe',
		link: 'https://www.aerlingus.com/travel-information/baggage-information/cabin-baggage/',
		pounds: 22,
		kilograms: 10,
		test: {
			matchText: ['55cm', '(21.5")', '40cm', '(15.5")', '24cm', '(9.5")']
		},
		carryOn: {
			centimeters: [55, 40, 24],
			inches: [21.5, 15.5, 9.5]
		}
	},
	{
		id: 'aeroflot',
		airline: 'Aeroflot',
		region: 'Russia',
		link: 'https://www.aeroflot.ru/ru-en/information/preparation/luggage#baggage_tab2',
		kilograms: 10,
		test: {
			matchText: ['L=55 cm, W=40 cm, H=25 cm']
		},
		carryOn: {
			centimeters: [55, 40, 25]
		}
	},
	{
		id: 'aeromexico',
		airline: 'Aeroméxico',
		region: 'Latin America',
		link: 'https://aeromexico.com/en-us/travel-information/baggage/carry-on-baggage',
		pounds: 22,
		kilograms: 10,
		test: {
			matchText: ['not exceeding 55 cm x 40 cm x 25 cm. (21.5 x 15.7 x 10 inches).']
		},
		carryOn: {
			centimeters: [55, 40, 25],
			inches: [21.5, 15.7, 10]
		}
	},
	{
		id: 'ana',
		airline: 'ANA',
		region: 'Asia',
		link: 'https://www.ana.co.jp/en/us/travel-information/baggage-information/carry-on/',
		pounds: 22,
		kilograms: 10,
		test: {
			matchText: [
				'Total linear dimensions (length, width, height) of no more than 115 cm\nwith a length of each side not exceeding\n55 cm x 40 cm x 25 cm'
			]
		},
		carryOn: {
			centimeters: [55, 40, 25],
			inches: [22, 16, 10]
		}
	},
	{
		id: 'belavia',
		airline: 'Belavia',
		region: 'Europe',
		link: 'https://en.belavia.by/baggage/unchecked_baggage/',
		kilograms: 10,
		test: {
			matchText: ['Must not exceed the size of 55x40x25 cm']
		},
		carryOn: {
			centimeters: [55, 40, 25]
		}
	},
	{
		id: 'bh-air',
		airline: 'BH Air',
		region: 'Europe',
		link: 'http://www.bhairlines.com/page.php?id=38',
		kilograms: 7,
		carryOn: {
			centimeters: [60, 40, 30]
		}
	},
	{
		id: 'volaris',
		airline: 'Volaris',
		region: 'South America',
		link: 'https://cms.volaris.com/en/travel-info/baggage-policy/',
		pounds: 33,
		test: {
			matchText: ['1 carry-on bag that measures 22 x 16 x 10 in (length x width x height)']
		},
		carryOn: {
			inches: [22, 16, 10]
		}
	},
	{
		id: 'czech-airlines',
		airline: 'Czech Airlines',
		region: 'Europe',
		link: 'https://www.smartwings.com/en/what-is-the-baggage-allowance',
		kilograms: 8,
		test: {
			matchText: ['with max. dimensions of 55x40x23 cm and weight of up to 8 kg']
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'wingo',
		airline: 'Wingo',
		region: 'South America',
		link: 'https://www.wingo.com/centro-de-ayuda/equipaje/equipaje-de-mano-adicional',
		kilograms: 12,
		test: {
			matchText: ['55x45x25cm']
		},
		carryOn: {
			centimeters: [55, 45, 25]
		}
	},
	{
		id: 'air-asia',
		airline: 'Air Asia',
		region: 'Asia-Pacific',
		link: 'https://support.airasia.com/s/article/What-are-the-rules-for-cabin-baggage-on-board?language=en_GB',
		kilograms: 7,
		test: {
			matchText: ['must not exceed 56cm x 36cm x 23cm']
		},
		carryOn: {
			centimeters: [56, 36, 23]
		}
	},
	{
		id: 'alaska-airlines',
		airline: 'Alaska Airlines',
		region: 'North America',
		link: 'https://www.alaskaair.com/content/travel-info/baggage/carry-on-luggage',
		test: {
			matchText: [
				'maximum dimension 22" x 14" x 9" or 45 linear inches, including wheels and handle'
			]
		},
		carryOn: {
			inches: [22, 14, 9]
		}
	},
	{
		id: 'allegiant-air',
		airline: 'Allegiant Air',
		region: 'North America',
		link: 'https://www.allegiantair.com/baggage-1',
		test: {
			comment: "Can't access the website for automated testing, got size limits from Google preview"
		},
		carryOn: {
			centimeters: [55, 40, 25],
			inches: [22, 16, 10]
		}
	},
	{
		id: 'american-airlines',
		airline: 'American Airlines',
		region: 'North America',
		link: 'https://www.aa.com/i18n/travel-info/baggage/carry-on-baggage.jsp',
		test: {
			matchText: [
				'The total size of your carry-on, including the handles and wheels, cannot exceed 22 x 14 x 9 inches'
			]
		},
		carryOn: {
			centimeters: [55, 36, 23],
			inches: [22, 14, 9]
		}
	},
	{
		id: 'bahamasair',
		airline: 'Bahamasair',
		region: 'North America',
		link: 'https://bahamasair.com/baggage-information/baggage-rates-baggage-claim-form-pdf',
		pounds: 20,
		kilograms: 9,
		test: {
			matchText: ['Maximum size: 22″ x 14″ x 9″ & 20 lbs (9.07 kg) FREE']
		},
		carryOn: {
			centimeters: [56, 36, 23],
			inches: [22, 14, 9]
		}
	},
	{
		id: 'bangkok-airways',
		airline: 'Bangkok Airways',
		region: 'Asia',
		link: 'https://www.bangkokair.com/baggage-allowance',
		kilograms: 7,
		test: {
			matchText: ['50 x 36 x 23 centimeter']
		},
		carryOn: {
			centimeters: [50, 36, 23]
		}
	},
	{
		id: 'cambodia-angkor-air',
		airline: 'Cambodia Angkor Air',
		region: 'Asia',
		link: 'https://www.aircambodia.com/en/baggage',
		pounds: 15,
		kilograms: 7,
		test: {
			matchText: [
				/Hand baggage.*115 cm \(56cm x 36cm x 23cm\) or- 45 inch \(22’’x 11’’x 9’’\)/gm,
				"Lady hand bag or book, magazine, camera, children\'s food kit, duty-free bag, etc... with dimensions not to exceed (H x W x D) 30cm × 20cm × 10 cm / 12’’ x 7,9” x 3,9”"
			]
		},
		carryOn: {
			centimeters: [56, 36, 23],
			inches: [22, 11, 9]
		},
		personalItem: {
			centimeters: [30, 20, 10],
			inches: [12, 7.9, 3.9]
		}
	},
	{
		id: 'caribbean-airlines',
		airline: 'Caribbean Airlines',
		region: 'Latin America',
		link: 'https://www.caribbean-airlines.com/#/baggage/carry-on',
		pounds: 22,
		kilograms: 10,
		test: {
			matchText: ['Max. Size -: L 22”x W 14” x H 9” (56cm x 35cm x 23cm)']
		},
		carryOn: {
			centimeters: [56, 35, 23],
			inches: [22, 14, 9]
		}
	},
	{
		id: 'cathay-pacific',
		airline: 'Cathay Pacific',
		region: 'Asia',
		link: 'https://www.cathaypacific.com/cx/en_US/baggage.html',
		pounds: 15,
		kilograms: 7,
		test: {
			comment:
				'Carry-on bag is not statically available on the website, got size limits from another source'
		},
		carryOn: {
			centimeters: [56, 36, 23],
			inches: [22, 14, 9]
		}
	},
	{
		id: 'cebu-pacific',
		airline: 'Cebu Pacific',
		region: 'Asia',
		link: 'https://www.cebupacificair.com/en-PH/pages/travel-info/baggage-information/carry-on-baggage',
		kilograms: 7,
		test: {
			comment: 'Blocked by website'
		},
		carryOn: {
			centimeters: [56, 36, 23]
		}
	},
	{
		id: 'china-airlines',
		airline: 'China Airlines',
		region: 'Asia',
		link: 'https://www.china-airlines.com/us/en/fly/prepare-for-the-fly/baggage/carry-on-baggage',
		pounds: 15,
		kilograms: 7,
		test: {
			matchText: ['56x36x23 CM (22x14x9 IN)']
		},
		carryOn: {
			centimeters: [56, 36, 23],
			inches: [22, 14, 9]
		}
	},
	{
		id: 'delta-air-lines',
		airline: 'Delta Air Lines',
		region: 'North America',
		link: 'https://www.delta.com/us/en/baggage/carry-on-baggage#baggageFees.html',
		test: {
			matchText: ['measurements may not exceed 22” x 14” x 9” (56 cm x 35 cm x 23 cm)']
		},
		carryOn: {
			centimeters: [56, 35, 23],
			inches: [22, 14, 9]
		}
	},
	{
		id: 'garuda-indonesia',
		airline: 'Garuda Indonesia',
		region: 'Asia',
		link: 'https://www.garuda-indonesia.com/id/en/garuda-indonesia-experience/baggage-info',
		kilograms: 7,
		test: {
			comment: 'Elements are not loaded, should involve interactive testing'
		},
		carryOn: {
			centimeters: [56, 36, 23]
		}
	},
	{
		id: 'hawaiian-airlines',
		airline: 'Hawaiian Airlines',
		region: 'North America',
		link: 'https://hawaiianair.custhelp.com/app/answers/detail/a_id/2815/~/carry-on-bag-allowance',
		pounds: 25,
		kilograms: 11,
		test: {
			matchText: ['22 inches x 14 inches x 9 inches']
		},
		carryOn: {
			inches: [22, 14, 9]
		}
	},
	{
		id: 'hk-express',
		airline: 'HK Express',
		region: 'Asia',
		link: 'https://www.hkexpress.com/en/Plan/Extras/Baggage/Carry-On-Baggage',
		kilograms: 7,
		test: {
			matchText: ['Cannot exceed 56 (L) x 36 (W) x 23 (H) cm (22” x 14” x 9”)']
		},
		carryOn: {
			centimeters: [56, 36, 23],
			inches: [22, 14, 9]
		}
	},
	{
		id: 'hong-kong-airlines',
		airline: 'Hong Kong Airlines',
		region: 'Asia',
		link: 'http://www.hkairlines.com/en_HK/fly-with-us/baggage/handcarry',
		pounds: 15,
		kilograms: 7,
		test: {
			matchText: [
				'piece of cabin baggage, which must not exceed 45 inches ( 22" x 14" x 9" or 56cm x 36cm x 23cm) in size and 7kg/15Ibs in weight.'
			]
		},
		carryOn: {
			centimeters: [56, 36, 23],
			inches: [22, 14, 9]
		}
	},
	{
		id: 'japan-airlines',
		airline: 'Japan Airlines',
		region: 'Asia',
		link: 'https://www.jal.co.jp/jp/en/inter/baggage/inflight/#anchorlink001',
		pounds: 22,
		kilograms: 10,
		test: {
			matchText: ['W: within 55cm×H: within 40cm×D: within 25cm']
		},
		carryOn: {
			centimeters: [56, 40, 25],
			inches: [22, 16, 10]
		}
	},
	{
		id: 'jetblue-airways',
		airline: 'JetBlue Airways',
		region: 'North America',
		link: 'https://www.jetblue.com/help/carry-on-bags',
		test: {
			matchText: [
				'carry-on bags must not exceed 22" L (55.88 cm) x 14" W (35.56 cm) x 9" H (22.86 cm).'
			]
		},
		carryOn: {
			centimeters: [57, 35.5, 23],
			inches: [22, 14, 9]
		}
	},
	{
		id: 'jetstar',
		airline: 'Jetstar',
		region: 'Oceania',
		link: 'https://www.jetstar.com/au/en/help/articles/carry-on-baggage-what-can-i-bring-on-board',
		kilograms: 7,
		test: {
			matchText: [
				'not exceed 56cm (height) x 36cm (width) x 23cm (depth) including wheels and handles.'
			]
		},
		carryOn: {
			centimeters: [56, 36, 23]
		}
	},
	{
		id: 'lao-airlines',
		airline: 'Lao Airlines',
		region: 'Asia',
		link: 'https://laoairlines.com/en/baggage-optional-service-charges/',
		kilograms: 7,
		test: {
			matchText: [
				'maximum weight of 7kg and the sum of the three dimensions shall not exceed 115 cm (30 cm x 60 cm x 18 cm) or (12 x 24 x 7 inches)'
			]
		},
		carryOn: {
			centimeters: [60, 30, 18],
			inches: [24, 12, 7]
		}
	},
	{
		id: 'mango-airlines',
		airline: 'Mango Airlines',
		region: 'South Africa',
		kilograms: 7,
		test: {
			comment:
				'Carry-on bag limits are not statically available on the website, got size limits from another source'
		},
		carryOn: {
			centimeters: [56, 36, 23]
		}
	},
	{
		id: 'nokair',
		airline: 'NokAir',
		region: 'Asia',
		link: 'https://content.nokair.com/en/Journey-Planning/Baggage/Hand-Baggage-allowance.aspx',
		kilograms: 7,
		test: {
			matchText: [
				'not exceed the dimensions of 56cm X 36cm X 23cm and provided that it does not weigh more than 7kg'
			]
		},
		carryOn: {
			centimeters: [56, 36, 23]
		}
	},
	{
		id: 'oman-air',
		airline: 'Oman Air',
		region: 'Africa',
		link: 'https://www.omanair.com/en/baggage-policy/baggage-allowance',
		kilograms: 7,
		test: {
			matchText: ['Hand baggage per guest of 7kg and a maximum dimension of linear 115 cm (45 in).']
		},
		carryOn: {
			centimeters: 115,
			inches: 45
		}
	},
	{
		id: 'peach',
		airline: 'Peach',
		region: 'Asia',
		link: 'http://www.flypeach.com/en/lm/ai/airports/baggage/carry_on_bag',
		kilograms: 7,
		test: {
			matchText: ['Sum of the three dimensions should be less than 115 cm']
		},
		carryOn: {
			centimeters: 115
		}
	},
	{
		id: 'philippines-airlines',
		airline: 'Philippines Airlines',
		region: 'Asia',
		link: 'https://www.philippineairlines.com/ph/en/before-you-fly/baggage-information/baggage-allowance/baggage-allowance-fees/carry-on-baggage.html',
		pounds: 15,
		kilograms: 7,
		test: {
			matchText: [
				'maximum total dimension of 56cm x 36cm x 23cm (22in x 14in x 9in) and maximum weight of 7 kgs. (15 lbs).'
			]
		},
		carryOn: {
			centimeters: [56, 36, 23],
			inches: [22, 14, 9]
		}
	},
	{
		id: 'porter-airlines',
		airline: 'Porter Airlines',
		region: 'North America',
		link: 'https://www.flyporter.com/en/travel-information/baggage/carry-on-allowance',
		test: {
			matchText: ['55 x 40 x 23 cm (21.5 x 15.5 x 9 in)']
		},
		carryOn: {
			centimeters: [55, 40, 23],
			inches: [21.5, 15.5, 9]
		}
	},
	{
		id: 'qantas',
		airline: 'Qantas',
		region: 'Oceania',
		link: 'https://www.qantas.com/au/en/travel-info/baggage/carry-on-baggage.html#carry-on-baggage-allowances',
		kilograms: 7,
		test: {
			matchText: ['Bag size: 56cm long x 36cm wide x 23cm deep']
		},
		carryOn: {
			centimeters: [56, 36, 23]
		}
	},
	{
		id: 'royal-air-maroc',
		airline: 'Royal Air Maroc',
		region: 'Africa',
		link: 'https://www.royalairmaroc.com/int-en/carry-on-baggage',
		kilograms: 10,
		test: {
			matchText: [
				'Length + width + height which does not exceed 115 cm (length: 55cm, width: 40cm, height: 20cm)'
			]
		},
		carryOn: {
			centimeters: [55, 40, 20]
		}
	},
	{
		id: 'royal-jordanian-airlines',
		airline: 'Royal Jordanian Airlines',
		region: 'Asia',
		link: 'https://www.rj.com/en/info-and-tips/baggage-information/carry-on-pieces',
		kilograms: 7,
		test: {
			matchText: ['maximum dimensions of (9X16X20in) or (23X41X51cm) however']
		},
		carryOn: {
			centimeters: [51, 41, 23],
			inches: [20, 16, 9]
		}
	},
	{
		id: 'saudia-airlines',
		airline: 'Saudia Airlines',
		region: 'Asia',
		link: 'https://www.saudia.com/before-flying/baggage/hand-baggage',
		kilograms: 7,
		test: {
			matchText: [
				'Hand bag (the size of the piece not to exceed 56 X 45 X 25 (Cm) (22 X 18 X 10) (In))'
			]
		},
		carryOn: {
			centimeters: [56, 45, 25],
			inches: [22, 18, 10]
		}
	},
	{
		id: 'scoot-airlines',
		airline: 'Scoot Airlines',
		region: 'Asia',
		link: 'https://www.flyscoot.com/en/plan/booking-your-flight/baggage',
		kilograms: 10,
		test: {
			matchText: [
				'must fit within the dimensions of 54cm x 38cm x 23cm (total linear dimensions cannot exceed 115cm) to fit in the overhead compartment in the aircraft'
			],
			comment: 'Can block requests during testing'
		},
		carryOn: {
			centimeters: [54, 38, 23]
		}
	},
	{
		id: 'singapore-airlines',
		airline: 'Singapore Airlines',
		region: 'Asia',
		link: 'https://www.singaporeair.com/en_UK/us/travel-info/baggage/cabin-baggage/',
		kilograms: 7,
		test: {
			matchText: ['Sum of length, width and height of each piece should not exceed 115cm.']
		},
		carryOn: {
			centimeters: 115
		}
	},
	{
		id: 'south-african-airways',
		airline: 'South African Airways',
		region: 'Africa',
		link: 'https://www.flysaa.com/manage-fly/baggage/hand-baggage',
		kilograms: 8,
		test: {
			matchText: ['56cm (l) 36cm (w) 23cm (h)']
		},
		carryOn: {
			centimeters: [56, 36, 23]
		}
	},
	{
		id: 'sri-lankan-airlines',
		airline: 'Sri Lankan Airlines',
		region: 'Asia',
		link: 'https://www.srilankan.com/en_uk/plan-and-book/luggage',
		kilograms: 7,
		test: {
			matchText: [
				'Each piece of hand baggage must weigh no more than 7 kg and measure no more than a total of 115cm (l+h+w)'
			]
		},
		carryOn: {
			centimeters: 115
		}
	},
	{
		id: 'united-airlines',
		airline: 'United Airlines',
		region: 'North America',
		link: 'https://www.united.com/ual/en/us/fly/travel/baggage/carry-on.html',
		test: {
			matchText: ['it must be 9 in x 14 in x 22 in (23 cm x 35 cm x 56 cm)']
		},
		carryOn: {
			centimeters: [56, 35, 23],
			inches: [22, 14, 9]
		}
	},
	{
		id: 'vietnam-airlines',
		airline: 'Vietnam Airlines',
		region: 'Asia',
		link: 'https://www.vietnamairlines.com/vn/en/travel-information/baggage/baggage-allowance-hand-baggage',
		kilograms: 10,
		test: {
			matchText: ['piece of baggage: 56cm x 36cm x 23cm']
		},
		carryOn: {
			centimeters: [56, 36, 23]
		}
	},
	{
		id: 'virgin-atlantic-airways',
		airline: 'Virgin Atlantic Airways',
		region: 'Europe',
		link: 'https://help.virginatlantic.com/gb/en/baggage/hand-baggage.html',
		pounds: 22,
		kilograms: 10,
		test: {
			matchText: ["maximum of 23 x 36 x 56cm (that's around 9 x 14 x 22 inches)."]
		},
		carryOn: {
			centimeters: [56, 36, 23],
			inches: [22, 14, 9]
		}
	},
	{
		id: 'xiamen-airlines',
		airline: 'Xiamen Airlines',
		region: 'Asia',
		link: 'https://www.xiamenair.com/en-ww/article-detail?articleLink=%2Fcms-i18n-ow%2Fcms-en-ww%2Fchannels%2F11310.json',
		pounds: 11,
		kilograms: 5,
		test: {
			matchText: ['No more than 115 cm (45 inches)']
		},
		carryOn: {
			centimeters: 115,
			inches: 45
		}
	},
	{
		id: 'copa-airlines',
		airline: 'Copa Airlines',
		region: 'Latin America',
		link: 'https://www.copaair.com/en/web/gs/carry-on-luggage',
		pounds: 22,
		kilograms: 10,
		test: {
			matchText: [
				"up to 46 linear inches (118 cm): 22'' high x 14'' long x 10'' wide (56 cm high x 36 cm long x 26 cm wide)"
			]
		},
		carryOn: {
			centimeters: [56, 36, 26],
			inches: [22, 14, 10]
		}
	},
	{
		id: 'aegean-airlines',
		airline: 'Aegean Airlines',
		region: 'Europe',
		link: 'https://en.aegeanair.com/travel-information/baggage/cabin-baggage/',
		kilograms: 8,
		test: {
			matchText: ['carry-on bag up to 8kg and dimensions up to 56cm X 45cm X 25cm']
		},
		carryOn: {
			centimeters: [56, 45, 25]
		}
	},
	{
		id: 'air-astana',
		airline: 'Air Astana',
		region: 'Central Asia',
		link: 'https://airastana.com/global-en/information/carry-on-baggage',
		kilograms: 8,
		test: {
			matchText: ['must be no larger than 56 x 45 x 25cm, with a maximum weight of 8kg'],
			comment: 'Can block requests during testing'
		},
		carryOn: {
			centimeters: [56, 45, 25]
		}
	},
	{
		id: 'british-airways',
		airline: 'British Airways',
		region: 'Europe',
		link: 'https://www.britishairways.com/en-gb/information/baggage-essentials',
		pounds: 51,
		kilograms: 23,
		test: {
			matchText: ['Up to 56 x 45 x 25cm (22 x 18 x 10in) - includes wheels and handles']
		},
		carryOn: {
			centimeters: [56, 45, 25],
			inches: [22, 18, 10]
		}
	},
	{
		id: 'easyjet',
		airline: 'easyJet',
		region: 'Europe',
		link: 'https://www.easyjet.com/en/help/baggage/cabin-bag-and-hold-luggage',
		kilograms: 15,
		test: {
			matchText: [
				'Maximum size 56 x 45 x 25 cm (including any handles or wheels)',
				'Maximum size 45 x 36 x 20cm (including any handles or wheels)'
			]
		},
		personalItem: {
			centimeters: [45, 36, 20]
		},
		carryOn: {
			centimeters: [56, 45, 25]
		}
	},
	{
		id: 'el-al',
		airline: 'El Al',
		region: 'Asia',
		link: 'https://www.elal.com/en/PassengersInfo/Baggage/Hand-Baggage/Pages/Policy.aspx',
		kilograms: 8,
		test: {
			matchText: [
				'up to 56 cm (length), 45 cm (width), and 25 cm (depth), not exceeding a total dimension of 115 cm'
			]
		},
		carryOn: {
			centimeters: [56, 45, 25]
		}
	},
	{
		id: 'iberia',
		airline: 'Iberia',
		region: 'Europe',
		link: 'https://www.iberia.com/us/luggage/hand-luggage/',
		kilograms: 10,
		test: {
			matchText: ['cabin bag\n56x40x25cm/10kg']
		},
		carryOn: {
			centimeters: [56, 40, 25]
		}
	},
	{
		id: 'jet2com',
		airline: 'Jet2.com',
		region: 'Europe',
		link: 'https://www.jet2.com/faqs?topic=baggage-and-sports-equipment&category=hand-luggage-allowances',
		kilograms: 10,
		test: {
			matchText: ['Hand luggage must be no more than 10kg and no larger than 56cm x 45cm x 25cm.']
		},
		carryOn: {
			centimeters: [56, 45, 25]
		}
	},
	{
		id: 'smartwings',
		airline: 'SmartWings',
		region: 'Europe',
		link: 'https://www.smartwings.com/en/what-is-the-baggage-allowance',
		kilograms: 8,
		test: {
			matchText: ['with max. dimensions of 55x40x23 cm and weight of up to 8 kg']
		},
		carryOn: {
			centimeters: [55, 40, 23]
		}
	},
	{
		id: 'thai-airways',
		airline: 'Thai Airways',
		region: 'Asia',
		link: 'https://www.thaiairways.com/en/travel_information/baggage.page',
		pounds: 15,
		kilograms: 7,
		test: {
			matchText: [
				'carry one baggage at maximum length 56 cm (22 inches), width 45 cm (18 inches) and thickness 25 cm (10 inches)'
			],
			comment: 'Can block requests during testing'
		},
		carryOn: {
			centimeters: [56, 45, 25],
			inches: [22, 18, 10]
		}
	},
	{
		id: 'kuwait-airways',
		airline: 'Kuwait Airways',
		region: 'Asia',
		link: 'https://www.kuwaitairways.com/en/is/free-carry-on-baggage',
		kilograms: 7,
		test: {
			matchText: ['56 X 46 X 25 cm']
		},
		carryOn: {
			centimeters: [56, 46, 25],
			inches: [22, 18, 10]
		}
	},
	{
		id: 'malaysia-airlines',
		airline: 'Malaysia Airlines',
		region: 'Asia',
		link: 'https://www.malaysiaairlines.com/ph/en/travel-info/baggage/cabin-baggage.html',
		pounds: 15,
		kilograms: 7,
		test: {
			matchText: ['56cm\n(22in)\n\n36cm\n(14in)\n\n23cm\n(09in)\n\n115cm\n(45in)']
		},
		carryOn: {
			centimeters: [56, 36, 23],
			inches: [22, 14, 9]
		}
	},
	{
		id: 'norse-atlantic-airways',
		airline: 'Norse Atlantic Airways',
		region: 'Europe',
		link: 'https://flynorse.com/support/optional-fees',
		pounds: 22,
		kilograms: 10,
		test: {
			matchText: ['Carry-on, Economy cabin  (10kg / 22lbs) 56 x 45 x 25 cm (22 x 18 x 10 in)']
		},
		carryOn: {
			centimeters: [56, 45, 25],
			inches: [22, 18, 10]
		}
	},
	{
		id: 'spirit-airlines',
		airline: 'Spirit Airlines',
		region: 'North America',
		link: 'https://customersupport.spirit.com/en-us/category/article/KA-01535',
		test: {
			matchText: ['Maximum of 22 x 18  x 10  inches (56 x 46 x 25 cm)']
		},
		carryOn: {
			centimeters: [56, 46, 25],
			inches: [22, 18, 10]
		}
	},
	{
		id: 'frontier-airlines',
		airline: 'Frontier Airlines',
		region: 'North America',
		link: 'https://www.flyfrontier.com/travel/travel-info/bag-options/#Carry-on',
		pounds: 35,
		test: {
			matchText: ['Size: 24"H X 16"W X 10"D']
		},
		carryOn: {
			inches: [24, 16, 10]
		}
	},
	{
		id: 'cayman-airways',
		airline: 'Cayman Airways',
		region: 'North America',
		link: 'https://www.caymanairways.com/baggage-policy',
		test: {
			matchText: ['51 inches (11” x 16” x 24”)']
		},
		carryOn: {
			inches: [24, 16, 11]
		}
	},
	{
		id: 'southwest-airlines',
		airline: 'Southwest Airlines',
		region: 'North America',
		link: 'https://www.southwest.com/help/baggage/carryon-baggage',
		test: {
			matchText: ['Size limits: 24” (L) + 16” (W) + 10” (H)']
		},
		carryOn: {
			inches: [24, 16, 10]
		}
	},
	{
		id: 'sun-country-airlines',
		airline: 'Sun Country Airlines',
		region: 'North America',
		link: 'https://suncountry.com/bags-optional-services',
		pounds: 35,
		test: {
			matchText: [
				'must fit within current overhead size restrictions and may not exceed any of the following dimensions: 24” long x 16” wide x 11” tall'
			]
		},
		carryOn: {
			inches: [24, 16, 11]
		}
	},
	{
		id: 'pobeda',
		airline: 'Pobeda',
		region: 'Russia',
		link: 'https://www.flypobeda.ru/information/luggage_baggage',
		kilograms: 10,
		test: {
			matchText: ['36x30x27 см']
		},
		carryOn: {
			centimeters: [36, 30, 27]
		}
	},
	{
		id: 'zipair',
		airline: 'ZIPAIR',
		region: 'Asia',
		link: 'https://www.zipair.net/en/service/baggage',
		kilograms: 7,
		test: {
			matchText: [
				'(1st piece: 55 cm x 40 cm x 25 cm, 2nd piece: 35 cm x 45 cm x 25 cm). The total weight of all carry-on baggage must not exceed 7 kg.'
			]
		},
		carryOn: {
			centimeters: [55, 40, 25]
		}
	},
	{
		id: 'air-peace',
		airline: 'Air Peace',
		region: 'Africa',
		link: 'https://flyairpeace.com/terms-and-conditions/',
		carryOn: {
			centimeters: [45, 33, 20]
		},
		kilograms: 10,
		test: {
			matchText: ['size not exceeding 45x33x20 cm']
		}
	}
];
