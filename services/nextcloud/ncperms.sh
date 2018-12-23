#!/bin/bash
ncpath='/mnt/md1/services/nextcloud/data'
htuser='www-data'
htgroup='www-data'
rootuser='root'

printf "Creating possible missing Directories\n"
mkdir -p $ncpath/data
mkdir -p $ncpath/assets
mkdir -p $ncpath/updater

printf "chmod Files and Directories\n"
find ${ncpath}/ -type f -print0 | xargs -0 chmod 0770
find ${ncpath}/ -type d -print0 | xargs -0 chmod 0775

printf "chown Directories\n"
chown -R ${rootuser}:${htgroup} ${ncpath}
chown -R ${htuser}:${htgroup} ${ncpath}/apps/
chown -R ${htuser}:${htgroup} ${ncpath}/assets/
chown -R ${htuser}:${htgroup} ${ncpath}/config/
chown -R ${htuser}:${htgroup} ${ncpath}/data/
chown -R ${htuser}:${htgroup} ${ncpath}/themes/
chown -R ${htuser}:${htgroup} ${ncpath}/updater/

chmod +x ${ncpath}/occ

printf "chmod/chown .htaccess\n"
if [ -f ${ncpath}/.htaccess ]
 then
  chmod 0644 ${ncpath}/.htaccess
  chown ${rootuser}:${htgroup} ${ncpath}/.htaccess
fi
if [ -f ${ncpath}/data/.htaccess ]
 then
  chmod 0644 ${ncpath}/data/.htaccess
  chown ${rootuser}:${htgroup} ${ncpath}/data/.htaccess
fi
