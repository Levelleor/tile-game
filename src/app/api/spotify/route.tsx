import { NextResponse } from 'next/server';
import axios from 'axios';
import { join as joinPath } from 'path';

const tokenAPI = process.env.TOKEN_API,
      trackAPI = process.env.TRACK_API;

const client_id = process.env.CLIENT_ID;
const client_secret = process.env.CLIENT_SECRET;

if (!tokenAPI || !trackAPI) throw new Error('Token API or Track API urls are not defined via env variables');

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const trackid = searchParams.get('track');

  if (!trackid) return NextResponse.json('Error', {
    status: 500
  });

  const token = await getToken({url: tokenAPI!, clientId: client_id!, secretId: client_secret!});

  if (!token) throw new Error('Token not found');

  const track = await getTrack({trackid: trackid, url: trackAPI!, token: token});

  return NextResponse.json(track);
}

interface tokenFetchParams {
  url: string,
  clientId: string,
  secretId: string
}

async function getToken({url, clientId, secretId}: tokenFetchParams): Promise<string|undefined> {
  try {
    const authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      headers: {
        'Authorization': 'Basic ' + Buffer.from(clientId + ':' + secretId).toString('base64'),
        'Content-Type':'application/x-www-form-urlencoded'
      },
      data: {
        grant_type: 'client_credentials'
      }
    };
    const response = await axios.post(url, { grant_type: 'client_credentials' }, {
      headers: authOptions.headers
    });
    if (response.status === 200) {
      return response.data.access_token;
    } else {
      throw new Error('Failed to get access token');
    }
  } catch (error) {
    console.error(error);
  }
}

interface trackFetchParams {
  url: string,
  trackid: string,
  token: string
}

async function getTrack({trackid, url, token}: trackFetchParams): Promise<object|undefined> {
  try {
    const response = await axios.get(joinPath(url, trackid), {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });
    if (response.status === 200) {
      const trackInfo = response.data;
      return trackInfo;
    } else {
      throw new Error('Failed to fetch the track');
    }
  } catch (error) {
    console.error(error);
  }
}