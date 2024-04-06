import axios from "axios";
import { tronGrid } from "../utils/TronGridContext";


let defAdminAddress = process.env.NEXT_PUBLIC_DEFADMIN_ADDRESS ?? '';

function getRefFromUrl() {
    const currentUrl = window.location.href;
    const urlParams = new URLSearchParams(currentUrl);
    const refValue = urlParams.get('ref');
    return refValue == null ? defAdminAddress : refValue;
  }

export const setUserReferral = async (userAddress:string) => {
    try {
      const response = await tronGrid.get(`/user/${ userAddress }/setRef/${ getRefFromUrl() ?? "_"}`);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
};


export const getUserReferral = async (userAddress: string) => {
    try {
      const response = await tronGrid.get(`/getRef/${ userAddress ?? "_"}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return defAdminAddress;
    }
};