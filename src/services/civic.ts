/**
 * Google Civic Information API Service
 * Fetches election data, representative info, and polling locations.
 */

const CIVIC_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ""; // Usually shared with Maps key
const BASE_URL = "https://www.googleapis.com/civicinfo/v2";

export const getVoterInfo = async (address: string) => {
  if (!CIVIC_API_KEY) {
    throw new Error("Civic API Key is missing.");
  }

  const response = await fetch(`${BASE_URL}/voterinfo?key=${CIVIC_API_KEY}&address=${encodeURIComponent(address)}`);
  if (!response.ok) {
    if (address.toLowerCase().includes("india")) {
      throw new Error("Direct polling data for India is best found on the official ECI Voter Service Portal (voters.eci.gov.in).");
    }
    throw new Error("Failed to fetch voter information.");
  }
  return await response.json();
};

export const getRepresentatives = async (address: string) => {
  const response = await fetch(`${BASE_URL}/representatives?key=${CIVIC_API_KEY}&address=${encodeURIComponent(address)}`);
  return await response.json();
};
