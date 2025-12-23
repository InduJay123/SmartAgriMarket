import axios from "axios";

const BASE_URL = 'http://127.0.0.1:8000/api/documents';

export const GetPriceListPDF = async () => {
    try{
        const response = await axios.get(`${BASE_URL}/price-lists/`);
        console.log(response.data);
        return Array.isArray(response.data) ? response.data : [];
    }catch(err){
        console.error("Failed to fetch pdf: ",err)
        return [];
    }
}