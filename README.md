# Copyright and License

Copyright ©2020 OpenZNet,Inc. Mountain View, CA 94040
All Rights Reserved. 
Permission to use, copy, modify, and distribute this software is held by OpenZNet Inc. 
Contact us: info@openznet.com for commercial licensing opportunities.
IN NO EVENT SHALL OpenZNET BE LIABLE TO ANY PARTY FOR DIRECT, INDIRECT, SPECIAL, INCIDENTAL, OR CONSEQUENTIAL DAMAGES, INCLUDING LOST PROFITS, ARISING OUT OF THE USE OF THIS SOFTWARE AND ITS DOCUMENTATION, EVEN IF OpenZNet HAS BEEN ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.  OpenZNet SPECIFICALLY DISCLAIMS ANY WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE. THE SOFTWARE AND ACCOMPANYING DOCUMENTATION, IF ANY, PROVIDED HEREUNDER IS PROVIDED "AS IS". OpenZNet HAS NO OBLIGATION TO PROVIDE MAINTENANCE, SUPPORT, UPDATES, ENHANCEMENTS, OR MODIFICATIONS.# OE-Dashboard 
OE-Dashboard manages manupulation of the database using a UI tool to create a logical organization of the information.

# OE-Dashboard Overview
OE-Dashboard is the O-Element communication platform dashboard.  It is the user interface to manage various aspects of the backend such as data entry and providing instructions to create various tasks that backend ultimately performs.  The OE-Dashboard can manage one or multiple clients.  Each client is identified by a unique frontend URL that can provide different representations of the information that is stored in the backend.  The clients are still controlled and managed by the compositor at the moment (which is part of difffernt URL and repo).  

## Client-based access
We have created multiple clients that can have an isolated access to the data.  The UI allows the user to switch between the clients.   Currently the dashboard is configured in the clientdata so we can have multiple dashboards accessing different clients.

## FUTURE changes
Ultimately everything will be controlled via the OE-Dashboard based on user permissions and product settings and configuration.


# OE-Dashboard Repo Access, building, and running
## Cloning
First you need to clone the repo OE-Dashboard and get the latest code
    
    $ git clone git@bitbucket.org:openznet/oe-dashboard
    $ cd oe-dashboard
    $ git pull
    
## Changes
After making the changes
    
    $ git status 
    $ git add .
    $ git commit -m "comments aboout what you changed"
    $ git push
    
## Install missing packages
At the commant prompt first run this command; this will install any missng node modules

    $ yarn install
        
## Starting the Web Server
Once it is installed, then run a local webserver. This will automatically startup a new browser page with the OE-Dashboard UI. This might take a few miinutes. If you need to use the same window; run this in the background

    $ yarn start

## Stopping the Web Server
1. First sign out the OE-dashboard on the browser. 
2. Close the browser tab
3. On the terminal that you did yarn start, CTRL-C at the terminale

## Query parameters
The default backend domain that oe-dashboard connects to is backend-dev.oelement.openznet.com.  The default port is 4001. Therefore the default URLs are:

	HTTP URL: https://backend-dev.oelement.openznet.com:4001
	Web Socket URL: wss://backend-dev.oelement.openznet.com:4001

Whether you are using the official "dash.oelement.net", or working locally with "yarn start" and "localhost:3000", you can add query parameters to change the backend that the dashboard connects to.  There are 5 query parameters you can use:

	backenddomain
	backendport
	backendprotocol
	backendurl
	wsbackendurl

### Examples:
There currently exists some alternative backend code being developed.  The GraphQL playground for this new code is:

	https://db-dev.oelement.openznet.com:10200
	(there are actually 4 possible ports: 10200 - 10203)

Let's say you want to use this new code on port 10202 for some testing.  You can call up the dashboard as:

	dash.oelement.net?backenddomain=db-dev.oelement.com&backendport=10202

This would run the dashboard with the following backend URLs:

	HTTP URL: https://db-dev.oelement.openznet.com:10202
	Web Socket URL: wss://db-dev.oelement.openznet.com:10202

In another example, let's say you are running oe-dashboard locally with "yarn start". And you want to use a local version of oe-db as started with "forever start ..." (see oe-db README for details).  After "yarn start" gives you a browser page (localhost:3000), replace that URL with:

	localhost:3000?backendprotocol=STANDARD&backenddomain=localhost&backendport=10200

This would run the dashboard with the following backend URLs:

	HTTP URL: http://localhost:10200
	Web Socket URL: ws://localhost:10200

Note that it is important to run local tests with the STANDARD (i.e. NON-https) protocol or you will get SSL errors.
