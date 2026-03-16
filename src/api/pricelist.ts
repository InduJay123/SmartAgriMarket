import api from "./api";

export const GetPriceListPDF = async () => {
    try{
        const response = await api.get(`/prices/uploads/`);
        console.log(response.data);
        return Array.isArray(response.data) ? response.data : [];
    }catch(err){
        console.error("Failed to fetch pdf: ",err)
        return [];
    }
}