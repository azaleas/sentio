import axios from 'axios';
import Cookies from 'universal-cookie';

const cookies = new Cookies(document.cookies);
const API_STEM = '/api/v1';
const API_STEM_AUTH = '/rest-auth';

class Api{

    constructor() {
        if(localStorage.getItem('token') === null){
            this.token = null;
        }
        else{
            this.token = localStorage.getItem('token');
        }
        console.log(this.token);
    }

    /*Fetchind the Data*/

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
        let config = {
            headers: {"X-CSRFToken": csrfToken},
        };

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
                    console.warn(error.response);
                }
            })
    }

    /*Authentication*/
    
    handleLogin(username, password){
        
        let URL = `${API_STEM_AUTH}/login/`;

        let csrfToken = cookies.get('csrftoken');
        let config = {
            headers: {"X-CSRFToken": csrfToken},
        };

        return axios.post(
            URL, 
            {
                username,
                password   
            },
            config
        )
        .then((response) => {
            let token = response.data.key;
            localStorage.setItem('token', token);
            this.token = token;
            return 'success';
        })
        .catch((error) => {
            // Wrong credentials, status code 400
            if(error.response.status === 400){
                return error.response.status;
            }
            else{
                console.warn(error.response);
            }
        })
    }

    handleLogout(){
        localStorage.removeItem('token');
        this.token = null;
        let URL = `${API_STEM_AUTH}/logout/`;
        let csrfToken = cookies.get('csrftoken');
        let config = {
            headers: {
                "X-CSRFToken": csrfToken,
                "Content-Type": "application/x-www-form-urlencoded",
            },
        };
        axios.post(
            URL,
            config
        )
        .catch((error) => {
            console.log(error.response);
        })
    }

    isLoggedIn(){
        return !!this.token;
    }
}

export const api = new Api();