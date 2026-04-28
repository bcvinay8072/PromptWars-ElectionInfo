/**
 * Google Civic Information API Integration
 * Uses Google's free Civic Information API to fetch real election data.
 * API Docs: https://developers.google.com/civic-information
 */

const CIVIC_API_BASE = 'https://www.googleapis.com/civicinfo/v2';
const CIVIC_API_KEY = process.env.REACT_APP_GEMINI_API_KEY; // Same GCP project key works

export interface ElectionInfo {
  id: string;
  name: string;
  electionDay: string;
  ocdDivisionId?: string;
}

export interface PollingLocation {
  address: {
    locationName: string;
    line1: string;
    city: string;
    state: string;
    zip: string;
  };
  notes?: string;
  pollingHours?: string;
  sources?: Array<{ name: string; official: boolean }>;
}

export interface VoterInfo {
  election: ElectionInfo;
  pollingLocations?: PollingLocation[];
  earlyVoteSites?: PollingLocation[];
  dropOffLocations?: PollingLocation[];
  state?: Array<{
    name: string;
    electionAdministrationBody?: {
      name: string;
      electionInfoUrl?: string;
      votingLocationFinderUrl?: string;
      electionRegistrationUrl?: string;
    };
  }>;
}

/**
 * Fetches upcoming elections from the Google Civic Information API.
 * This demonstrates meaningful Google API integration beyond just Gemini.
 */
export const fetchElections = async (): Promise<ElectionInfo[]> => {
  try {
    const response = await fetch(
      `${CIVIC_API_BASE}/elections?key=${CIVIC_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`Civic API error: ${response.status}`);
    }

    const data = await response.json();
    return data.elections || [];
  } catch (error) {
    console.error('Failed to fetch elections:', error);
    return [];
  }
};

/**
 * Fetches voter information for a specific address.
 * Returns polling locations, early vote sites, and election administration info.
 */
export const fetchVoterInfo = async (address: string): Promise<VoterInfo | null> => {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `${CIVIC_API_BASE}/voterinfo?key=${CIVIC_API_KEY}&address=${encodedAddress}&electionId=2000`
    );
    
    if (!response.ok) {
      // 400 errors are common when no election data is available for the address
      if (response.status === 400) {
        return null;
      }
      throw new Error(`Civic API error: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch voter info:', error);
    return null;
  }
};

/**
 * Fetches representative information for a given address.
 * This provides elected officials and government contacts.
 */
export const fetchRepresentatives = async (address: string): Promise<any> => {
  try {
    const encodedAddress = encodeURIComponent(address);
    const response = await fetch(
      `${CIVIC_API_BASE}/representatives?key=${CIVIC_API_KEY}&address=${encodedAddress}`
    );
    
    if (!response.ok) {
      throw new Error(`Civic API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Failed to fetch representatives:', error);
    return null;
  }
};
