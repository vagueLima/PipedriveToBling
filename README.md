# PipedriveToBling

For the sake of convenience, the .env file for this project it's not on gitignore.
Change the Variables PIPEDRIVE\*TOKEN, PIPEDRIVER_API_URL, BLING_TOKEN and BLING_API_URL to your desired accounts.
There is no need to change the \*\*MONGO**\* environment variables. Whenever data is stored, the environment variable '**PIPEDRIVER_API_URL\*\*' is used to differentiate records. That means you can change Pipedrive accounts, and you will only get the documents to the one the URL is currently pointing.

It's possible to get data from the GET routes by running this project with npm start (after npm install).

For the webhook to work, you need to add the URL to the API in your Pipedrive settings, using the event 'updated.deal' and setting it to /deal (I've used ngrok to run it locally).

More info on how to set your webhook here [https://pipedrive.readme.io/docs/guide-for-webhooks](https://pipedrive.readme.io/docs/guide-for-webhooks)

## Routes

### GET /deals/:status

Returns deals from Pipedriver.

Example :

/deals/won => return all deals with 'won' as a status.

/deals => return all deals

### POST /deal

Every change to a deal in Pipedrive triggers a call to this route. When a deal status changes to 'won,' the API will upload it to Bling, then save it on the Database.

### GET /oportunidades

This route groups the opportunities in the Database by day and value, and returns in an array.

## Tests

There are 3 simple tests implemented right now, covering all 3 implemented routes.

The first one gets data from Pipedrive, useful to see if the URL and the tokens are correctly set.

The second one Mocks a webhook call from Pipedrive, using the same body from the original request but using some random values in some parameters.

The last one gets all Opportunities from the database.

To run them:

    npm run test
