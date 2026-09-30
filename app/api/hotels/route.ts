import { AGODA_CONFIG, getAgodaHeaders } from '@/lib/agoda';

function formatDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return year + '-' + month + '-' + day;
}

function getBangkokToday(): Date {
  const now = new Date();

  const bangkokDateString = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Bangkok',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(now);

  return new Date(bangkokDateString + 'T00:00:00');
}

function isValidDateString(value: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(value + 'T00:00:00');

  return (
    !Number.isNaN(date.getTime()) &&
    formatDate(date) === value
  );
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    /*
     * Agoda検索の日付はバンコク時間を基準にする。
     * 日付指定がない場合は「明日 → 明後日」。
     */
    const bangkokToday = getBangkokToday();

    const defaultCheckIn = new Date(bangkokToday);
    defaultCheckIn.setDate(defaultCheckIn.getDate() + 1);

    const defaultCheckOut = new Date(bangkokToday);
    defaultCheckOut.setDate(defaultCheckOut.getDate() + 2);

    const checkInDate =
      searchParams.get('checkIn') || formatDate(defaultCheckIn);

    const checkOutDate =
      searchParams.get('checkOut') || formatDate(defaultCheckOut);

    const adultsParam = searchParams.get('adults');
    const maxResultParam = searchParams.get('maxResult');

    const numberOfAdults = adultsParam
      ? Number(adultsParam)
      : 2;

    const maxResult = maxResultParam
      ? Number(maxResultParam)
      : 20;

    /*
     * 入力値チェック
     */
    if (
      !isValidDateString(checkInDate) ||
      !isValidDateString(checkOutDate)
    ) {
      return Response.json(
        { error: 'Invalid check-in or check-out date' },
        { status: 400 }
      );
    }

    if (checkOutDate <= checkInDate) {
      return Response.json(
        { error: 'Check-out date must be after check-in date' },
        { status: 400 }
      );
    }

    if (
      !Number.isInteger(numberOfAdults) ||
      numberOfAdults < 1 ||
      numberOfAdults > 20
    ) {
      return Response.json(
        { error: 'Invalid number of adults' },
        { status: 400 }
      );
    }

    /*
     * Agoda Affiliate Long Tail Search API の
     * City Search 仕様に合わせたリクエスト。
     *
     * 公式仕様では occupancy は additional の中にあり、
     * numberOfAdult は単数形。
     *
     * numberOfRooms は Long Tail City Search の
     * リクエストパラメータには存在しないため送信しない。
     */
    const requestBody = {
      criteria: {
        cityId: 9395,
        checkInDate,
        checkOutDate,
        additional: {
          currency: 'JPY',
          language: 'ja-jp',
          maxResult,
          occupancy: {
            numberOfAdult: numberOfAdults,
            numberOfChildren: 0,
          },
        },
      },
    };

    /*
     * 診断用ログ。
     * API Key / Site ID は出力しない。
     */
    console.log(
      'Agoda request body:',
      JSON.stringify(requestBody, null, 2)
    );

    const response = await fetch(AGODA_CONFIG.endpoint, {
      method: 'POST',
      headers: getAgodaHeaders(),
      body: JSON.stringify(requestBody),
    });

    const responseText = await response.text();

    /*
     * HTTPレベルのエラー
     */
    if (!response.ok) {
      console.error(
        'Agoda API returned HTTP ' +
          response.status +
          ': ' +
          responseText.slice(0, 500)
      );

      return Response.json({
        ok: false,
        hotels: [],
      });
    }

    /*
     * JSONパース
     */
    let data: unknown;

    try {
      data = JSON.parse(responseText);
    } catch (error) {
      console.error('Failed to parse Agoda API response:', error);

      return Response.json({
        ok: false,
        hotels: [],
      });
    }

    /*
     * 想定外のレスポンス
     */
    if (!data || typeof data !== 'object') {
      console.error('Unexpected Agoda API response:', responseText.slice(0, 500));

      return Response.json({
        ok: false,
        hotels: [],
      });
    }

    const responseData = data as {
      error?: unknown;
      hotels?: unknown;
      results?: unknown;
      hotelList?: unknown;
    };

    /*
     * Agoda APIがアプリケーションレベルのエラーを返した場合。
     */
    if (responseData.error) {
      console.warn(
        'Agoda API returned an application-level error:',
        responseData.error
      );

      return Response.json({
        ok: false,
        hotels: [],
      });
    }

    /*
     * ホテル一覧の取得
     */
    let hotelsArray: unknown[] = [];

    if (Array.isArray(responseData.hotels)) {
      hotelsArray = responseData.hotels;
    } else if (Array.isArray(responseData.results)) {
      hotelsArray = responseData.results;
    } else if (Array.isArray(responseData.hotelList)) {
      hotelsArray = responseData.hotelList;
    } else if (Array.isArray(data)) {
      hotelsArray = data;
    }

    console.log(
      'Agoda hotel result count:',
      hotelsArray.length
    );

    return Response.json({
      ok: true,
      hotels: hotelsArray,
    });
  } catch (error) {
    console.error('Failed to fetch Agoda hotels:', error);

    return Response.json({
        ok: false,
        hotels: [],
      });
  }
}