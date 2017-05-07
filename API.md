# List Polls

 * URL: /api/v1/polls/
 * HTTP Method: GET
 
## Example Response

    [
	    {
	        "question_text": "Docker vs Vagrant?",
			"id": 1,
	        "choices": [
	            {
	                "choice_id": 15,
	                "choice_text": "Vagrant",
	                "vote": 0
	            },
	            {
	                "choice_id": 16,
	                "choice_text": "Docker",
	                "vote": 0
	            },
	            {
	                "choice_id": 17,
	                "choice_text": "Other",
	                "vote": 0
	            },
	            ...
	        ]
	    },  
	    ...
	]

# Get The Poll

 * URL: /api/v1/polls/\<pk\>/
 * HTTP Method: GET
 
## Example Response

    {
	    "question_text": "Docker vs Vagrant?",
	    "choices": [
	        {
	            "choice_id": 15,
	            "choice_text": "Vagrant",
	            "vote": 0
	        },
	        {
	            "choice_id": 16,
	            "choice_text": "Docker",
	            "vote": 0
	        },
	        {
	            "choice_id": 17,
	            "choice_text": "Other",
	            "vote": 0
	        },
	        ...
	    ]
	}
    
# Vote

 * URL: /api/v1/polls/\<pk\>/vote
 * HTTP Method: POST
 
## Example Request

    {
	    "question": question_pk,
	    "choice": choice_pk
	}
    
## Example Response

    {
	    "data": {
	        "question": question_pk,
	        "choice": choice_pk
	    }
	}
	

# List My Polls

 * URL: /api/v1/polls/mypolls
 * HTTP Method: GET
 
## Example Response

    [
	    {
	        "question_text": "Docker vs Vagrant?",
	        "choices": [
	            {
	                "choice_id": 15,
	                "choice_text": "Vagrant",
	                "vote": 0
	            },
	            {
	                "choice_id": 16,
	                "choice_text": "Docker",
	                "vote": 0
	            },
	            {
	                "choice_id": 17,
	                "choice_text": "Other",
	                "vote": 0
	            },
	            ...
	        ]
	    },  
	    ...
	]

# Add A Question

 * URL: /api/v1/polls/
 * HTTP Method: POST

## Example Request

	{
	    "question_text": "Which Music?",
	    "choices": [
	         {
	              "choice_text": "Jazz"
	         },
	         {
	              "choice_text": "Soul"
	         }
	     ]
	}
	
## Example Response
	HTTP 200 OK
	
	{
		"New Question created"
	}
    
# Update A Question

Only cad add new choices and update question text

 * URL: /api/v1/polls/\<pk\>/
 * HTTP Method: PUT
 
## Example Request

    {
	    "question_text": "Docker vs Vagrant?",
	    "choices": [
	        {
	            "choice_text": "Both"
	        }
	    ]
	}
    
## Example Response

    HTTP 200 OK
    {
	    "question_text": "Docker vs Vagrant?",
	    "choices": [
	        {
	            "choice_id": 16,
	            "choice_text": "Docker",
	            "vote": 1
	        },
	        {
	            "choice_id": 15,
	            "choice_text": "Vagrant",
	            "vote": 0
	        },
	        {
	            "choice_id": 17,
	            "choice_text": "Other",
	            "vote": 0
	        },
			{
	            "choice_id": 18,
	            "choice_text": "Both",
	            "vote": 0
	        },
	    ]
	}

# Delete a question

 * URL: /api/v1/polls/\<pk\>/
 * HTTP Method: DELETE
 
## Authentication
http://django-rest-auth.readthedocs.io/en/latest/api_endpoints.html

