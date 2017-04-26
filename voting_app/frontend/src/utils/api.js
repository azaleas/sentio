import axios from 'axios';

const API_STEM = '/api/v1';

let api = {

    fetchAllPolls: () => {
        let URL = `${API_STEM}/polls`;
        return axios.get(URL)
            .then((response) => response.data)
            .catch((error) => {
                console.warn("Error in fetchAllPolls", error);
            });
    },

    fetchSinglePoll: (id) => {
        let URL = `${API_STEM}/polls/${id}`;
        return axios.get(URL)
            .then((response) => response.data)
            .catch((error) => {
                if (error.response.status === 404) {
                    return error.response.status;
                }
                else{
                    console.warn("Error in fetchAllPolls", error);
                }
            });
    }
};

export default api;