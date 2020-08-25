# PipedriveToBling

For the sake of convenience, the .env file for this project it's not on gitignore.

It's possible to get data from the GET routes by running this project with npm start (after npm install).

For the webhook to work, you need to add the URL to the API in your Pipedrive settings, using the event 'updated.deal' and setting it to /deal (I've used ngrok to run it locally).

More info here [https://pipedrive.readme.io/docs/guide-for-webhooks](https://pipedrive.readme.io/docs/guide-for-webhooks)

## Routes

### GET /deals/:status

Returns all deals in Pipedrive with the status passed.

Example :

/deals/won => return all deals with 'won' as a status.

/deals => return all deals

### POST /deal

Every change to a deal in Pipedrive triggers a call to this route. When a deal status changes to 'won,' the API will upload it to Bling, then save it on the Database.

### GET /oportunidades

This route groups the opportunities in the Database by day and value, and returns in an array.
