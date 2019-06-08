# homebridge-http-doorbell

This plugin offers you a doorbell that can be triggerd via an HTTP request.

## Installation

Run the following command

```bash
cd /usr/local/lib/node_modules
git clone https://github.com/andrimanna/homebridge-http-doorbell
npm install -g --unsafe-perm http
```

Chances are you are going to need sudo with that.

## Config.json

This is an example configuration

```json
"platforms" : [
    {
        "platform": "http-doorbell",
        "port": 9053,
        "doorbells": [
            {
               "name": "Campanello",
               "id": "ingresso"
            }
        ]
    }
]
```

| Key           | Description                                                                        |
|---------------|------------------------------------------------------------------------------------|
| platform      | Required. Has to be "http-doorbell"                                                |
| port          | Required. The port that you want this plugin to listen on. Should be above 1024.   |
| doorbells[].name | Required. The name of this doorbell. This will appear in your homekit app       |
| doorbells[].id | Optional. Sets doorbell id for webhook, seqeuntial from 1 by default              |
