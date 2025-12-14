import type { Region } from '$lib/types';

export interface AirlineAllowance {
	id: string;
	airline: string;
	region: Region;
	/**
	 * The link to the airline's cabin baggage policy page.
	 */
	link: string;
	/**
	 * The carry-on bag allowance.
	 * Sizes and weights are provided as is on the website, without any conversion.
	 * Size can be a 3-element array of numbers for length, width, and height in centimeters or inches, or a single number for total sum of dimensions.
	 */
	carryOn: {
		dimensions?: {
			centimeters?: number | [number, number, number];
			inches?: number | [number, number, number];
		};
		weight?: {
			kilograms?: number;
			pounds?: number;
		};
		/**
		 * If true, the carry-on bag may be charged extra (e.g. only on more expensive plans).
		 */
		isExtra?: boolean;
	};
	/**
	 * The personal item allowance (e.g. small handbag or laptop bag). Sizes may be missing.
	 * Sizes and weights are provided as is on the website, without any conversion.
	 * Size can be a 3-element array of numbers for length, width, and height in centimeters or inches, or a single number for total sum of dimensions.
	 */
	personalItem?: {
		dimensions?: {
			centimeters?: number | [number, number, number];
			inches?: number | [number, number, number];
		};
		weight?: {
			kilograms?: number;
			pounds?: number;
		};
	};
	/**
	 * Combined weight limit for carry-on and personal item together in case of restrictions for total weight of both bags.
	 */
	totalWeight?: {
		kilograms?: number;
		pounds?: number;
	};
}

export const allowances: AirlineAllowance[] = [
	{
		id: 'finnair',
		airline: 'Finnair',
		region: 'Europe',
		link: 'https://www.finnair.com/en/baggage-on-finnair-flights/carry-on-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23],
				inches: [21.7, 15.7, 9.1]
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 15],
				inches: [15.7, 11.8, 5.9]
			}
		},
		totalWeight: {
			kilograms: 8,
			pounds: 17.6
		}
	},
	{
		id: 'thai-lion-air',
		airline: 'Thai Lion Air',
		region: 'Asia',
		link: 'https://www.lionairthai.com/en/ThaiLionAir-Experience/Baggage-Allowance',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'wizz-air',
		airline: 'Wizz Air',
		region: 'Europe',
		link: 'https://wizzair.com/en-gb/help-centre/booking-information-and-services/baggage/baggage-allowance/cabin-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 10
			},
			isExtra: true
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 20]
			},
			weight: {
				kilograms: 10
			}
		}
	},
	{
		id: 'loganair',
		airline: 'Loganair',
		region: 'Europe',
		link: 'https://www.loganair.co.uk/get-ready-to-fly/luggage-guidance/',
		carryOn: {
			dimensions: {
				centimeters: [40, 35, 18]
			}
		},
		totalWeight: {
			kilograms: 6
		}
	},
	{
		id: 'aer-lingus',
		airline: 'Aer Lingus',
		region: 'Europe',
		link: 'https://www.aerlingus.com/travel-information/baggage-information/cabin-baggage/',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 24],
				inches: [21.5, 15.5, 9.5]
			},
			weight: {
				kilograms: 10,
				pounds: 22
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 20],
				inches: [15.5, 11.5, 8]
			}
		}
	},
	{
		id: 'aer-lingus-regional',
		airline: 'Aer Lingus Regional',
		region: 'Europe',
		link: 'https://www.aerlingus.com/travel-information/baggage-information/cabin-baggage/',
		carryOn: {
			dimensions: {
				centimeters: [48, 33, 20],
				inches: [18.5, 13, 8]
			},
			weight: {
				kilograms: 7,
				pounds: 15
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 20],
				inches: [15.5, 11.5, 8]
			}
		}
	},
	{
		id: 'rex-airlines',
		airline: 'REX Airlines',
		region: 'Oceania',
		link: 'https://www.rex.com.au/FlightInfo/BaggageAllowance.aspx',
		carryOn: {
			dimensions: {
				centimeters: [48, 34, 25]
			}
		},
		totalWeight: {
			kilograms: 7
		}
	},
	{
		id: 'virgin-australia',
		airline: 'Virgin Australia',
		region: 'Oceania',
		link: 'https://www.virginaustralia.com/au/en/travel-info/baggage/carry-on-baggage/',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'qatar-airways',
		airline: 'Qatar Airways',
		region: 'Middle East',
		link: 'https://www.qatarairways.com/en/baggage/allowance.html',
		carryOn: {
			dimensions: {
				centimeters: [50, 37, 25],
				inches: [20, 15, 10]
			},
			weight: {
				kilograms: 7,
				pounds: 15
			}
		}
	},
	{
		id: 'air-moldova',
		airline: 'Air Moldova',
		region: 'Europe',
		link: 'https://www.airmoldova.md/hand-baggage-en/',
		carryOn: {
			dimensions: {
				centimeters: [50, 40, 25]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'atlantic-airways',
		airline: 'Atlantic Airways',
		region: 'Europe',
		link: 'https://www.atlanticairways.com/en/travel-info/luggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 25]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'etihad-airways',
		airline: 'Etihad Airways',
		region: 'Middle East',
		link: 'https://www.etihad.com/content/eag/etihadairways/etihadcom/global/en/fly-etihad/baggage/cabin-bags.html',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'air-transat',
		airline: 'Air Transat',
		region: 'North America',
		link: 'https://www.airtransat.com/en-CA/Travel-information/Baggage/weight-dimensions',
		carryOn: {
			dimensions: {
				centimeters: [40, 23, 55]
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [43, 13, 31]
			}
		}
	},
	{
		id: 'westjet',
		airline: 'WestJet',
		region: 'North America',
		link: 'https://www.westjet.com/en-ca/baggage#baggage-carry-on',
		carryOn: {
			dimensions: {
				centimeters: [56, 23, 36],
				inches: [22, 9, 14]
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [41, 14, 33],
				inches: [16, 6, 13]
			}
		}
	},
	{
		id: 'aerolineas-argentinas',
		airline: 'Aerolineas Argentinas',
		region: 'South America',
		link: 'https://www.aerolineas.com.ar/en-us/baggage-allowance',
		carryOn: {
			dimensions: {
				centimeters: [55, 35, 25]
			},
			weight: {
				kilograms: 10
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 30]
			},
			weight: {
				kilograms: 3
			}
		}
	},
	{
		id: 'air-corsica',
		airline: 'Air Corsica',
		region: 'Europe',
		link: 'https://www.aircorsica.com/flights/cabin-hold-baggage.html',
		carryOn: {
			dimensions: {
				centimeters: [55, 35, 25]
			},
			weight: {
				kilograms: 12
			}
		}
	},
	{
		id: 'air-europa',
		airline: 'Air Europa',
		region: 'Europe',
		link: 'https://www.aireuropa.com/ot/en/aea/travel-information/baggage/carry-on-luggage.html',
		carryOn: {
			dimensions: {
				centimeters: [55, 35, 25]
			},
			weight: {
				kilograms: 10
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 15]
			}
		}
	},
	{
		id: 'air-france',
		airline: 'Air France',
		region: 'Europe',
		link: 'https://wwws.airfrance.us/information/bagages/bagage-cabine-soute',
		carryOn: {
			dimensions: {
				centimeters: [55, 35, 25],
				inches: [21.7, 13.8, 9.9]
			},
			isExtra: true
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 15],
				inches: [16, 12, 6]
			}
		},
		totalWeight: {
			kilograms: 12,
			pounds: 26.4
		}
	},
	{
		id: 'air-india',
		airline: 'Air India',
		region: 'Asia',
		link: 'https://www.airindia.in/hand-luggage.htm',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20],
				inches: [21, 15, 7]
			},
			weight: {
				kilograms: 7,
				pounds: 15
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 20],
				inches: [15, 11, 7]
			},
			weight: {
				kilograms: 3,
				pounds: 6
			}
		}
	},
	{
		id: 'air-mauritius',
		airline: 'Air Mauritius',
		region: 'Africa',
		link: 'https://www.airmauritius.com/baggage/carry-on',
		carryOn: {
			dimensions: {
				centimeters: 115
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'air-tahiti',
		airline: 'Air Tahiti',
		region: 'Oceania',
		link: 'https://www.airtahiti.com/en/carry-on-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 35, 25],
				inches: [21.7, 13.8, 9.9]
			},
			weight: {
				kilograms: 5,
				pounds: 11
			}
		}
	},
	{
		id: 'avianca-airlines',
		airline: 'Avianca Airlines',
		region: 'South America',
		link: 'https://ayuda.avianca.com/hc/en-us/articles/13080259544219-What-is-carry-on-baggage-and-how-can-I-purchase-it',
		carryOn: {
			dimensions: {
				centimeters: [55, 35, 25],
				inches: [22, 14, 10]
			},
			weight: {
				kilograms: 10,
				pounds: 22
			},
			isExtra: true
		},
		personalItem: {
			dimensions: {
				centimeters: [45, 35, 20],
				inches: [18, 14, 8]
			}
		}
	},
	{
		id: 'georgian-airways',
		airline: 'Georgian Airways',
		region: 'Europe',
		link: 'https://georgian-airways.com/en/service/baggage-information',
		carryOn: {
			dimensions: {
				centimeters: 115
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'gol-airlines',
		airline: 'GOL Airlines',
		region: 'South America',
		link: 'https://www.voegol.com.br/en/information/baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 35, 25]
			},
			weight: {
				kilograms: 10
			}
		}
	},
	{
		id: 'indigo-airlines',
		airline: 'IndiGo',
		region: 'Asia',
		link: 'https://www.goindigo.in/baggage/baggage-allowance.html',
		carryOn: {
			dimensions: {
				centimeters: 115
			},
			weight: {
				kilograms: 7
			}
		},
		personalItem: {
			weight: {
				kilograms: 3
			}
		}
	},
	{
		id: 'kenya-airways',
		airline: 'Kenya Airways',
		region: 'Africa',
		link: 'https://www.kenya-airways.com/en/plan/baggage-information/hand-baggage/',
		carryOn: {
			dimensions: {
				centimeters: [55, 25, 35]
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 15, 30]
			}
		},
		totalWeight: {
			kilograms: 10,
			pounds: 22
		}
	},
	{
		id: 'klm-royal-dutch-airlines',
		airline: 'KLM',
		region: 'Europe',
		link: 'https://www.klm.hr/information/baggage/hand-baggage-allowance',
		carryOn: {
			dimensions: {
				centimeters: [55, 35, 25]
			},
			isExtra: true
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 15]
			}
		},
		totalWeight: {
			kilograms: 12
		}
	},
	{
		id: 'latam-airlines',
		airline: 'LATAM Airlines',
		region: 'South America',
		link: 'https://www.latamairlines.com/us/en/experience/prepare-your-trip/baggage/carry-on',
		carryOn: {
			dimensions: {
				centimeters: [55, 35, 25],
				inches: [21.7, 13.8, 9.8]
			},
			weight: {
				kilograms: 12,
				pounds: 26
			},
			isExtra: true
		},
		personalItem: {
			dimensions: {
				centimeters: [45, 35, 20],
				inches: [17.8, 13.8, 7.9]
			}
		}
	},
	{
		id: 'spicejet',
		airline: 'SpiceJet',
		region: 'Asia',
		link: 'https://corporate.spicejet.com/AirTravelBaggageFaq.aspx',
		carryOn: {
			dimensions: {
				centimeters: [55, 35, 25]
			}
		},
		totalWeight: {
			kilograms: 7
		}
	},
	{
		id: 'transavia',
		airline: 'Transavia',
		region: 'Europe',
		link: 'https://www.transavia.com/help/en-eu/luggage/cabin-luggage/cabin-bag',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 25]
			},
			isExtra: true
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 20]
			}
		},
		totalWeight: {
			kilograms: 10
		}
	},
	{
		id: 'aurigny',
		airline: 'Aurigny',
		region: 'Europe',
		link: 'https://www.aurigny.com/faqs',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			}
		},
		totalWeight: {
			kilograms: 10
		}
	},
	{
		id: 'emirates',
		airline: 'Emirates',
		region: 'Middle East',
		link: 'https://www.emirates.com/us/english/before-you-fly/baggage/cabin-baggage-rules/',
		carryOn: {
			dimensions: {
				centimeters: [55, 38, 22],
				inches: [21.6, 14.9, 8.6]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'royal-brunei-airlines',
		airline: 'Royal Brunei Airlines',
		region: 'Asia',
		link: 'https://www.flyroyalbrunei.com/brunei/en/information/cabin-baggage/',
		carryOn: {
			dimensions: {
				centimeters: [55, 38, 20],
				inches: [22, 15, 8]
			},
			weight: {
				kilograms: 7,
				pounds: 15
			}
		}
	},
	{
		id: 'air-austral',
		airline: 'Air Austral',
		region: 'Oceania',
		link: 'https://www.air-austral.com/en/prepare-your-flight/your-baggage/carry-on-baggage.html',
		carryOn: {
			dimensions: {
				centimeters: [55, 35, 25]
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [45, 35, 20]
			}
		},
		totalWeight: {
			kilograms: 12
		}
	},
	{
		id: 'air-china',
		airline: 'Air China',
		region: 'Asia',
		link: 'https://www.airchina.us/US/GB/info/carry-on-baggage/',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20],
				inches: [22, 16, 8]
			},
			weight: {
				kilograms: 5,
				pounds: 11
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [55, 40, 20],
				inches: [22, 16, 8]
			}
		}
	},
	{
		id: 'air-tahiti-nui',
		airline: 'Air Tahiti Nui',
		region: 'Oceania',
		link: 'https://us.airtahitinui.com/baggage-allowances',
		carryOn: {
			dimensions: {
				centimeters: 115,
				inches: 45
			},
			weight: {
				kilograms: 10,
				pounds: 22
			}
		},
		personalItem: {
			weight: {
				kilograms: 3,
				pounds: 6.6
			}
		}
	},
	{
		id: 'armenian-airlines',
		airline: 'Armenian Airlines',
		region: 'Europe',
		link: 'https://armenianairlines.am/en/baggage/hand-luggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20]
			},
			weight: {
				kilograms: 7
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 20]
			},
			weight: {
				kilograms: 5
			}
		}
	},
	{
		id: 'asiana-airlines',
		airline: 'Asiana Airlines',
		region: 'Asia',
		link: 'https://flyasiana.com/C/US/EN/contents/carry-on-baggage',
		carryOn: {
			dimensions: {
				centimeters: 115
			},
			weight: {
				kilograms: 10
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 20]
			}
		}
	},
	{
		id: 'azores-airlines',
		airline: 'Azores Airlines',
		region: 'Europe',
		link: 'https://www.azoresairlines.pt/en/information/baggage/carry-on-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20]
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 15]
			}
		},
		totalWeight: {
			kilograms: 8,
			pounds: 17
		}
	},
	{
		id: 'azul',
		airline: 'Azul',
		region: 'South America',
		link: 'https://www.voeazul.com.br/fr/en/your-trip/plan/luggage/carry-on-and-personal-luggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 35, 25]
			},
			weight: {
				kilograms: 10
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [25, 35, 25]
			}
		}
	},
	{
		id: 'carpatair',
		airline: 'Carpatair',
		region: 'Europe',
		link: 'https://www.carpatair.com/baggage-rules/',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20]
			},
			weight: {
				kilograms: 5
			}
		}
	},
	{
		id: 'china-southern',
		airline: 'China Southern Airlines',
		region: 'Asia',
		link: 'https://www.csair.com/mcms/mcmsNewSite/en/cn/#/tourguide/luggage_service/carryon_luggage/carry_on',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20],
				inches: [22, 16, 8]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'condor',
		airline: 'Condor',
		region: 'Europe',
		link: 'https://www.condor.com/eu/flight-preparation/baggage-and-animals/carry-on.jsp',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20]
			},
			isExtra: true
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 10]
			}
		},
		totalWeight: {
			kilograms: 8
		}
	},
	{
		id: 'corsair-international',
		airline: 'Corsair',
		region: 'Europe',
		link: 'https://www.flycorsair.com/en/information/luggage/cabin-luggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 35, 25]
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [25, 20, 33]
			}
		},
		totalWeight: {
			kilograms: 12
		}
	},
	{
		id: 'croatia-airlines',
		airline: 'Croatia Airlines',
		region: 'Europe',
		link: 'https://www.croatiaairlines.com/Baggage/Hand-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 8
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 10]
			}
		}
	},
	{
		id: 'hainan-airlines',
		airline: 'Hainan Airlines',
		region: 'Asia',
		link: 'https://www.hainanairlines.com/HUPortal/dyn/portal/DisplayPage?COUNTRY_SITE=US&SITE=CBHZCBHZ&LANGUAGE=US&PAGE=CABA',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20],
				inches: [22, 16, 8]
			},
			weight: {
				kilograms: 7,
				pounds: 15
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [30, 30, 20],
				inches: [12, 12, 8]
			}
		}
	},
	{
		id: 'helvetic-airways',
		airline: 'Helvetic Airways',
		region: 'Europe',
		link: 'https://www.helvetic.com/en/travelinfo#!info=baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'icelandair',
		airline: 'Icelandair',
		region: 'Europe',
		link: 'https://www.icelandair.com/support/baggage/allowance/#carry-on-baggage-allowance',
		carryOn: {
			dimensions: {
				inches: [21.6, 15.7, 7.8],
				centimeters: [55, 40, 20]
			},
			weight: {
				pounds: 22,
				kilograms: 10
			}
		},
		personalItem: {
			dimensions: {
				inches: [11.8, 15.7, 5.9],
				centimeters: [30, 40, 15]
			}
		}
	},
	{
		id: 'jet-time',
		airline: 'Jettime',
		region: 'Europe',
		link: 'https://jettime.com/baggage-info/hand-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20]
			},
			weight: {
				kilograms: 5
			}
		}
	},
	{
		id: 'korean-air',
		airline: 'Korean Air',
		region: 'Asia',
		link: 'https://www.koreanair.com/contents/plan-your-travel/baggage/carry-on-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20]
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 15]
			}
		},
		totalWeight: {
			kilograms: 10
		}
	},
	{
		id: 'miat-mongolian-airlines',
		airline: 'MIAT Mongolian Airlines',
		region: 'Asia',
		link: 'https://www.miat.com/pagecontent.php?pageId=151&lang=en',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'pegasus-airlines',
		airline: 'Pegasus Airlines',
		region: 'Europe',
		link: 'https://www.flypgs.com/en/pegasus-baggage-allowance',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 8
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 15]
			},
			weight: {
				kilograms: 3
			}
		}
	},
	{
		id: 'plus-ultra',
		airline: 'Plus Ultra',
		region: 'Europe',
		link: 'https://www.plusultra.com/es-es/informacion/equipaje/equipaje-en-cabina/',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20]
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [35, 30, 20]
			}
		},
		totalWeight: {
			kilograms: 10
		}
	},
	{
		id: 'ryanair',
		airline: 'Ryanair',
		region: 'Europe',
		link: 'https://www.ryanair.com/gb/en/useful-info/help-centre/terms-and-conditions/termsandconditionsar_696869348',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20]
			},
			weight: {
				kilograms: 10
			},
			isExtra: true
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 20]
			}
		}
	},
	{
		id: 'spring-airlines',
		airline: 'Spring Airlines',
		region: 'Asia',
		link: 'https://en.ch.com/flights/excess-baggage',
		carryOn: {
			dimensions: {
				centimeters: [40, 30, 20]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'tap-portugal',
		airline: 'TAP Air Portugal',
		region: 'Europe',
		link: 'https://www.flytap.com/en-de/baggage/hand-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 25],
				inches: [22, 16, 10]
			},
			weight: {
				kilograms: 10,
				pounds: 22
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 15]
			},
			weight: {
				kilograms: 2,
				pounds: 4.4
			}
		}
	},
	{
		id: 'tarom',
		airline: 'TAROM',
		region: 'Europe',
		link: 'https://www.tarom.ro/en/passenger-information/baggage/hand-baggage/',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20]
			}
		},
		totalWeight: {
			kilograms: 8
		}
	},
	{
		id: 'tui',
		airline: 'TUI',
		region: 'Europe',
		link: 'https://www.tui.com/service-kontakt/flug/handgepaeck',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20]
			},
			weight: {
				kilograms: 10
			},
			isExtra: true
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 20]
			},
			weight: {
				kilograms: 6
			}
		}
	},
	{
		id: 'vivaaerobus',
		airline: 'Viva',
		region: 'North America',
		link: 'https://www.vivaaerobus.com/en-us/info/get-ready-to-fly/baggage-policies',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 25],
				inches: [22, 16, 10]
			},
			weight: {
				pounds: 22
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [45, 35, 20],
				inches: [18, 14, 8]
			},
			weight: {
				kilograms: 3
			}
		}
	},
	{
		id: 'vueling',
		airline: 'Vueling',
		region: 'Europe',
		link: 'https://www.vueling.com/en/vueling-services/prepare-your-trip/luggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20]
			},
			weight: {
				kilograms: 10
			},
			isExtra: true
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 20]
			}
		}
	},
	{
		id: 'air-baltic',
		airline: 'Air Baltic',
		region: 'Europe',
		link: 'https://www.airbaltic.com/en/baggage/cabin-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [40, 30, 15]
			}
		},
		totalWeight: {
			kilograms: 8
		}
	},
	{
		id: 'air-canada',
		airline: 'Air Canada',
		region: 'North America',
		link: 'https://www.aircanada.com/us/en/aco/home/plan/baggage/carry-on.html#/',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23],
				inches: [21.5, 15.5, 9]
			},
			isExtra: true
		},
		personalItem: {
			dimensions: {
				centimeters: [43, 33, 16],
				inches: [17, 13, 6]
			}
		}
	},
	{
		id: 'air-new-zealand',
		airline: 'Air New Zealand',
		region: 'Oceania',
		link: 'https://www.airnewzealand.com/carry-on-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23],
				inches: [21, 16, 9]
			},
			weight: {
				kilograms: 7,
				pounds: 15
			}
		}
	},
	{
		id: 'air-serbia',
		airline: 'Air Serbia',
		region: 'Europe',
		link: 'https://www.airserbia.com/en/information/baggage/hand-luggage/hand-luggage-weight',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 8
			}
		},
		personalItem: {
			weight: {
				kilograms: 4
			}
		}
	},
	{
		id: 'austrian-airlines',
		airline: 'Austrian Airlines',
		region: 'Europe',
		link: 'https://www.austrian.com/gb/en/carry-on-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'azerbaijan-airlines',
		airline: 'Azerbaijan Airlines',
		region: 'Europe',
		link: 'https://www.azal.az/en/information/baggage/hand/',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 10
			}
		}
	},
	{
		id: 'brussels-airlines',
		airline: 'Brussels Airlines',
		region: 'Europe',
		link: 'https://www.brusselsairlines.com/be/en/extra-services/baggage/carry-on-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'bulgaria-air',
		airline: 'Bulgaria Air',
		region: 'Europe',
		link: 'https://www.air.bg/en/customer-support/your-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 10
			}
		}
	},
	{
		id: 'edelweiss',
		airline: 'Edelweiss',
		region: 'Europe',
		link: 'https://www.flyedelweiss.com/EN/prepare/baggage/free-baggage/Pages/hand-baggage.aspx',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'egypt-air',
		airline: 'Egypt Air',
		region: 'Middle East',
		link: 'https://www.egyptair.com/en/fly/baggage/Pages/baggage-allowance.aspx',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'ethiopian-airlines',
		airline: 'Ethiopian Airlines',
		region: 'Africa',
		link: 'https://www.ethiopianairlines.com/aa/information/baggage-information/carry-on-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'fiji-airways',
		airline: 'Fiji Airways',
		region: 'Oceania',
		link: 'https://www.fijiairways.com/manage/baggage-allowances',
		carryOn: {
			dimensions: {
				centimeters: 118,
				inches: 46
			},
			weight: {
				kilograms: 7,
				pounds: 15
			}
		}
	},
	{
		id: 'lufthansa',
		airline: 'Lufthansa',
		region: 'Europe',
		link: 'https://www.lufthansa.com/us/en/carry-on-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'luxair',
		airline: 'Luxair',
		region: 'Europe',
		link: 'https://www.luxair.lu/en/information/hand-luggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'norwegian',
		airline: 'Norwegian',
		region: 'Europe',
		link: 'https://www.norwegian.com/en/travel-info/baggage/hand-baggage/',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 10
			}
		}
	},
	{
		id: 'olympic-air',
		airline: 'Olympic Air',
		region: 'Europe',
		link: 'https://www.olympicair.com/travel-information/travelling-with-olympic-air/baggage/hand-luggage-and-essentials/',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 's7-airlines',
		airline: 'S7 Airlines',
		region: 'Europe',
		link: 'https://www.s7.ru/ru/info/norma-provoza-bagazha/#luggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 10
			}
		}
	},
	{
		id: 'sas-scandinavian-airlines',
		airline: 'SAS Scandinavian Airlines',
		region: 'Europe',
		link: 'https://www.flysas.com/us-en/travel-info/baggage/carry-on/',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'sunexpress',
		airline: 'SunExpress',
		region: 'Europe',
		link: 'https://www.sunexpress.com/en-gb/information/luggage-info/cabin-baggage/',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'swiss-international-air-lines',
		airline: 'Swiss International Air Lines',
		region: 'Europe',
		link: 'https://www.swiss.com/de/en/prepare/baggage/hand-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'turkish-airlines',
		airline: 'Turkish Airlines',
		region: 'Europe',
		link: 'https://www.turkishairlines.com/en-us/any-questions/carry-on-baggage/index.html',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'aeroflot',
		airline: 'Aeroflot',
		region: 'Europe',
		link: 'https://www.aeroflot.ru/ru-en/information/preparation/luggage#baggage_tab2',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 25]
			},
			weight: {
				kilograms: 10
			}
		}
	},
	{
		id: 'aeromexico',
		airline: 'Aeroméxico',
		region: 'North America',
		link: 'https://aeromexico.com/en-us/travel-information/baggage/carry-on-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 25],
				inches: [21.5, 15.7, 10]
			},
			weight: {
				kilograms: 10,
				pounds: 22
			}
		}
	},
	{
		id: 'ana',
		airline: 'ANA',
		region: 'Asia',
		link: 'https://www.ana.co.jp/en/us/travel-information/baggage-information/carry-on/',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 25],
				inches: [22, 16, 10]
			},
			weight: {
				kilograms: 10,
				pounds: 22
			}
		}
	},
	{
		id: 'belavia',
		airline: 'Belavia',
		region: 'Europe',
		link: 'https://en.belavia.by/baggage/unchecked_baggage/',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 25]
			},
			weight: {
				kilograms: 10
			}
		}
	},
	{
		id: 'bh-air',
		airline: 'BH Air',
		region: 'Middle East',
		link: 'http://www.bhairlines.com/page.php?id=38',
		carryOn: {
			dimensions: {
				centimeters: [60, 40, 30]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'volaris',
		airline: 'Volaris',
		region: 'North America',
		link: 'https://cms.volaris.com/en/travel-info/baggage-policy/',
		carryOn: {
			dimensions: {
				inches: [22, 16, 10]
			},
			weight: {
				pounds: 33
			}
		}
	},
	{
		id: 'czech-airlines',
		airline: 'Czech Airlines',
		region: 'Europe',
		link: 'https://www.smartwings.com/en/what-is-the-baggage-allowance',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'wingo',
		airline: 'Wingo',
		region: 'North America',
		link: 'https://www.wingo.com/centro-de-ayuda/equipaje/equipaje-de-mano-adicional',
		carryOn: {
			dimensions: {
				centimeters: [55, 45, 25]
			},
			weight: {
				kilograms: 12
			}
		}
	},
	{
		id: 'air-asia',
		airline: 'Air Asia',
		region: 'Asia',
		link: 'https://support.airasia.com/s/article/What-are-the-rules-for-cabin-baggage-on-board?language=en_GB',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'alaska-airlines',
		airline: 'Alaska Airlines',
		region: 'North America',
		link: 'https://www.alaskaair.com/content/travel-info/baggage/carry-on-luggage',
		carryOn: {
			dimensions: {
				inches: [22, 14, 9]
			}
		}
	},
	{
		id: 'allegiant-air',
		airline: 'Allegiant Air',
		region: 'North America',
		link: 'https://www.allegiantair.com/baggage-1',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 25],
				inches: [22, 16, 10]
			}
		}
	},
	{
		id: 'american-airlines',
		airline: 'American Airlines',
		region: 'North America',
		link: 'https://www.aa.com/i18n/travel-info/baggage/carry-on-baggage.jsp',
		carryOn: {
			dimensions: {
				centimeters: [55, 36, 23],
				inches: [22, 14, 9]
			}
		}
	},
	{
		id: 'bahamasair',
		airline: 'Bahamasair',
		region: 'North America',
		link: 'https://bahamasair.com/baggage-information/baggage-rates-baggage-claim-form-pdf',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23],
				inches: [22, 14, 9]
			},
			weight: {
				kilograms: 9,
				pounds: 20
			}
		}
	},
	{
		id: 'bangkok-airways',
		airline: 'Bangkok Airways',
		region: 'Asia',
		link: 'https://www.bangkokair.com/baggage-allowance',
		carryOn: {
			dimensions: {
				centimeters: [50, 36, 23]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'cambodia-angkor-air',
		airline: 'Cambodia Angkor Air',
		region: 'Asia',
		link: 'https://www.aircambodia.com/en/baggage',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23],
				inches: [22, 11, 9]
			},
			weight: {
				kilograms: 7,
				pounds: 15
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [30, 20, 10],
				inches: [12, 7.9, 3.9]
			}
		}
	},
	{
		id: 'caribbean-airlines',
		airline: 'Caribbean Airlines',
		region: 'North America',
		link: 'https://www.caribbean-airlines.com/#/baggage/carry-on',
		carryOn: {
			dimensions: {
				centimeters: [56, 35, 23],
				inches: [22, 14, 9]
			},
			weight: {
				kilograms: 10,
				pounds: 22
			}
		}
	},
	{
		id: 'cathay-pacific',
		airline: 'Cathay Pacific',
		region: 'Asia',
		link: 'https://www.cathaypacific.com/cx/en_US/baggage.html',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23],
				inches: [22, 14, 9]
			},
			weight: {
				kilograms: 7,
				pounds: 15
			}
		}
	},
	{
		id: 'cebu-pacific',
		airline: 'Cebu Pacific',
		region: 'Asia',
		link: 'https://www.cebupacificair.com/en-PH/pages/travel-info/baggage-information/carry-on-baggage',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'china-airlines',
		airline: 'China Airlines',
		region: 'Asia',
		link: 'https://www.china-airlines.com/us/en/fly/prepare-for-the-fly/baggage/carry-on-baggage',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23],
				inches: [22, 14, 9]
			},
			weight: {
				kilograms: 7,
				pounds: 15
			}
		}
	},
	{
		id: 'delta-air-lines',
		airline: 'Delta Air Lines',
		region: 'North America',
		link: 'https://www.delta.com/us/en/baggage/carry-on-baggage#baggageFees.html',
		carryOn: {
			dimensions: {
				centimeters: [56, 35, 23],
				inches: [22, 14, 9]
			}
		}
	},
	{
		id: 'garuda-indonesia',
		airline: 'Garuda Indonesia',
		region: 'Asia',
		link: 'https://www.garuda-indonesia.com/id/en/garuda-indonesia-experience/baggage-info',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'hawaiian-airlines',
		airline: 'Hawaiian Airlines',
		region: 'North America',
		link: 'https://hawaiianair.custhelp.com/app/answers/detail/a_id/2815/~/carry-on-bag-allowance',
		carryOn: {
			dimensions: {
				inches: [22, 14, 9]
			},
			weight: {
				kilograms: 11,
				pounds: 25
			}
		}
	},
	{
		id: 'hk-express',
		airline: 'HK Express',
		region: 'Asia',
		link: 'https://www.hkexpress.com/en/Plan/Extras/Baggage/Carry-On-Baggage',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23],
				inches: [22, 14, 9]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'hong-kong-airlines',
		airline: 'Hong Kong Airlines',
		region: 'Asia',
		link: 'http://www.hkairlines.com/en_HK/fly-with-us/baggage/handcarry',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23],
				inches: [22, 14, 9]
			},
			weight: {
				kilograms: 7,
				pounds: 15
			}
		}
	},
	{
		id: 'japan-airlines',
		airline: 'Japan Airlines',
		region: 'Asia',
		link: 'https://www.jal.co.jp/jp/en/inter/baggage/inflight/#anchorlink001',
		carryOn: {
			dimensions: {
				centimeters: [56, 40, 25],
				inches: [22, 16, 10]
			},
			weight: {
				kilograms: 10,
				pounds: 22
			}
		}
	},
	{
		id: 'jetblue-airways',
		airline: 'JetBlue Airways',
		region: 'North America',
		link: 'https://www.jetblue.com/help/carry-on-bags',
		carryOn: {
			dimensions: {
				centimeters: [57, 35.5, 23],
				inches: [22, 14, 9]
			}
		}
	},
	{
		id: 'jetstar',
		airline: 'Jetstar',
		region: 'Asia',
		link: 'https://www.jetstar.com/au/en/help/articles/carry-on-baggage-what-can-i-bring-on-board',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'lao-airlines',
		airline: 'Lao Airlines',
		region: 'Asia',
		link: 'https://laoairlines.com/en/baggage-optional-service-charges/',
		carryOn: {
			dimensions: {
				centimeters: [60, 30, 18],
				inches: [24, 12, 7]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'nokair',
		airline: 'NokAir',
		region: 'Asia',
		link: 'https://content.nokair.com/en/Journey-Planning/Baggage/Hand-Baggage-allowance.aspx',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'oman-air',
		airline: 'Oman Air',
		region: 'Middle East',
		link: 'https://www.omanair.com/en/baggage-policy/baggage-allowance',
		carryOn: {
			dimensions: {
				centimeters: 115,
				inches: 45
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'peach',
		airline: 'Peach',
		region: 'Asia',
		link: 'http://www.flypeach.com/en/lm/ai/airports/baggage/carry_on_bag',
		carryOn: {
			dimensions: {
				centimeters: 115
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'philippines-airlines',
		airline: 'Philippines Airlines',
		region: 'Asia',
		link: 'https://www.philippineairlines.com/ph/en/before-you-fly/baggage-information/baggage-allowance/baggage-allowance-fees/carry-on-baggage.html',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23],
				inches: [22, 14, 9]
			},
			weight: {
				kilograms: 7,
				pounds: 15
			}
		}
	},
	{
		id: 'porter-airlines',
		airline: 'Porter Airlines',
		region: 'North America',
		link: 'https://www.flyporter.com/en/travel-information/baggage/carry-on-allowance',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23],
				inches: [21.5, 15.5, 9]
			}
		}
	},
	{
		id: 'qantas',
		airline: 'Qantas',
		region: 'Oceania',
		link: 'https://www.qantas.com/au/en/travel-info/baggage/carry-on-baggage.html#carry-on-baggage-allowances',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'royal-air-maroc',
		airline: 'Royal Air Maroc',
		region: 'Africa',
		link: 'https://www.royalairmaroc.com/int-en/carry-on-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20]
			},
			weight: {
				kilograms: 10
			}
		}
	},
	{
		id: 'royal-jordanian-airlines',
		airline: 'Royal Jordanian Airlines',
		region: 'Middle East',
		link: 'https://www.rj.com/en/info-and-tips/baggage-information/carry-on-pieces',
		carryOn: {
			dimensions: {
				centimeters: [51, 41, 23],
				inches: [20, 16, 9]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'saudia-airlines',
		airline: 'Saudia Airlines',
		region: 'Middle East',
		link: 'https://www.saudia.com/before-flying/baggage/hand-baggage',
		carryOn: {
			dimensions: {
				centimeters: [56, 45, 25],
				inches: [22, 18, 10]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'scoot-airlines',
		airline: 'Scoot Airlines',
		region: 'Asia',
		link: 'https://www.flyscoot.com/en/plan/booking-your-flight/baggage',
		carryOn: {
			dimensions: {
				centimeters: [54, 38, 23]
			},
			weight: {
				kilograms: 10
			}
		}
	},
	{
		id: 'singapore-airlines',
		airline: 'Singapore Airlines',
		region: 'Asia',
		link: 'https://www.singaporeair.com/en_UK/us/travel-info/baggage/cabin-baggage/',
		carryOn: {
			dimensions: {
				centimeters: 115
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'south-african-airways',
		airline: 'South African Airways',
		region: 'Africa',
		link: 'https://www.flysaa.com/manage-fly/baggage/hand-baggage',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'sri-lankan-airlines',
		airline: 'Sri Lankan Airlines',
		region: 'Asia',
		link: 'https://www.srilankan.com/en_uk/plan-and-book/luggage',
		carryOn: {
			dimensions: {
				centimeters: 115
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'united-airlines',
		airline: 'United Airlines',
		region: 'North America',
		link: 'https://www.united.com/ual/en/us/fly/travel/baggage/carry-on.html',
		carryOn: {
			dimensions: {
				centimeters: [56, 35, 23],
				inches: [22, 14, 9]
			}
		}
	},
	{
		id: 'vietnam-airlines',
		airline: 'Vietnam Airlines',
		region: 'Asia',
		link: 'https://www.vietnamairlines.com/vn/en/travel-information/baggage/baggage-allowance-hand-baggage',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23]
			},
			weight: {
				kilograms: 10
			}
		}
	},
	{
		id: 'virgin-atlantic-airways',
		airline: 'Virgin Atlantic Airways',
		region: 'Europe',
		link: 'https://help.virginatlantic.com/gb/en/baggage/hand-baggage.html',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23],
				inches: [22, 14, 9]
			},
			weight: {
				kilograms: 10,
				pounds: 22
			}
		}
	},
	{
		id: 'xiamen-airlines',
		airline: 'Xiamen Airlines',
		region: 'Asia',
		link: 'https://www.xiamenair.com/en-ww/article-detail?articleLink=%2Fcms-i18n-ow%2Fcms-en-ww%2Fchannels%2F11310.json',
		carryOn: {
			dimensions: {
				centimeters: 115,
				inches: 45
			},
			weight: {
				kilograms: 5,
				pounds: 11
			}
		}
	},
	{
		id: 'copa-airlines',
		airline: 'Copa Airlines',
		region: 'North America',
		link: 'https://www.copaair.com/en/web/gs/carry-on-luggage',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 26],
				inches: [22, 14, 10]
			},
			weight: {
				kilograms: 10,
				pounds: 22
			}
		}
	},
	{
		id: 'aegean-airlines',
		airline: 'Aegean Airlines',
		region: 'Europe',
		link: 'https://en.aegeanair.com/travel-information/baggage/cabin-baggage/',
		carryOn: {
			dimensions: {
				centimeters: [56, 45, 25]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'air-astana',
		airline: 'Air Astana',
		region: 'Asia',
		link: 'https://airastana.com/global-en/information/carry-on-baggage',
		carryOn: {
			dimensions: {
				centimeters: [56, 45, 25]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'british-airways',
		airline: 'British Airways',
		region: 'Europe',
		link: 'https://www.britishairways.com/en-gb/information/baggage-essentials',
		carryOn: {
			dimensions: {
				centimeters: [56, 45, 25],
				inches: [22, 18, 10]
			},
			weight: {
				kilograms: 23,
				pounds: 51
			}
		}
	},
	{
		id: 'easyjet',
		airline: 'easyJet',
		region: 'Europe',
		link: 'https://www.easyjet.com/en/help/baggage/cabin-bag-and-hold-luggage',
		carryOn: {
			dimensions: {
				centimeters: [56, 45, 25]
			},
			weight: {
				kilograms: 15
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [45, 36, 20]
			}
		}
	},
	{
		id: 'el-al',
		airline: 'El Al',
		region: 'Middle East',
		link: 'https://www.elal.com/en/PassengersInfo/Baggage/Hand-Baggage/Pages/Policy.aspx',
		carryOn: {
			dimensions: {
				centimeters: [56, 45, 25]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'iberia',
		airline: 'Iberia',
		region: 'Europe',
		link: 'https://www.iberia.com/us/luggage/hand-luggage/',
		carryOn: {
			dimensions: {
				centimeters: [56, 40, 25]
			},
			weight: {
				kilograms: 10
			}
		}
	},
	{
		id: 'jet2com',
		airline: 'Jet2.com',
		region: 'Europe',
		link: 'https://www.jet2.com/faqs?topic=baggage-and-sports-equipment&category=hand-luggage-allowances',
		carryOn: {
			dimensions: {
				centimeters: [56, 45, 25]
			},
			weight: {
				kilograms: 10
			}
		}
	},
	{
		id: 'smartwings',
		airline: 'SmartWings',
		region: 'Europe',
		link: 'https://www.smartwings.com/en/what-is-the-baggage-allowance',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 23]
			},
			weight: {
				kilograms: 8
			}
		}
	},
	{
		id: 'thai-airways',
		airline: 'Thai Airways',
		region: 'Asia',
		link: 'https://www.thaiairways.com/en/travel_information/baggage.page',
		carryOn: {
			dimensions: {
				centimeters: [56, 45, 25],
				inches: [22, 18, 10]
			},
			weight: {
				kilograms: 7,
				pounds: 15
			}
		}
	},
	{
		id: 'kuwait-airways',
		airline: 'Kuwait Airways',
		region: 'Middle East',
		link: 'https://www.kuwaitairways.com/en/is/free-carry-on-baggage',
		carryOn: {
			dimensions: {
				centimeters: [56, 46, 25],
				inches: [22, 18, 10]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'malaysia-airlines',
		airline: 'Malaysia Airlines',
		region: 'Asia',
		link: 'https://www.malaysiaairlines.com/ph/en/travel-info/baggage/cabin-baggage.html',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23],
				inches: [22, 14, 9]
			},
			weight: {
				kilograms: 7,
				pounds: 15
			}
		}
	},
	{
		id: 'norse-atlantic-airways',
		airline: 'Norse Atlantic Airways',
		region: 'Europe',
		link: 'https://flynorse.com/support/optional-fees',
		carryOn: {
			dimensions: {
				centimeters: [56, 45, 25],
				inches: [22, 18, 10]
			},
			weight: {
				kilograms: 10,
				pounds: 22
			}
		}
	},
	{
		id: 'spirit-airlines',
		airline: 'Spirit Airlines',
		region: 'North America',
		link: 'https://customersupport.spirit.com/en-us/category/article/KA-01535',
		carryOn: {
			dimensions: {
				centimeters: [56, 46, 25],
				inches: [22, 18, 10]
			}
		}
	},
	{
		id: 'frontier-airlines',
		airline: 'Frontier Airlines',
		region: 'North America',
		link: 'https://www.flyfrontier.com/travel/travel-info/bag-options/#Carry-on',
		carryOn: {
			dimensions: {
				inches: [24, 16, 10]
			},
			weight: {
				pounds: 35
			}
		}
	},
	{
		id: 'cayman-airways',
		airline: 'Cayman Airways',
		region: 'North America',
		link: 'https://www.caymanairways.com/baggage-policy',
		carryOn: {
			dimensions: {
				inches: [24, 16, 11]
			}
		}
	},
	{
		id: 'southwest-airlines',
		airline: 'Southwest Airlines',
		region: 'North America',
		link: 'https://www.southwest.com/help/baggage/carryon-baggage',
		carryOn: {
			dimensions: {
				inches: [24, 16, 10]
			}
		}
	},
	{
		id: 'sun-country-airlines',
		airline: 'Sun Country Airlines',
		region: 'North America',
		link: 'https://suncountry.com/bags-optional-services',
		carryOn: {
			dimensions: {
				inches: [24, 16, 11]
			},
			weight: {
				pounds: 35
			}
		}
	},
	{
		id: 'pobeda',
		airline: 'Pobeda',
		region: 'Europe',
		link: 'https://www.flypobeda.ru/information/luggage_baggage',
		carryOn: {
			dimensions: {
				centimeters: [36, 30, 27]
			},
			weight: {
				kilograms: 10
			}
		}
	},
	{
		id: 'zipair',
		airline: 'ZIPAIR',
		region: 'Asia',
		link: 'https://www.zipair.net/en/service/baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 25]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'air-peace',
		airline: 'Air Peace',
		region: 'Africa',
		link: 'https://flyairpeace.com/terms-and-conditions/',
		carryOn: {
			dimensions: {
				centimeters: [45, 33, 20]
			},
			weight: {
				kilograms: 6
			}
		}
	},
	{
		id: 'air-arabia',
		airline: 'Air Arabia',
		region: 'Middle East',
		link: 'https://www.airarabia.com/en/hand-baggage',
		carryOn: {
			dimensions: {
				centimeters: [55, 40, 20]
			},
			weight: {
				kilograms: 7
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [25, 33, 20]
			},
			weight: {
				kilograms: 3
			}
		}
	},
	{
		id: 'batik-air',
		airline: 'Batik Air',
		region: 'Asia',
		link: 'https://www.batikair.com.my/experience/baggage',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23]
			}
		},
		personalItem: {
			dimensions: {
				centimeters: [22, 27, 8]
			}
		},
		totalWeight: {
			kilograms: 7
		}
	},
	{
		id: 'breeze-airways',
		airline: 'Breeze Airways',
		region: 'North America',
		link: 'https://www.flybreeze.com/support?a=Bag-Allowance-and-Dimensions---id--EvTT15-VRZWup0Ivwy_VhA',
		carryOn: {
			dimensions: {
				inches: [22, 14, 9]
			},
			weight: {
				pounds: 35
			}
		},
		personalItem: {
			dimensions: {
				inches: [17, 13, 8]
			}
		}
	},
	{
		id: 'flynas',
		airline: 'Flynas',
		region: 'Middle East',
		link: 'https://www.flynas.com/en/plan-my-trip/cabin-baggage',
		carryOn: {
			dimensions: {
				centimeters: [56, 36, 23]
			},
			weight: {
				kilograms: 7
			}
		}
	},
	{
		id: 'gulf-air',
		airline: 'Gulf Air',
		region: 'Middle East',
		link: 'https://www.gulfair.com/help/baggage/baggage-information',
		carryOn: {
			dimensions: {
				centimeters: [45, 40, 30]
			},
			weight: {
				kilograms: 6
			}
		}
	}
];
