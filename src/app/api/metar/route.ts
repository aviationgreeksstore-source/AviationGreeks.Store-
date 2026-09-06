import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 300; // 5 minutes

export interface MetarStation {
  icaoId: string;
  name: string;
  temp?: number;
  dewp?: number;
  wdir?: number | string;
  wspd?: number;
  visib?: string | number;
  altim?: number;
  fltCat?: 'VFR' | 'MVFR' | 'IFR' | 'LIFR' | string;
  rawOb?: string;
  cover?: string;
  reportTime?: string;
}

const DEFAULT_STATIONS: MetarStation[] = [
  {
    icaoId: 'LGAV',
    name: 'Athens Eleftherios Venizelos Intl',
    temp: 24,
    dewp: 15,
    wdir: 340,
    wspd: 12,
    visib: '10+',
    altim: 1016,
    fltCat: 'VFR',
    rawOb: 'METAR LGAV 061950Z 34012KT CAVOK 24/15 Q1016 NOSIG',
    cover: 'CAVOK',
    reportTime: new Date().toISOString()
  },
  {
    icaoId: 'LGTS',
    name: 'Thessaloniki Makedonia Airport',
    temp: 22,
    dewp: 14,
    wdir: 320,
    wspd: 8,
    visib: '10+',
    altim: 1017,
    fltCat: 'VFR',
    rawOb: 'METAR LGTS 061950Z 32008KT CAVOK 22/14 Q1017 NOSIG',
    cover: 'CAVOK',
    reportTime: new Date().toISOString()
  },
  {
    icaoId: 'LGIR',
    name: 'Heraklion Nikos Kazantzakis Intl',
    temp: 25,
    dewp: 16,
    wdir: 290,
    wspd: 14,
    visib: '10+',
    altim: 1015,
    fltCat: 'VFR',
    rawOb: 'METAR LGIR 061950Z 29014KT CAVOK 25/16 Q1015 NOSIG',
    cover: 'CAVOK',
    reportTime: new Date().toISOString()
  },
  {
    icaoId: 'LGSA',
    name: 'Chania Ioannis Daskalogiannis Airport',
    temp: 23,
    dewp: 15,
    wdir: 310,
    wspd: 10,
    visib: '10+',
    altim: 1016,
    fltCat: 'VFR',
    rawOb: 'METAR LGSA 061950Z 31010KT CAVOK 23/15 Q1016 NOSIG',
    cover: 'CAVOK',
    reportTime: new Date().toISOString()
  },
  {
    icaoId: 'LGKR',
    name: 'Corfu Ioannis Kapodistrias Intl',
    temp: 23,
    dewp: 17,
    wdir: 180,
    wspd: 6,
    visib: '10+',
    altim: 1017,
    fltCat: 'VFR',
    rawOb: 'METAR LGKR 061950Z 18006KT 9999 FEW025 23/17 Q1017 NOSIG',
    cover: 'FEW',
    reportTime: new Date().toISOString()
  },
  {
    icaoId: 'LGRP',
    name: 'Rhodes Diagoras Intl',
    temp: 26,
    dewp: 16,
    wdir: 280,
    wspd: 11,
    visib: '10+',
    altim: 1015,
    fltCat: 'VFR',
    rawOb: 'METAR LGRP 061950Z 28011KT CAVOK 26/16 Q1015 NOSIG',
    cover: 'CAVOK',
    reportTime: new Date().toISOString()
  }
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const ids = searchParams.get('ids') || 'LGAV,LGTS,LGIR,LGSA,LGKR,LGRP';

  try {
    const res = await fetch(
      `https://aviationweather.gov/api/data/metar?ids=${encodeURIComponent(ids)}&format=json`,
      {
        headers: {
          'User-Agent': 'AviationGreeks-Store/2.0 (flightops@aviationgreeks.store)',
          'Accept': 'application/json'
        },
        next: { revalidate: 300 } // 5 minutes
      }
    );

    if (!res.ok) {
      return NextResponse.json({
        stations: DEFAULT_STATIONS,
        source: 'fallback',
        timestamp: new Date().toISOString()
      });
    }

    const data = await res.json();

    if (!Array.isArray(data) || data.length === 0) {
      return NextResponse.json({
        stations: DEFAULT_STATIONS,
        source: 'fallback',
        timestamp: new Date().toISOString()
      });
    }

    // Map and normalize station data
    const stations: MetarStation[] = data.map((item: any) => ({
      icaoId: item.icaoId || 'UNKNOWN',
      name: item.name || item.icaoId,
      temp: typeof item.temp === 'number' ? Math.round(item.temp) : undefined,
      dewp: typeof item.dewp === 'number' ? Math.round(item.dewp) : undefined,
      wdir: item.wdir ?? 'VRB',
      wspd: typeof item.wspd === 'number' ? item.wspd : 0,
      visib: item.visib ?? '10+',
      altim: item.altim ? Math.round(item.altim) : 1013,
      fltCat: item.fltCat || 'VFR',
      rawOb: item.rawOb || '',
      cover: item.cover || 'CAVOK',
      reportTime: item.reportTime || new Date().toISOString()
    }));

    return NextResponse.json(
      {
        stations,
        source: 'live',
        timestamp: new Date().toISOString()
      },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600'
        }
      }
    );
  } catch (error) {
    console.error('Error fetching METAR data:', error);
    return NextResponse.json({
      stations: DEFAULT_STATIONS,
      source: 'fallback',
      timestamp: new Date().toISOString()
    });
  }
}
