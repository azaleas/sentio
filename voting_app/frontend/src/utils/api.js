import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies(document.cookies);
const API_STEM = '/api/v1';

class Api{

    constructor() {
    
    }

    fetchAllPolls(){
        let URL = `${API_STEM}/polls`;
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

    fetchSinglePoll(id){
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

    postVote(quesitonId, choiceId){
        let URL = `${API_STEM}/polls/${quesitonId}/vote/`;

        let csrfToken = cookies.get('csrftoken');
        const config = {
            headers: {"X-CSRFToken": csrfToken},
        }
        return axios.post(
                URL, 
                {
                    "question": quesitonId,
                    "choice": choiceId,
                },
                config
            )
            .then((response) => {
                return response.data.data.question;
            })
            .catch((error) => {
                if(error.response.status === 403){
                    return error.response.status;
                }
                else{
                    console.warn(error);
                }
            })
    }

    isLoggedIn(){
        return false;
    }
}

export const api = new Api();