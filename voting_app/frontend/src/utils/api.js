import axios from 'axios';

const API_STEM = '/api/v1';

let api = {
    fetchAllPolls: () => {
        let URL = `${API_STEM}/polls`;
        return axios.get(URL)
            .then((response) => response.data)
            .catch(function(err){
                console.warn("Error in fetchAllPolls", err);
            })
    }
};

export default api;