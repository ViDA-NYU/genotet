Genotet
=======

**Master Build Status**
[![Master Build Status](https://travis-ci.org/ViDA-NYU/genotet.svg?branch=master)](https://travis-ci.org/ViDA-NYU/genotet)

**Development Build Status**
[![Development Build Status](https://travis-ci.org/ViDA-NYU/genotet.svg?branch=refactor)](https://travis-ci.org/ViDA-NYU/genotet)

An Interactive Web-based Visual Exploration Framework to Support Validation of Gene Regulatory Networks


## Installation

Note: The installtion steps were verified on Ubuntu Desktop 14.04.

- Install [node.js](https://nodejs.org/en/), [JRE](http://www.java.com/), [mongoDB](https://www.mongodb.com/) on the server machine.
- Clone the Genotet repository and serve it at {server_url/genotet}.
- Install required packages for the web pages and the nodejs server.
    ```bash
    # at genotet/
    npm install
    # at genotet/
    cd server
    # now at genotet/server
    npm install
    ```

- Create and edit a server configuration file to set the data paths. The file shall be located at _genotet/server/config_.

    ```
    mongoDatabase = genotet
    origin = {server_url}
    dataPath = .../genotet_data/data/
    bigWigToWigPath = .../genotet_data/bigWigToWig
    ```

- Run the setup script.
The script initializes the mongo database.
Make sure mongod is running in the background.
The script downloads the UCSC bigWigToWig tool. Note that the default version is for linux x86_64.
If you are on a Mac or Windows machine, you need to change the downloading url in setup.sh.

    ```
    bash setup.sh
    ```

- Run the server.

    ```
    bash start.sh
    ```
    
## Python batch upload script (uploadBatch.py)

- Modify line 14 to set the upload server url.

```bash
url = 'http://{genotet_server_url}'
```

- Write a tsv file that describes the data file. Each line describes one data file as follows.

```bash
file_path data_name data_type description
```
- Note that data_type must be one of "network", "binding", "expression" and "bed".
Tokens are [tab] or [\t] seperated.
White spaces are allowed in the file description.
- Run the script with your username and tsv file.

```bash
python uploadBatch.py {username} {tsv_file_name}
```
- Enter the account password and monitor the command line output. It should output 200 on success.

