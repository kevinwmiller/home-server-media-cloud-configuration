# Description
This repository contains a set of docker configuration files for easily setting up instances of Nextcloud, Emby, Ombi, Radarr, Sonarr, Jackett, Deluge (with OpenVpn), and LetsEncrypt

# Requirements
- Docker & Docker Compose
- A VPN provider (Instructions provided for PIA)
- A custom domain name
- A Dynamic DNS Provider (Instructions provided for DuckDns)

# Installation

**Any urls referenced below assume that the sub-domains have not been changed from what is specified in the examples**

## Setting up DuckDns
- Create an account with [duckdns](https://www.duckdns.org/install.jsp)
  - You will need to login through Github, Google, or some other Oauth provider
- Type in your desired subdomain and click Add Domain
  - DuckDns will provide you with a url such as http://example.duckdns.org 
- Make a note of your token listed at the top of the page as you will need this later
- Logout and follow the instructions in the [DuckDns Linux cron tab](https://www.duckdns.org/install.jsp)
  - It seems that you will only see install instructions if you are not signed into duckdns
  - Replace exampledomain with your custom domain
- After going through the setup process, a cron job will be created on your server that will reach out to the duck dns servers and update it with your new IP in the event that it changes
- Ensure ports 80 and 443 are open in your router and forwarded to the server running your instance of traefik

## Configuring DNS
- Go to your hosting providers webside (e.g. Namecheap or Google Domains) and follow their instructions to create new CNAME records
- Create the following routes (Format is Host -> Value):
  - @ -> {{domain}}.duckdns.org
  - cloud -> cloud.{{domain}}.duckdns.org
  - emby -> emby.{{domain}}.duckdns.org
  - dashboard -> dashboard.{{domain}}.duckdns.org
  - ombi -> ombi.{{domain}}.duckdns.org
    - Replace {{domain}} with the domain you specified in the Setting Up DuckDns section
    - Any Host values (dashboard, emby, cloud, ombi) can be changed if desired. Doing so will change that sub-domain that the associated service is accessed from
      - **If you change the sub-domains here, ensure the subdomains configured below are the same**
 
 ## Services
1) Clone the repository to the location that you want to store your emby library and nextcloud data
  1) ```git clone https://github.com/kevinwmiller/home-server-media-cloud-configuration.git server```

### Configuring Traefik
- Traefik is a reverse proxy that integrates well with docker. We will be using a reverse proxy to limit the number of ports that must be exposed on the router as well act as a central point of management for LetsEncrypt
- After following these steps you should be able to access through https://dashboard.example.com
1) Navigate to the traefik directory
   ```
   cd server/traefik
   ```
2) 2) Create a file to store our LetsEncrypt information
   ```
   touch acme.json
   chmod 600 acme.json
3) Create a file with the name '.env' in the current directory with the following contents:
    - ```
      TRAEFIK_URL=dashboard.example.com
      ```
    - Replace example.com with your custom domain
    - If you changed the Host values in the Configuring DNS section, ensure that the values here are the same

4) Generate a username and encrypted password to secure our traefik server
   ```
   sudo apt-get install apache2-utils
   htpasswd -nb admin secure_password
   ```
   - The output will be something like
   - ```admin:$apr1$ruca84Hq$mbjdMZBAG.KWn7vfN/SNK/```
5) Open server/traefik/traefik.toml and replace the token below with your information
   ```
   nano traefik.toml
   ```
   ```
   debug = true

   defaultEntryPoints = ["https", "http"]

   [web]
   address = ":8080"
   [web.auth.basic]
   users = ["{{output_from_htpasswd}}"]

   [entryPoints]
   [entryPoints.http]
   address = ":80"
   [entryPoints.http.redirect]
   entryPoint = "https"
   [entryPoints.https]
   address = ":443"
   [entryPoints.https.tls]

   [docker]
   endpoint = "unix:///var/run/docker.sock"
   domain = "{{your_domain}}"
   watch = true
   exposedbydefault = false

   [acme]
   email = "{{your_email_address}}"
   storage = "/acme.json"
   entryPoint = "https"
   onHostRule = true
   [acme.httpChallenge]
   entryPoint = "http"
   ```
   - The above configuration will reroute any http traffic to https, secure the web server with the credentials provided to htpasswd, and generate LetsEncrypt certifications and store them in the acme.json file created earlier
   - Traefik is configured to route the ${TRAEFIK_URL} to the traefik dashboard on port 8080. This port is not exposed directly, so you will need to access it through the domain name unless you map the port in traefik/docker-compose.yml
   - Note that exposedByDefault is set to false. Traefik will need to be manually enabled and configured for any services we want to use with traefik

5) Start the traefik server
   ```
   docker-compose up -d
   ```
3) Navigate to dashboard.example.com, login with your credentials, and ensure there is a valid SSL certificate
   - There will only be a single service configured for dashboard at the moment. As we add more services, you will see the dashboard start to populate with more routes

### Configuring Nextcloud

Nextcloud is a self-hosted cloud storage provider similar to Dropbox and Google Drive.

1) Navigate to services/nextcloud
   ```
   cd services/nextcloud
   ```
2) Create db.env in this directory with the following contents
   ```
   POSTGRES_USER=postgres
   POSTGRES_PASSWORD={{postgres_password}}
   ```
3) Create a file with the name '.env' in the current directory with the following contents:
    - ```
      NEXTCLOUD_URL=cloud.example.com
      ```
    - Replace example.com with your custom domain
    - If you changed the Host values in the Configuring DNS section, ensure that the values here are the same
4) Start the nextcloud server
   ```
   docker-compose up -d
   ```
5) Navigate to cloud.example.com. Ensure there is a valid ssl certificate
6) Follow the on screen instructions to create your admin account
7) Email (For notifications and password recovery) can be configured in settings/Basic Settings You will need an existing email provider to set this up. Using a gmail account is an easy way to do this

### Configuring Emby

Emby is a self-hosted media server similar to Plex

1) Navigate to services/emby
   ```
   cd services/emby
   ```
2) Create a file with the name '.env' in the current directory with the following contents:
    - ```
      EMBY_URL=emby.example.com
      ```
    - Replace example.com with your custom domain
    - If you changed the Host values in the Configuring DNS section, ensure that the values here are the same
4) Start the emby server
   ```
   docker-compose up -d
   ```
5) Navigate to emby.example.com. Ensure there is a valid ssl certificate

### Configuring Radarr, Sonarr, Jackett, Deluge, and Ombi

- These services are used to create an easy to use, automated pipeline for managing your movies and tv shows
- Radarr is a movie torrent tracker
- Sonarr is a tv show torrent tracker
- Jackett is an aggregator for torrent sites
- Deluge is the download client. This will be routed through a container configured with OpenVpn
- Ombi is a platform for your users to request movies/tv shows. After a request has been approved, the request will be sent to Sonarr or Radarr which will use Jackett to find an appropriate torrent which will then be sent to Deluge to download. After the download is completed, Sonarr or Radarr will copy the downloaded media file to the emby library and notify emby that a new media file is available and the library should be rescanned.
- The vpn server will refuse any internet traffic, restart the vpn container, and reconnect to the vpn if the vpn loses connection


1) Navigate to services/trackers
   ```
   cd services/trackers
   ```
2) Create a file with the name '.env' in the current directory with the following contents:
    - ```
      MEDIA_SERVER=../emby
      OMBI_URL=ombi.example.com
      ```
    - MEDIA_SERVER should point to the directory containing your emby installation
    - Replace example.com with your custom domain
    - If you changed the Host values in the Configuring DNS section, ensure that the values here are the same
3) Create a folder .vpn to store our vpn information
   ```
   mkdir .vpn
   ```
4) Create a file vpn.auth in the .vpn directory with the following contents. **Note: This example configuration is for PrivateInternetAccess (PIA). If you have a different vpn provider, find documentation for configuring an openvpn container**
   ```
   {{PIA_username}}
   {{PIA_password}}
   ```
5) Download the [PIA OpenVpn Configuration Files](https://privateinternetaccess.com/openvpn/openvpn.zip)
6) Extract the files and copy the following to the .vpn directory on your server
   - *scp can be used to copy files across the network if you downloaded the files on your local machine, and you connect to the server through ssh*
   - crl.rsa.2048.pem
   - ca.rsa.2048.crt
   - An open vpn configuration file of your choice
7) Modify the .ovpn file that you copied to the server and make the following changes (Credit to [sebgl](https://github.com/sebgl/htpc-download-box#privateinternetaccesscom-custom-setup))
   ```
   client
   dev tun
   proto udp
   remote nl.privateinternetaccess.com 1198
   resolv-retry infinite
   nobind
   persist-key
   # persist-tun # disable to completely reset vpn connection on failure
   cipher aes-128-cbc
   auth sha1
   tls-client
   remote-cert-tls server
   auth-user-pass /vpn/vpn.auth # to be reachable inside the container
   comp-lzo
   verb 1
   reneg-sec 0
   crl-verify /vpn/crl.rsa.2048.pem # to be reachable inside the container
   ca /vpn/ca.rsa.2048.crt # to be reachable inside the container
   disable-occ
   keepalive 10 30 # send a ping every 10 sec and reconnect after 30 sec of unsuccessfull pings
   pull-filter ignore "auth-token" # fix PIA reconnection auth error that may occur every 8 hours
   ```
4) Start the tracking services
   ```
   docker-compose up -d
   ```
5) Navigate to ombi.example.com. Ensure there is a valid ssl certificate
- Radarr is exposed on port 7878
- Sonarr is exposed on port 8989
- Jackett is exposed on port 9117
- Deluge is exposed on port 8112
  - Default password is 'deluge'
- Download the torrent from [torguard](https://torguard.net/checkmytorrentipaddress.php?hash=0a2581d541a31d62f278b8beebdc4383f1044499) and upload to deluge to check that the vpn is working as expected
  - Note that since there are no seeders for this file, there will not be any download activity. After uploading the torrent to deluge, wait a couple minutes and check the torguard site to check the ip that Deluge is using
  - The ip location can be checked at [iplocation](https://iplocation.com/)

#### Configuring Jackett
##### Configuring indexers

#### Configuring Radarr/Sonarr
##### Connecting to Jackett
##### Connecting to Deluge
##### Connecting to Emby

#### Configuring Deluge
##### Configuring download directories

#### Configuring Ombi
##### Connecting to radarr
##### Connecting to sonarr
##### Connecting to Emby
##### Configuring Email
##### Importing Users from Emby


# Next Steps

After completing the above steps, you should be done! Test that you can request a movie/tv show on ombi, and watch it start downloading in Deluge. After the file is finished downloading, Sonarr/Radarr will notify the emby server to rescan the library.
Enjoy!

   
# Notes
- The content security polices may need to be tweaked some to find a good balance between full security and a functioning system. Services were checked against [Observatory](https://observatory.mozilla.org)
  - Emby has a B rating
  - Nextcloud has an A+ rating
  - Ombi has a B rating
  - Traefik has an A+ rating
- The vpn connection seems to slow down after it is open for a while
- If this happens, restart the vpn and deluge containers. If deluge does not work after restarting, run the following and press y to any prompts. The deluge configuration and download directories will still exist, so you will not lose any progress
  ```
  docker-compose kill deluge
  docker-compose rm deluge
  docker-compose up -d
  ```
# Useful Links
- [Configuring Traefik](https://www.digitalocean.com/community/tutorials/how-to-use-traefik-as-a-reverse-proxy-for-docker-containers-on-ubuntu-16-04)
- [Configuring Nextcloud email](https://docs.nextcloud.com/server/13/admin_manual/configuration_server/email_configuration.html)
- Much of the credit for configuring the trackers and download clients should go to the maintainer of https://github.com/sebgl/htpc-download-box





